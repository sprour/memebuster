'use strict';

function createResponseData(id) {
  // 1 week expiration
  const authorizationToken = {
    payload: {
      id
    },
    options: {
      expiresIn: 7 * 24 * 60 * 60
    }
  };

  return { authorizationToken };
}

exports = module.exports = {
  createResponseData
};
