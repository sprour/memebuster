# Full website boilerplate

Serverless + Serverless Authentication + Angular 2 Boilerplate

This should get you up and running with a new website easily.  I'm developing this while learning and it may not
always follow best practices, **don't trust me**.

I'd be happy to hear about ways of improving this, drop me an email or open an issue.

# Features

* Login via Facebook or Google (you could set up MS too) (authentication/)
* Saves a simple user profile from your login provider in DynamoDb (authentication/)
* Sample REST methods to show how to manipulate a DynamoDb table (in cars/)

# Serverless Plugins

I've included the following plugins

* serverless-cors-plugin - Adds CORS headers to your API calls so you can use the default endpoint URL's with your nice friendly website URL 
* serverless-client-s3 - Deploys the client folder to an amazon S3 bucket
* serverless-optimizer-plugin - Reduces the size of your lambda functions for faster deploys and startup times
* serverless-mocha-plugin - Run mocha tests on your functions
* serverless-dynamodb-fixtures-plugin - Load static data into your dynamodb for testing


I've been developing against the live dynamoddb and not the local version, that's one piece I plan on looking into in the future.


# Setup

Deploy your resources (like DB tables)

> sls resources deploy

Load up some sample data:

> sls dynamodb load

This loads the data in the fixtures/ folder into you dynamodb tables using [serverless-dynamodb-fixtures-plugin](https://github.com/marc-hughes/serverless-dynamodb-fixtures-plugin)


# Some hints on how to develop

This project has been a learning experience for me while I learn how to best develop serverless apps.  Here's a few things I've learned.

## The backend...

Most of the time while working on the backend, I develop locally and run the functions via mocha inside 
Webstorm so I can get an interactive debugger.  [Here is how I set that up](readme-images/debugconfig.png)

See cars/test/*.js for the actual tests that get run.  Those are initially generated with something like:

> sls function mocha-create readCar

But I find I have to modify some paths inside the generated code to get the tests to work right.


You can run one from the cli like so:

> sls function mocha-run readCar

Run that from the cars/ folder and you should see something like so:


````
  readCar
    ✓ should return a list of cars (205ms)

  readCarHandler
    ✓ should return a list of cars (102ms)


  2 passing (325ms)
````


## The frontend...

Most of the time, while developing the client, I run it locally but it hits the real remote endpoints.  To do that, I run:

> npm start

within the client directory.  It'll serve on http://localhost:3000/

But to make that work, I needed to enable CORS headers to allow localhost to hit the api endpoints which is not the best idea for production.  

NOTE: this does mean you have to `sls function deploy XXXX` if you make backend changes. 


## Deploying...

Deploy the client

> sls client deploy

Deploy all functions & endpoints

> sls function deploy

> sls endpoint deploy



-------------------------------------------------------------


# Original Docs

This project is the conglomeration of a couple other projects.

The base client app docs are in client/Readme.md

The base Serverless Authentication app docs follow:

# Serverless Authentication
[![serverless](http://public.serverless.com/badges/v3.svg)](http://www.serverless.com)

This project is aimed to be a generic authentication boilerplate for the [Serverless framework](http://www.serverless.com).

This boilerplate is compatible with the Serverless v.0.5.3+. To install Serverless framework run `npm install -g serverless`.

Webapp demo that uses this boilerplate: http://laardee.github.io/serverless-authentication-gh-pages

## Use cases

1. You can use this as a base for your project and create resource functions and endpoints to this project.

2. If you wish to add authentication functions to an existing project, you can download [dist/authentication.zip](https://github.com/laardee/serverless-authentication-boilerplate/blob/master/dist/authentication.zip) and [dist/authorization.zip](https://github.com/laardee/serverless-authentication-boilerplate/blob/master/dist/authorization.zip) which contains authentication and authorization files. Then extract files to your project and run `npm install` in both directories. Remember to create DynamoDB table for cache.

3. Decouple authentication and resources. Use this project as an authentication provider and create resources
 to another Serverless project. To authorize request in resource api, you need 
 to copy [dist/authorization.zip](https://github.com/laardee/serverless-authentication-boilerplate/blob/master/dist/authorization.zip) files to the project and define tokenSecret environmental variable that matches the authentication project's tokenSecret, which is used to verify JSON Web Token.

## Installation

Installation will create one DynamoDB table for OAuth state and refresh tokens.

1. Create a new project based on this boilerplate `serverless project install -n myAuthenticationProject serverless-authentication-boilerplate`. Don't mind the `WARNING: This variable is not defined: NNN` warnings, those will be set in next step.
2. Change directory to the one that was created in previous step and set [environmental variables](#env-vars).
3. Run `serverless dash deploy` on the project root folder. Select all and `Deploy`.

**Few small issues with the Serverless v.0.5. and AWS Lambda**

If you are upgrading project runtime, you need to remove the old lambda function from the AWS first before you can deploy functions with node 4.3 runtime. You may also need to do some manual adjustment with Custom Authorizer AWS Console.

## Set up Authentication Provider Application Settings

The redirect URI that needs to be defined in oauth provider's application settings is the callback endpoint of the API. For example if you use facebook login, the redirect URI is **https://API-ID.execute-api.us-east-1.amazonaws.com/dev/authentication/callback/facebook** and for google **https://API-ID.execute-api.us-east-1.amazonaws.com/dev/authentication/callback/google**.

## <a id="env-vars"></a>Environmental Variables

Open _meta/variables/s-variables-STAGE.json where STAGE is the stage you are using e.g. s-variables-dev.json in "dev" stage.

If you are using stage "dev", then contents of the s-variables-dev.json should be
```
{
  "stage": "dev",
  "redirectClientURI": "http://url-to-frontend-webapp/",
  "tokenSecret": "secret-for-json-web-token",
  "providerFacebookId": "facebook-app-id",
  "providerFacebookSecret": "facebook-app-secret",
  "providerGoogleId": "google-app-id",
  "providerGoogleSecret": "google-app-secret",
  "providerMicrosoftId": "microsoft-app-id",
  "providerMicrosoftSecret": "microsoft-app-secret",
  "providerCustomGoogleId": "google-app-id",
  "providerCustomGoogleSecret": "google-app-secret"
}
```

Environmental variables are mapped in s-function.json files, for example in the authentication/signin/s-function.json. If you add more providers, those should be added to the s-function.json files also and if you don't use all the providers provided in this example, remove variables from _meta/variables/s-variables-STAGE.json and s-function.json files.

## The Structure

Authentication
* authentication/signin
  * endpoint: /authentication/signin/{provider}, redirects to oauth provider login page
  * handler: signin function creates redirect url to oauth provider and saves `state` to DynamoDB
* authentication/callback
  * endpoint: /authentication/callback/{provider}, redirects back to client webapp with token url parameter
  * handler: function is called by oauth provider with `code` and `state` parameters and it creates authorization and refresh tokens
* authentication/refresh
  * endpoint: /authentication/refresh/{refresh_token}, returns new authentication token and refresh token
  * handler: function revokes refresh token

Authorization
* authorization/authorize
  * endpoint: no end point
  * handler: is used by Api Gateway custom authorizer

Testing
* test-token/test-token
  * endpoint: /test-token
  * handler: test-token function can be used to test custom authorizer, it returns principalId of custom authorizer policy. It is mapped as username in request template.

## Provider Packages

* facebook [serverless-authentication-facebook](https://www.npmjs.com/package/serverless-authentication-facebook)
* google [serverless-authentication-google](https://www.npmjs.com/package/serverless-authentication-google)
* windows live [serverless-authentication-microsoft](https://www.npmjs.com/package/serverless-authentication-microsoft)
* more to come

If the authentication provider that you need is not listed, you can make a [custom provider](#custom-provider) or create a provider package for others to use. Here is an example repository that can be used as a starting point https://github.com/laardee/serverless-authentication-provider. When you implement a new fancy provider, create an issue or a pull request and it will be added to the Provider Packages listing.

## <a id="custom-provider"></a>Custom Provider

Package contains example [/authentication/lib/custom-google.js](https://github.com/laardee/serverless-authentication-boilerplate/blob/master/authentication/lib/custom-google.js) how to implement custom authentication provider using generic Provider class. To test custom provider go to http://laardee.github.io/serverless-authentication-gh-pages and click 'custom-google' button.

## Running Tests on Mac

* Install Docker
* Run ./specs-docker.sh