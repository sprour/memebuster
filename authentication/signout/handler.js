'use strict';

const lib = require('../lib');

module.exports.handler =
    (event, context, callback) =>
        lib.signoutHandler(event, callback);
