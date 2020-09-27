var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser')
const user = require('../Model/user')
router.use(bodyParser.json())

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', function(req, res, next) {
  user.findOne({username: req.body.username})
  .then((name)=>{
    if (name!=null) {
      var err = new Error('User ' + req.body.username + ' already exists')
      err.status = 403
      next(err)
    }
    else{
      return user.create({
        username: req.body.username,
        password: req.body.password
      })
    }
  })
  .then((name)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json')
    res.json({status: 'Registration Successful', user: name})
  })
  .catch(err => next(err))
})

router.post('/login', (req,res,next) => {
  if (!req.session.user) {
    var authHeader = req.headers.authorization;
    if (!authHeader) {
        var err = new Error('You are not authenticated!');
        res.setHeader('WWW-Authenticate', 'Basic');              
        err.status = 401;
        next(err);
        return;
    }
    var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    var username = auth[0];
    var password = auth[1];

    user.findOne({username: username})
    .then((name)=>{
      if(name == null){
        var err = new Error('User ' + username + ' does not exist');           
        err.status = 403;
        next(err);
      }
      else if(name.password !== password){
        var err = new Error('Your Password is Incorrect!')
        err.status = 403;
        next(err)
      }
      else if (name.username === username && name.password === password) {
        req.session.user = 'authenticated'
        res.statusCode = 200
        res.setHeader('Content-Type', 'text/plain')
        res.end('You are authenticated')
      }
    })
    .catch(err => next(err))
  }
  else{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain')
    res.end('You are already authenticated')
  }
})

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
