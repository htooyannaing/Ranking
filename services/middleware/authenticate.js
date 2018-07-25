var {User} = require('../../models/User');

var authenticate = (req, res, next) => {

  // if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
};

module.exports = {authenticate};
