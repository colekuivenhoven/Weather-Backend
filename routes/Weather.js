/* --- WEATHER ROUTE --- */
var cors = require('cors');
var corsOptions = {
    "origin": '*',
    "Access-Control-Allow-Origin": "*"
}

// Import Resources
require('dotenv').config();
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const global_functions = require('../resources/globalFunctions.js');
const WeatherCodes = require("../resources/weather-codes-icon-map.json");
const WeatherLocations = require("../resources/zip-codes-to-geo-coords.json");

module.exports = function(app) {
    app.use(cors(corsOptions));
    app.get('/weather/get/:lat/:long', (req, res) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

        let coordsLat = req.params.lat;
        let coordsLong = req.params.long;
        let responseObj_5Day;
        let responseObj_OneCall;
        let currentWeatherObjectsBuffer = [];

        fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${coordsLat}&lon=${coordsLong}&units=imperial&appid=${process.env.OPENWEATHER_KEY}`)
        .then(res => res.json())
        .then(json => {
            responseObj_5Day = json;
            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${coordsLat}&lon=${coordsLong}&exclude=hourly,minutely&units=imperial&appid=${process.env.OPENWEATHER_KEY}`)
            .then(res => res.json())
            .then(json => {
                responseObj_OneCall = json;
            })
            .then(() => {
                for(let i = 0; i < 5; i++) {
                    currentWeatherObjectsBuffer.push({
                        date: i == 0 ? "Today" : i == 1 ? "Tomorrow" : global_functions.formatDateFromTimestamp(responseObj_OneCall.daily[i].dt),
                        city: responseObj_5Day.city.name,
                        weather: responseObj_OneCall.daily[i].weather[0].main,
                        weather_code: Object.keys(WeatherCodes).indexOf(responseObj_OneCall.daily[i].weather[0].icon),
                        temp_high: Math.round(responseObj_OneCall.daily[i].temp.max),
                        temp_low: Math.round(responseObj_OneCall.daily[i].temp.min),
                        temp_feel: Math.round(responseObj_OneCall.daily[i].feels_like.day),
                        wind_speed: responseObj_OneCall.daily[i].wind_speed,
                        humidity: responseObj_OneCall.daily[i].humidity,
                        uv: responseObj_OneCall.daily[i].uvi,
                        sunrise: global_functions.formatTimeFromTimestamp(responseObj_OneCall.daily[i].sunrise),
                        sunset: global_functions.formatTimeFromTimestamp(responseObj_OneCall.daily[i].sunset)
                    })
                }
            })
            .then(() => {
                global_functions.logConnectionRecord('Get Weather Info From Zipcode', req.method);
                res.status(200).json({
                    data: currentWeatherObjectsBuffer
                });
            })
        });
    });
}