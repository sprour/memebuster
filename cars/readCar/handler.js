'use strict';

const car = require('../lib/car');

module.exports.handler =
    (event, context, callback) => {
        if(event.id) {
            return car.getCar(event.id)
                .then((result) => callback(null, result.Item))
                .catch(callback);
        } else {
            return car.getCars()
                .then((result) => callback(null, result.Items))
                .catch(callback);
        }
    }
