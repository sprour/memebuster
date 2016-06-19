'use strict';

// Config
const slsAuth = require('serverless-authentication');
const config = slsAuth.config;
const utils = slsAuth.utils;

// Authorize
function authorize(event, callback) {
  let error = null;
  let policy;
  console.log("Checking authorization");
  if (event.authorizationToken) {
    try {
      const providerConfig = config(event);
      const data = utils.readToken(event.authorizationToken, providerConfig.token_secret, {ignoreExpiration:true});
      console.log("data", data);
      policy = utils.generatePolicy(data.id, 'Allow', event.methodArn);
    } catch (err) {
      console.log("Error validating token", err)
      error = 'Unauthorized';
    }
  } else {
    console.log("No authorization token provided");
    error = 'Unauthorized';
  }
  callback(error, policy);
}

exports = module.exports = {
  authorize
};
