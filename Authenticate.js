const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const user = require('./Model/user')

exports.local = passport.use(new LocalStrategy(user.authenticate()))
passport.serializeUser(user.serializeUser())
passport.deserializeUser(user.deserializeUser())