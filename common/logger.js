const fs = require("fs");

// Static variables
const logdir = "logs/";
if (!fs.existsSync(logdir)){
    fs.mkdirSync(logdir);
}
const logname = `${getFullTime()}.log`;
const logfile = logdir + logname;
const logstream = fs.createWriteStream(logfile);

function getFullTime(){
    const d = new Date();
    return `${d.getDate()}-${d.getMonth()+1}-${d.getFullYear()}_${d.getHours()}\uA789${d.getMinutes()+1}\uA789${d.getSeconds()+1}`;
}

function logThis(text, error = false){
    var logLevel = 'INFO'
    if (error) {
        logLevel = 'ERRO'
        console.error(text)
    } else {
        console.log(text)
    }
    logstream.write(`[${logLevel}] ${getFullTime()} - ${text}\n`);
}

function logError(text){
    logThis(text, true)
}

exports.getFullTime = getFullTime
exports.logThis = logThis
exports.logError = logError