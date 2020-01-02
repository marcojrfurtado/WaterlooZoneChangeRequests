import axios from 'axios'

const defaultBackendHost = window.location.hostname
const defaultBackendPort = 3001

const backend = process.env.BACKEND || `${defaultBackendHost}:${defaultBackendPort}`

const fetchDataUrl = `//${backend}/fetch`

const fetchData = function() {
    return new Promise( (resolve, reject) => {
        axios.get(fetchDataUrl)
        .then( (res) => {
            resolve(res.data)
        }).catch( (err) => {
            console.error(err)
            reject(err)
        })
    })
}

export default fetchData;