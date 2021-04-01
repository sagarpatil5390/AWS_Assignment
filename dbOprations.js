const AWS = require('aws-sdk');

AWS.config.update({ region: "us-east-2" });
const documentClient = new AWS.DynamoDB.DocumentClient({ region: "us-east-2" });

exports.getWeatherInfo = async city => {
   const params = {
      TableName: "cities",
      Key: {
	    name: city
      }
   }
   try {
      return await documentClient.get(params).promise();
   } catch(err) {
     return err;
   }
}

exports.addWeatherInfo = async (data, city) => {
   const params = {
      TableName: "cities",
      Item:{
        "name": city,
        "info": data,
        "updatedAt": Date.now()
    }
   }
   try {
      return await documentClient.put(params).promise();
   } catch(err) {
     return err.message;
   }
}

exports.updateWeatherInfo = async (data, city) => {
   const params = {
      TableName: "cities",
      Key: {
          name: city
      },
      UpdateExpression: "set info = :info, updatedAt=:dt",
      ExpressionAttributeValues:{
        ":info": data,
        ":dt": Date.now()
      },
      ReturnValues:"UPDATED_NEW"
   }
   try {
      return await documentClient.update(params).promise();
   } catch(err) {
     console.log(err);
   }
}