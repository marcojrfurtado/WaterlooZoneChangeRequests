const { getZoneChangeRequests } = require('./lib/scrapper')
const { logThis, logError } = require('../common/logger')
const express = require('express')
const cors = require('cors')

const app = express()
const port = process.env.PORT || 3001
const poolingIntervalMinutes = process.env.INTERVAL || 120

var zoneChangeRequestIds = new Set()
var zoneChangeRequests = []

const useTestData = process.argv.includes('-TEST')

const appRouter = function(app) {
    app.get("/fetch", cors(), function(req, res) {
        res.send(zoneChangeRequests)
    });
}
appRouter(app)

function addZoneChangeRequest(newZoneChangeRequest) {
    if (zoneChangeRequestIds.has(newZoneChangeRequest["id"])) {
        return;
    }
    zoneChangeRequestIds.add(newZoneChangeRequest["id"])
    zoneChangeRequests.push(newZoneChangeRequest)
}

function updateRecords() {
    getZoneChangeRequests().then( (result) => {
        logThis(`Received ${result.length} zone change requests from the City of Waterloo. Updating records...`)
        result.forEach(addZoneChangeRequest)
    }).catch( (reason) => {
        logError("An issue has occurred while fetching zone change requests, details: "+reason)
    })
}

if (!useTestData) {
    updateRecords()
    setInterval(updateRecords, poolingIntervalMinutes*60*1000)
} else {
    zoneChangeRequests = require('./test/data')
    logThis("Using test data")
}

app.listen(port, function() {
    logThis(`RESTFUL API started on ${port}. Pooling interval is set to ${poolingIntervalMinutes} minutes`)
})

