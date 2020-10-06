const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const user = require('./Model/user')
const jwt = require('jsonwebtoken')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const config = require('./Config')

exports.local = passport.use(new LocalStrategy(user.authenticate()))
passport.serializeUser(user.serializeUser())
passport.deserializeUser(user.deserializeUser())

exports.getToken = (user)=>{
    return jwt.sign(user, config.secretKey, {expiresIn: 3600})
}

var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = config.secretKey

exports.jwtPassport = passport.use(new JwtStrategy(opts, 
    function(jwt_payload, done){
        console.log("JWT payload ", jwt_payload);
        user.findOne({_id: jwt_payload._id}, (err,doc)=>{
            if(err){
                return done(err, false)
            }
            else if(doc){
                return done(null, doc)
            }
            else{
                return done(null, false)
            }
        })
}))

exports.verifyUser = passport.authenticate('jwt',{session: false})