const fs = require('fs');
const WeatherCodes = require("../resources/weather-codes-icon-map.json");
const WeatherLocations = require("../resources/zip-codes-to-geo-coords.json");

// Functions
function dateTimeNow() {
    var currentDateTimeRaw = new Date(); 
    var currentDateTimeFormatted = (currentDateTimeRaw.getMonth()+1)+'/'+
                                (currentDateTimeRaw.getDate())+'/'+
                                (currentDateTimeRaw.getFullYear())+' '+
                                (currentDateTimeRaw.getHours())+':'+
                                (currentDateTimeRaw.getMinutes())+':'+
                                (currentDateTimeRaw.getSeconds())+' ';
    return currentDateTimeFormatted;
}

function logConnectionRecord(page, requestType) {
    console.log(dateTimeNow()+'[Request '+requestType+'] <'+page+'>');
    writeToLog(dateTimeNow()+'[Request '+requestType+'] <'+page+'>');
}

function writeToLog(content) {
    var currentDateTimeRaw = new Date(); 
    var currentDateTimeFormatted = (currentDateTimeRaw.getMonth()+1)+'_'+
                                (currentDateTimeRaw.getDate())+'_'+
                                (currentDateTimeRaw.getFullYear());
    fs.writeFile('./logs/'+currentDateTimeFormatted+'.txt', content+'\n', { flag: 'a+' }, error => {
        if(error) {
            console.log(error);
            return;
        }
    })
}

function formatDateFromTimestamp(timestamp) {
    let tsDate = new Date(timestamp * 1000);
    let formattedDate = tsDate.toLocaleDateString("en-US", {weekday: 'long'})

    return formattedDate;
  }

function formatTimeFromTimestamp(timestamp) {
    let tsDate = new Date(timestamp * 1000);
    let formattedDate = tsDate.toLocaleTimeString("en-US", {hour: 'numeric', minute: '2-digit'})

    return formattedDate;
}

module.exports = {dateTimeNow, logConnectionRecord, writeToLog, formatDateFromTimestamp, formatTimeFromTimestamp}