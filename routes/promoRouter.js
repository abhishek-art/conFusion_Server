const express = require('express')
const bodyParser = require('body-parser')
const Promotions = require('../Model/Promotions')
const authenticate = require('../Authenticate')
const cors = require('./cors')
//import Promotions from '../Model/Promotions';

const promoRouter = express.Router();

promoRouter.use(bodyParser.json())

promoRouter.route('/')
.options(cors.corsWithOptions, (req,res) => res.sendStatus(200))
.get(cors.cors, (req,res,next) => {
    Promotions.find(req.query)
    .then((promos)=>{
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(promos)
    })
    .catch(err=> next(err))
})

.post(cors.corsWithOptions, authenticate.verifyUser , authenticate.verifyAdmin, (req,res,next) => {
    Promotions.create(req.body)
    .then((promo)=>{
        console.log('Promotion Created ', promo)
        res.statusCode= 200
        res.setHeader('Content-Type', 'application/json')
        res.json(promo)
    })
    .catch(err=> next(err))
})

.put(cors.corsWithOptions, authenticate.verifyUser , authenticate.verifyAdmin, (req,res,next) => {
    res.statusCode= 403
    res.end("PUT operation not supported")
})

.delete(cors.corsWithOptions, authenticate.verifyUser , authenticate.verifyAdmin, (req,res,next)=>{
    Promotions.remove({})
    .then((resp)=>{
        res.statusCode= 200
        res.setHeader('Content-Type', 'application/json')
        res.json(resp)
    })
    .catch(err=> next(err))
});

promoRouter.route('/:promoId')
.options(cors.corsWithOptions, (req,res) => res.sendStatus(200))
.get(cors.cors, (req,res,next) => {
    Promotions.findById(req.params.promoId)
    .then((promo)=>{
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(promo)
    })
    .catch(err=> next(err))
})

.post(cors.corsWithOptions, authenticate.verifyUser , authenticate.verifyAdmin, (req,res,next) => {
    res.statusCode= 403
    res.end("POST operation not supported on /promotions/"+req.params.promoId)
})

.put(cors.corsWithOptions, authenticate.verifyUser , authenticate.verifyAdmin, (req,res,next) => {
    Promotions.findByIdAndUpdate(req.params.promoId, {
        $set: req.body
    },{new: true})
    .then((promo)=>{
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(promo)
    })
    .catch(err=> next(err))
})

.delete(cors.corsWithOptions, authenticate.verifyUser , authenticate.verifyAdmin, (req,res,next)=>{
    Promotions.findByIdAndRemove(req.params.promoId)
    .then((resp)=>{
        res.statusCode= 200
        res.setHeader('Content-Type', 'application/json')
        res.json(resp)
    })
    .catch(err=> next(err))
});

module.exports = promoRouter