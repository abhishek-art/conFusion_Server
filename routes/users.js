var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser')
const user = require('../Model/user')
const passport = require('passport')
const cors = require('./cors')
const Authenti = require('../Authenticate')
router.use(bodyParser.json())

/* GET users listing. */

router.options('*', cors.corsWithOptions, (req,res)=> { res.sendStatus(200)})

router.get('/', cors.corsWithOptions, Authenti.verifyUser , Authenti.verifyAdmin, function(req, res, next) {
  user.find({}, (err,doc)=>{
    if(err){
      res.statusCode = 404
      res.json({err: err})
    }
    else{
      res.statusCode = 200
      res.json(doc)
    }
  })

});

router.post('/signup',cors.corsWithOptions, function(req, res, next) {
  user.register(new user({username: req.body.username}),
   req.body.password, (err,name) =>{
    if (err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err:err})
    }
    else{
      if(req.body.firstname){
        name.firstname = req.body.firstname
      }
      if(req.body.lastname){
        name.lastname = req.body.lastname
      }
      name.save((err,doc)=>{
        if (err){
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err:err})
          return
        }
        else{
            passport.authenticate('local')(req, res, ()=>{
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json')
            res.json({success: true, status: 'Registration Successful'})
      })
    }
  })
}
})
})

router.post('/login', cors.corsWithOptions, (req, res, next) => {

  passport.authenticate('local',(err, user, info)=> {
    if(err){
      next(err)
    }
    else if (!user){
      res.statusCode = 401
      res.setHeader('Content-Type', 'application/json')
      res.json({success: false, status: 'Login Failed', err: info})
    }
    else{
      req.logIn(user, (err)=>{
        if(err){
          res.statusCode = 401
          res.setHeader('Content-Type', 'application/json')
          res.json({success: false, status: 'Login Failed'})
        }
        var token = Authenti.getToken({_id: req.user._id})
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, token: token, status: 'You are successfully logged in!'});
      })
    }
  })(req,res,next)
  
});

router.get('/logout', cors.corsWithOptions, (req, res, next) => {
  if(req.session){
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/')
  }
  else{
    var err = new Error('You are not Logged In')
    err.status = 403;
    next(err)
  }
});

router.get('/checkToken', cors.corsWithOptions, (req,res,next)=>{
  passport.authenticate('jwt', {session: false}, (err,user,info)=> {
    if(err) next(err)
    
    else if (!user) {
      res.statusCode = 401
      res.setHeader('Content-Type', 'application/json')
      res.json({success: false, status: 'JWT invalid', err: info})
    }
    else{
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.json({success: true, status: 'JWT valid', user: user})
    }
  })(req,res)
})

module.exports = router;
