var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser')
const user = require('../Model/user')
const passport = require('passport')
const Authenti = require('../Authenticate')
router.use(bodyParser.json())

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', function(req, res, next) {
  user.register(new user({username: req.body.username}),
   req.body.password, (err,name) =>{
    if (err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err:err})
    }
    else{
      passport.authenticate('local')(req, res, ()=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json')
        res.json({success: true, status: 'Registration Successful'})
      })
    }
  })
})

router.post('/login', passport.authenticate('local'), (req, res) => {
  var token = Authenti.getToken({_id: req.user._id})
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token, status: 'You are successfully logged in!'});
});

router.get('/logout', (req, res, next) => {
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
})

module.exports = router;
