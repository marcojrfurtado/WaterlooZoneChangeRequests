

const hiddenProperties = new Set(["locationCoordinates", "id", "locationUrl"])


const formattedLabels = {
    'applicant' : 'Applicant',
    'ward': 'Ward',
    'owner': 'Owner',
    'staffContactName': 'Staff Contact Name',
    'staffContactEmail': 'Staff Contact E-mail',
    'locationName': 'Location',
    'detailsUrl': 'More Details'
}

const formatProperty = (key) => {
    return formattedLabels[key] || key
}

const mailToRegex = /mailto:(%20)?/
const removeMailToPrefix = (mailToParameter) => {
    return mailToParameter.replace(mailToRegex,'')
}

export{
    hiddenProperties,
    formatProperty,
    removeMailToPrefix
}