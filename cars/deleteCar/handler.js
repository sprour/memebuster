'use strict';

const car = require('../lib/car');

module.exports.handler =
    (event, context, callback) =>
        car.deleteCar(event.id)
            .then((result) => callback(null, result))
            .catch(callback);
