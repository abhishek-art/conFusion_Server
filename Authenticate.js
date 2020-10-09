const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const user = require('./Model/user')
const jwt = require('jsonwebtoken')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const config = require('./Config')
const { NotExtended } = require('http-errors')

passport.use(new LocalStrategy(user.authenticate()))
passport.serializeUser(user.serializeUser())
passport.deserializeUser(user.deserializeUser())

exports.getToken = (user)=>{
    return jwt.sign(user, config.secretKey, {expiresIn: 7200})
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

 {/*passport.use("admin" ,new JwtStrategy(opts, 
    function(jwt_payload, done){
        user.findOne({_id: jwt_payload._id}, (err,doc)=>{
            if(err){
                return done(err,false)
            }
            else if(doc.admin){
                return done(null, doc)
                }
            else{
                var erro = new Error("You are not authorized to perform this operation!")
                erro.status = 403
                return done(erro, false)
            }
        })
    })
 )

exports.verifyAdmin = passport.authenticate('admin', {session: false})*/}

exports.verifyAdmin = (req,res,next) => {
    if (req.user.admin){
        return next()
    }
    else{
        var erro = new Error("You are not authorized to perform this operation!")
        erro.status = 403
        return next(erro)
    }
}