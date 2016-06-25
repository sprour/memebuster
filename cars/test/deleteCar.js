'use strict';
// tests for deleteCar
// Generated by serverless-mocha-plugin

const mod         = require('../deleteCar/handler.js');
const car         = require('../lib/car.js')
const Promise     = require('bluebird');
const mochaPlugin = require('serverless-mocha-plugin');
const wrapper     = mochaPlugin.lambdaWrapper;
const assert      = mochaPlugin.chai.assert;

const liveFunction = {
    region: process.env.SERVERLESS_REGION,
    lambdaFunction: process.env.SERVERLESS_PROJECT + '-deleteCar'
}

describe('deleteCar', () => {
    var carToDelete;

    before(function (done) {
//  wrapper.init(liveFunction); // Run the deployed lambda 
        wrapper.init(mod);

        car.createCar('Unit Test Car', 2100, 100).then((c)=>{
            carToDelete = c;
            done()
        });
    })

    it('should delete a car', (done) => {
        wrapper.run({
            id: carToDelete.id
        }, (err, response) => {
            car.getCar(carToDelete.id)
                .then((result) => {

                    assert.isNotOk(result.Item); // should not find the car after it's deleted.
                    done();
                })
                .catch(done);
        });
    });
});
