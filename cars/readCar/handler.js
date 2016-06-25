'use strict';

const car = require('../lib/car');

module.exports.handler =
    (event, context, callback) =>
        car.getCars()
            .then((result) => callback(null, result.Items))
            .catch(callback);
