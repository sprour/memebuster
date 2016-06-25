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


function createCar(make, year, mileage) {
    let id = uuid.v4();

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


function updateCar(id, make, year, mileage, callback) {

    const params = {
        TableName: table,
        Key: { id : id },
        UpdateExpression: 'set #make = :make, #mileage = :mileage, #year = :year',
        ExpressionAttributeNames: {
            "#make": "make",
            "#year": "year",
            "#mileage": "mileage"
        },
        ExpressionAttributeValues: {
            ":make": make,
            ":year": year,
            ":mileage": mileage
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

function getCar(id) {


    return dbget({TableName:table, Key:{id:id}});
}

function getCars() {
    let params = {
        TableName: table
    };

    return dbscan(params);
}

exports = module.exports = {
    updateCar: updateCar,
    getCars: getCars,
    createCar: createCar
};
