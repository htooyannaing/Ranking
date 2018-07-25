const { User }= require('../models/User');
const jwt = require('jwt-simple');
const config = require('../config/keys');

function tokenForUser(userId) {
    const timestamp = new Date().getTime();
    return jwt.encode( { sub: userId, iat: timestamp }, config.secret);
}

exports.signin = function(req, res, next) {
    // User has already had their email and password auth'd
    // We just need to give them a token
    res.send({ token: tokenForUser(req.user.userId), user: req.user });
}