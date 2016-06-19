"use strict";

const profile = require('./profile');

function meHandler(event, context, callback) {
    // console.log("in meHandler", event, callback);
    if (event.username) {
        return profile.getProfile(event.username, function(err, result){
            let profile = result.Item;
            context.succeed({
                uid: profile.uid,
                name: profile.name,
                email: profile.email,
                picture: profile.picture
            });
        });

    }
    return callback('No uid Specified');
}

exports = module.exports = meHandler;