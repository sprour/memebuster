'use strict';

const table = `${process.env.SERVERLESS_STAGE}-${process.env.SERVERLESS_PROJECT}-profile`;
const config = { region: process.env.SERVERLESS_REGION };
if (process.env.LOCAL_DDB_ENDPOINT) config.endpoint = process.env.LOCAL_DDB_ENDPOINT;

// Common
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient(config);
const async = require('async');
const crypto = require('crypto');

/**
 * Creates OAuth State
 * @param callback
 */
function createProfile(uid, email, name, picture, provider, callback) {
  console.log(`createProfile ${uid} ${email} ${name} ${picture} ${provider}` );
  const params = {
        TableName: table,
        Key: { uid : uid },
        UpdateExpression: 'set #email = :email, #name = :name, #picture = :picture, #provider = :provider',
        ExpressionAttributeNames: {
          "#email": "email",
          "#picture": "picture",
          "#name": "name",
          "#provider": "provider"
        },
        ExpressionAttributeValues: {
          ":email": email,
          ":picture": picture,
          ":name": name,
          ":provider": provider
        }
      };

  dynamodb.update(params, (error, data) => {
      if(error) {
          console.log(error, error.stack);
          callback(error);
      } else {
          callback(null);
      }
  });
}

function getProfile(uid, callback) {
  dynamodb.get({TableName:table, Key:{uid:uid}}, callback)
}

exports = module.exports = {
    createProfile: createProfile,
    getProfile: getProfile
};
