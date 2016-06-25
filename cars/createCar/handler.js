'use strict';

const car = require('../lib/car');

module.exports.handler =
    (event, context, callback) =>
        car.createCar(event.make, event.year, event.mileage)
            .then((result) => callback(null, result))
            .catch(callback);
