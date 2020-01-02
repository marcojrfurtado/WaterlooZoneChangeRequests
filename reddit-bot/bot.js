const Snoowrap = require('snoowrap');
const axios = require('axios')

const creds = require("./credentials.json");
const constants = require("./constants.json");
const { logThis, logError } = require("../common/logger")

logThis("Waterloo Zone Change Requests Bot 1.0");
logThis(`Scheduling runs every ${constants.intervalMinutes} minutes`)

const redditClient = new Snoowrap(creds);
const waterlooSubReddit = redditClient.getSubreddit(constants.subreddit)

var allSubmissionsByZoneChangeId = {}

function createPostForZoneChange(zoneChangeRequest) {
    if (zoneChangeRequest.id in allSubmissionsByZoneChangeId) {
        return
    }
    waterlooSubReddit.search({
        query: zoneChangeRequest.id
    }).then( (listing) => {
        if (listing.length > 1) {
            throw "Found more than 1 post submission for the same zone change. PLease manually delete them before running this bot."
        } else if (listing.length == 1) {
            allSubmissionsByZoneChangeId[zoneChangeRequest.id] = listing[0]
        } else {
            logThis(`Creating a new post for zone change ${zoneChangeRequest.id}`)
            waterlooSubReddit.submitLink({
                title: zoneChangeRequest.locationName,
                url: zoneChangeRequest.detailsUrl
            }).then((submission) => {
                allSubmissionsByZoneChangeId[zoneChangeRequest.id] = submission
            })
        } 
    })
}

async function main() {
    try {
        const response = await axios.get(constants.backendUrl + '/fetch')
        response.data.forEach( (zoneChangeRequest) => {
            createPostForZoneChange(zoneChangeRequest)
        })
    } catch (err) {
        logError("An error occurred while trying to fetch from backend. "+err)
    } finally {
        setTimeout(main, constants.intervalMinutes*60*1000)
    }
}

main()