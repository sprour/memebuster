'use strict';

const car         = require('../lib/car.js')
const mod         = require('../readCar/handler.js');
const mochaPlugin = require('serverless-mocha-plugin');
const wrapper     = mochaPlugin.lambdaWrapper;
const assert      = mochaPlugin.chai.assert;

// const liveFunction = {
//   region: process.env.SERVERLESS_REGION,
//   lambdaFunction: process.env.SERVERLESS_PROJECT + '-readCar'
// }


describe('readCar', () => {
    it('should return a list of cars', (done) => {
        car.getCars()
            .catch(done)
            .then((result)=> {

                assert.isAbove(result.Count, 5, "returned at least 6 cars"); // our sample data has 6 cars in it
                assert.isDefined(result.Items, "items exist");
                assert.isDefined(result.Items[0].year, "year exists");

                done();
            });
    });
});




describe('readCarHandler', () => {
    before(function (done) {
//  wrapper.init(liveFunction); // Run the deployed lambda
        wrapper.init(mod);
        done()
    })

    it('should return a list of cars', (done) => {
        wrapper.run({test:true}, (err, response) => {
            assert.isNotNull(response);
            assert.isDefined(response[0].year,  "year has been defined");
            assert.isDefined(response[0].make, "make has been defined");
            assert.isDefined(response[0].mileage, "mileage has been defined");
            done();
        });
    });

    it('should return exactly one car', (done) => {
        wrapper.run({id:'test-car-1'}, (err, response) => {
            assert.isNotNull(response);
            assert.isDefined(response.year,  "year has been defined");
            assert.isDefined(response.make, "make has been defined");
            assert.isDefined(response.mileage, "mileage has been defined");
            done();
        });
    });


});




