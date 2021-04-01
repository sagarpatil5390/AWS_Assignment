const AWS = require('aws-sdk');
exports._getSecretDetails = async function(secret_key) {
  const client = new AWS.SecretsManager({
    region: process.env.AWS_REGION
  });
  return new Promise((resolve, reject) => {
    client.getSecretValue({SecretId: secret_key}, (err, data) => {
      if(err) {
        reject(err);
      } else {
        if ('SecretString' in data) {
          resolve(JSON.parse(data.SecretString));
        } else {
          let buff = new Buffer(data.SecretBinary, 'base64');
          resolve(JSON.parse(buff.toString('ascii')));
        }
      }
    });
  });
};