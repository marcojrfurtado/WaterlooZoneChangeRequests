const request = require("request");
const cheerio = require('cheerio');
const jsonframe = require('jsonframe-cheerio')

const WATERLOO_ZONE_CHANGES_URL = 'https://www.waterloo.ca/en/government/zone-changes.aspx'

const GOOGLE_MAPS_URL_COORDS_REGEX = /\@(?<latitude>(\-)?[0-9]+\.[0-9]+)\,(?<longitude>(\-)?[0-9]+\.[0-9]+)/

const frame = {
    "zoneChangeInformation" : {
        _s: "table.icrtAccordion > tbody > tr",
        _d: [{
            "id": "a @ name",
            "applicant": "tr td:contains('Applicant') + td",
            "owner": "tr td:contains('Owner') + td",
            "ward": "tr td:contains('Ward') + td",
            "staffContactName": "tr td:contains('Staff contact') + td",
            "staffContactEmail": "tr td:contains('Staff contact') + td a @ href",
            "locationName": "tr td:contains('Location') + td",
            "locationUrl": "tr td:contains('Location') + td a @ href",
        }]
    }
}

const isMinifiedGoogleMapsUrl = (url) => {
    return url.startsWith("https://goo.gl/maps/")
}

const extractLocationCoordinates = async(minifiedGMapsUrl) => {
    return new Promise( (resolve, reject) => {
        request(minifiedGMapsUrl, function(error,response,html) {
            if (!error && response.statusCode == 200) {
                let originalPathName = response.request.uri.pathname
                let matches = GOOGLE_MAPS_URL_COORDS_REGEX.exec(originalPathName)
                if (matches) {
                    resolve([matches.groups.latitude, matches.groups.longitude])
                } else {
                    reject("Unable to extract coordinates from URL")
                }
            } else {
                reject("StatusCode: " +  response.statusCode + ", Details: " + error)
            }   
        })
    })
}

const getZoneChangeInformationUrl = (zoneRequestId) => {
    return WATERLOO_ZONE_CHANGES_URL + '#' + zoneRequestId
}

const scrapePage = (html) => {
    let $ = cheerio.load(html)
    jsonframe($)
    let result = $('body').scrape(frame, { string: true })
    let resultJson = JSON.parse(result)
    const zoneChangeInformationLen = resultJson["zoneChangeInformation"].length
    let filteredResult = []
    for (i = 0; i < zoneChangeInformationLen; i++) {
        let zoneChangeEntry = resultJson["zoneChangeInformation"][i]
        if (!("id" in zoneChangeEntry)) {
            continue;
        }
        if (Object.keys(zoneChangeEntry).length > 1) {
            zoneChangeEntry["detailsUrl"] = getZoneChangeInformationUrl(zoneChangeEntry["id"])
            filteredResult.push(zoneChangeEntry)
        } else if ((i+1) < zoneChangeInformationLen) {
            resultJson["zoneChangeInformation"][i+1]["id"] = zoneChangeEntry["id"]
        }
    }
    return filteredResult
}

const getZoneChangeRequestsWithoutCoordinates = async() => {
    return new Promise( (resolve, reject) => {
        request(WATERLOO_ZONE_CHANGES_URL, function (error, response, html) {
            if (!error && response.statusCode == 200) {
                try {
                    resolve(scrapePage(html))
                } catch(error) {
                    reject("StatusCode: " +  response.statusCode + ", Details: " + error)
                }
            } else {
                reject(error)
            }
        })
    })  
}

const getZoneChangeRequests = async() => {
    let zoneChangeRequests = await getZoneChangeRequestsWithoutCoordinates()
    await Promise.all(zoneChangeRequests.map( (zoneChangeEntry) => {
        if ("locationUrl" in zoneChangeEntry) {   
            return extractLocationCoordinates(zoneChangeEntry["locationUrl"]).then( (coords) => {
                zoneChangeEntry["locationCoordinates"] = coords
                Promise.resolve(true)
            }).catch( (error) => {
                console.warn("Unable to extract coordinates for zoneChange " + zoneChangeEntry["id"] + ". "
                + error +". Skipping...")
                Promise.resolve(false)
            })
        }
    }))
    return zoneChangeRequests
}

module.exports.getZoneChangeRequests = getZoneChangeRequests