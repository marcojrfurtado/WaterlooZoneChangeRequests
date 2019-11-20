const zoneChanges = require('../lib/waterlooZoneChanges')
zoneChanges.getZoneChangeRequests().then( (result) => {
    console.log(result)
}).catch( (error) => {
    console.error("An issue has occurred, details: "+error)
})