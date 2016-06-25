"use strict";

const cache = require('./cache');
const async = require('async');

function meHandler(event, context, callback) {
    // console.log("in meHandler", event, callback);
    if (event.username) {
        async.parallel({
            revokeRefreshToken: (_callback) => {
                cache.revokeRefreshToken(event.username, _callback);
            }
        });
        
    }
    return callback('No uid Specified');
}

exports = module.exports = meHandler;