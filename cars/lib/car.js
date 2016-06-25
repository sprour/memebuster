'use strict';

const table = `${process.env.SERVERLESS_STAGE}-${process.env.SERVERLESS_PROJECT}-car`;
const config = { region: process.env.SERVERLESS_REGION };
if (process.env.LOCAL_DDB_ENDPOINT) config.endpoint = process.env.LOCAL_DDB_ENDPOINT;

// Common
const Promise       = require('bluebird');
const AWS           = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient(config);
const uuid          = require('uuid');

const dbget = Promise.promisify(dynamodb.get.bind(dynamodb));
const dbscan = Promise.promisify(dynamodb.scan.bind(dynamodb));
const dbput = Promise.promisify(dynamodb.put.bind(dynamodb));
const dbupdate = Promise.promisify(dynamodb.update.bind(dynamodb));
const dbdelete = Promise.promisify(dynamodb.delete.bind(dynamodb));

function deleteCar(id) {
    var params = {
        TableName: table,
        Key:{
            "id":id
        }
    };
    return dbdelete(params);
}

function createCar(make, year, mileage) {
    let id = uuid.v4(); // TODO - need to investigate to see if this it the best way to generate id's

    if(!make){
        return Promise.reject('No make specified');
    }

    let item = {
        id: id,
        make: make,
        year: year,
        mileage: mileage
    };

    var params = {
        Item: item,
        TableName: table
    };

    return dbput(params).then(() => Promise.resolve(item));
}


function updateCar(id, make, year, mileage) {
    var attributesToChange = {};
    var valuesToSet = {};
    var setExpressions = [];

    if(make) {
        attributesToChange["#make"] = "make";
        valuesToSet[":make"] = make;
        setExpressions.push("#make = :make")
    }
    if(year) {
        attributesToChange["#year"] = "year";
        valuesToSet[":year"] = year;
        setExpressions.push("#year = :year");
    }
    if(mileage) {
        attributesToChange["#mileage"] = "mileage";
        valuesToSet[":mileage"] = mileage;
        setExpressions.push("#mileage = :mileage");

    }

    const params = {
        TableName: table,
        Key: { id : id },
        UpdateExpression: 'set ' + setExpressions.join(","),
        ExpressionAttributeNames: attributesToChange,
        ExpressionAttributeValues: valuesToSet
    };

    return dbupdate(params);
}

function getCar(id) {
    return dbget({TableName:table, Key:{id:id}}).then((result) => result.Item);
}

function getCars() {
    let params = {
        TableName: table
    };

    // TODO: Handle paging
    return dbscan(params).then((result) => result.Items);
}

exports = module.exports = {
    updateCar: updateCar,
    getCars: getCars,
    createCar: createCar,
    getCar: getCar,
    deleteCar: deleteCar
};
