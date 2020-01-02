const zoneChanges = require('../lib/scrapper')
zoneChanges.getZoneChangeRequests().then( (result) => {
    console.log(JSON.stringify(result))
}).catch( (error) => {
    console.error("An issue has occurred, details: "+error)
})