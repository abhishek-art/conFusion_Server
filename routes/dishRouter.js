const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const authenticate = require('../Authenticate')
const cors = require('./cors')

const Dishes = require('../Model/Dishes')

const dishRouter = express.Router(); 

dishRouter.use(bodyParser.json())

dishRouter.route('/')
.options(cors.corsWithOptions, (req,res) => res.sendStatus(200))
.get( cors.cors, (req,res,next) => {
    Dishes.find(req.query)
    .populate('comments.author')
    .then((dishes)=>{
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(dishes)
    })
    .catch(err=> next(err))
})

.post(cors.corsWithOptions, authenticate.verifyUser ,authenticate.verifyAdmin, (req,res,next) => {
    Dishes.create(req.body)
    .then((dish)=>{
        console.log('Dish Created ', dish)
        res.statusCode= 200
        res.setHeader('Content-Type', 'application/json')
        res.json(dish)
    })
    .catch(err=> next(err))
})

.put(cors.corsWithOptions, authenticate.verifyUser ,authenticate.verifyAdmin, (req,res,next) => {
    authenticate.verifyAdmin(req.user, res, next)
    res.statusCode= 403
    res.end("PUT operation not supported")
})

.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next)=>{
    //authenticate.verifyAdmin(req.user, res, next)
    Dishes.remove({})
    .then((resp)=>{
        res.statusCode= 200
        res.setHeader('Content-Type', 'application/json')
        res.json(resp)
    })
    .catch(err=> next(err))
});

dishRouter.route('/:dishId')
.options(cors.corsWithOptions, (req,res) => res.sendStatus(200))
.get(cors.cors,(req,res,next) => {
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dishes)=>{
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(dishes)
    })
    .catch(err=> next(err))
})

.post(cors.corsWithOptions, authenticate.verifyUser , authenticate.verifyAdmin, (req,res,next) => {
    res.statusCode= 403
    res.end("POST operation not supported on /dishes/"+req.params.dishId)
})

.put(cors.corsWithOptions, authenticate.verifyUser , authenticate.verifyAdmin, (req,res,next) => {
    Dishes.findByIdAndUpdate(req.params.dishId, {
        $set: req.body
    },{new: true})
    .then((dish)=>{
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(dish)
    })
    .catch(err=> next(err))
})

.delete(cors.corsWithOptions, authenticate.verifyUser , authenticate.verifyAdmin, (req,res,next)=>{
    Dishes.findByIdAndRemove(req.params.dishId)
    .then((resp)=>{
        res.statusCode= 200
        res.setHeader('Content-Type', 'application/json')
        res.json(resp)
    })
    .catch(err=> next(err))
});


module.exports = dishRouter