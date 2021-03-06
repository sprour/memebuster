'use strict';
// tests for updateCar
// Generated by serverless-mocha-plugin

const mod         = require('../updateCar/handler.js');
const car         = require('../lib/car.js');
const mochaPlugin = require('serverless-mocha-plugin');
const wrapper     = mochaPlugin.lambdaWrapper;
const assert      = mochaPlugin.chai.assert;

const liveFunction = {
    region: process.env.SERVERLESS_REGION,
    lambdaFunction: process.env.SERVERLESS_PROJECT + '-updateCar'
}

describe('updateCar', () => {
    var newMileage;

    before(function (done) {
        wrapper.init(mod);

        car.getCar('test-car-1').then((sampleCar) => {
            newMileage = sampleCar.mileage + 10;
            done();
        })
    });

    it('should update an existing car mileage', (done) => {
        wrapper.run({
            id: 'test-car-1',
            mileage: newMileage
        }, (err, response) => {
            car.getCar('test-car-1').then((sampleCar) => {
                assert.equal(sampleCar.mileage, newMileage);
                done();
            })
        });
    });

});
