// passport.js

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const User = require('./models/user'); // Replace './models/user' with the path to your User model

// LocalStrategy for username/password authentication
passport.use(new LocalStrategy({
    usernameField: 'email', // Assuming email is the username field
    passwordField: 'password' // Assuming password is the password field
  },
  async (email, password, done) => {
    try {
      // Find user by email
      const user = await User.findOne({ email });

      // If user not found or password incorrect, return error
      if (!user || !await user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect email or password.' });
      }

      // If user found and password correct, return user
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

// JWTStrategy for JSON Web Token authentication
passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'your_jwt_secret' // Replace 'your_jwt_secret' with your actual JWT secret
  },
  async (jwtPayload, done) => {
    try {
      // Find user by ID from JWT payload
      const user = await User.findById(jwtPayload.sub);

      // If user not found, return error
      if (!user) {
        return done(null, false, { message: 'User not found.' });
      }

      // If user found, return user
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));