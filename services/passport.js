const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const keys = require("../config/keys");
const { User } = require("../models/User");
const bcrypt = require("bcrypt-nodejs");

passport.serializeUser((user, done) => {
	done(null, user.userId);
});

passport.deserializeUser((userId, done) => {
	User.findById(userId).then(user => {
		done(null, user);
	});
});

/// Create signin local strategy
const localLogin = new LocalStrategy({ usernameField: "email" }, function(
	email,
	password,
	done
) {
	User.findOne({ email: email }, function(err, user) {
		if (err) {
			return done(err);
		}
		if (!user) {
			return done(null, false);
		}

		// compare passwords - is `password` equal to user.password?
		user.comparePassword(password, async function(err, isMatch) {
			if (err) {
				return done(err);
			}
			if (!isMatch) {
				return done(null, false);
			}
			var result = {
				userId: user._id,
				email: email,
				name: user.name
			};
			return done(null, result);
		});
	});
});

// Create singup local strategy
const localSignup = new LocalStrategy(
	{
		usernameField: "email",
		passwordField: "password",
		passReqToCallback: true
	},
	function(req, email, password, done) {
		var name = req.body.name;
		if (!email || !password || !name) {
			return res
				.status(422)
				.send({ error: "You must provide user name, email and password" });
		}

		// Check Email Exists
		User.findOne({ email: email }, async function(err, existingUser) {
			if (err) {
				return done(err);
			}

			// if a user with email exist, return an error
			if (existingUser) {
				return res.status(422).send({ error: "Email is in use" });
			}

			// if email does not exist, create and save user
			const user = new User({
				email: email,
				password: password
			});

			// generate a salt then run callback
			await bcrypt.genSalt(10, function(err, salt) {
				if (err) {
					return done(err);
				}

				// hash (encrypt) our password using the salt
				bcrypt.hash(user.password, salt, null, function(err, hash) {
					if (err) {
						return done(err);
					}

					// overwrite plain text password with encrypted password
					user.password = hash;
				});
			});

			user.save(async function(err) {
				if (err) {
					return done(err);
				}

				var userObj = {
					userId: user._id,
					name: name
				};

				userObj.profileImg = await UserInfo.createUserInfo(userObj);

				// Set default role as tourist.
				userObj.roleId = 1;
				return done(null, userObj);
				//res.json({ token : tokenForUser(user._id), user: userObj });
			});
		});
	}
);

passport.use("local-login", localLogin);
passport.use("local-signup", localSignup);
