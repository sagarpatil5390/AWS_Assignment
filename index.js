
const { getWeatherInfo, updateWeatherInfo, addWeatherInfo } = require("./dbOprations");
const { getWeatherDetailsByCity } = require("./weatherAPI");
exports.handler = async (event) => {
    try {
        let city = event["city"];
        let weatherDetails = {};
        
        // Get weather Details from database
        const currentWeatherInfo = await getWeatherInfo(city);
        if(currentWeatherInfo.Item) {
            let today = new Date();
            let lastWeatherUpdatedAT   = new Date(currentWeatherInfo.Item.updatedAt);
            let seconds = (today.getTime() - lastWeatherUpdatedAT.getTime()) / 1000;
            // check if information is older than 20 seconds
            if(seconds >=20) {
                // Call and API to get Weather information
                const getWeatherDetailsFromAPI = await getWeatherDetailsByCity(city);
                const weatherData = {...getWeatherDetailsFromAPI};
                // update if information is older than 20 seconds
                const updatedInfo = await updateWeatherInfo(weatherData, city);
                weatherDetails = updatedInfo.Attributes;
            } else {
                weatherDetails = currentWeatherInfo;
            }
        } else {
            const getWeatherDetailsFromAPI = await getWeatherDetailsByCity(city);
            const addnew = await addWeatherInfo({...getWeatherDetailsFromAPI}, city);
            weatherDetails = await getWeatherInfo(city);
        }
        
        return {
            statusCode: 200,
            body: weatherDetails,
        };
    } catch(err) {
        return  {
            statusCode: 500,
            message: err.message ? err.message : "Something went wrong",
        }
    }
};

