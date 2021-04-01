const axios = require('axios');
const { _getSecretDetails } = require("./secretHelper");

exports.getWeatherDetailsByCity = async city => {
    const { apiKey } = await _getSecretDetails(process.env.secret_key);
    return axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)
    .then(response => {
        return response.data;
    }).catch(err => {
        throw new Error("Please enter valid city");
    });
}