const favoriteRouter = require('express').Router();
const bodyParser = require('body-parser')
const Favorites = require('../Model/Favorites');
const Authenticate = require('../Authenticate')
const cors = require('./cors')

favoriteRouter.use(bodyParser.json())

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req,res) => res.sendStatus(200))
.get( cors.cors, Authenticate.verifyUser, (req,res,next)=>{
    Favorites.findOne({user: req.user._id})
    .populate('user')
    .populate('dishes')
    .then((doc)=>{
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(doc)
    })
    .catch(err => next(err))
})

.post(cors.corsWithOptions, Authenticate.verifyUser, (req,res,next)=>{
    Favorites.findOne({user: req.user._id}, (err,doc)=>{
        if(err){
            return next(err)
        }
        else if(doc != null){
            var d = 0;
            var len =  req.body.length;
            for(var i=0; i< len; i++){
                if(doc.dishes.indexOf(req.body[i]._id) == -1){
                    doc.dishes.push(req.body[i]._id)
                    d++
                }
            }
            if(d==0){
                var er = new Error('All dishes are already included in the favorite list')
                er.status = 400
                return next(er)
            }
            else{
                doc.save()
                .then((favdoc)=>{
                    Favorites.findById(favdoc._id)
                    .populate('user')
                    .populate('dishes')
                    .then((favdoc)=>{
                        console.log('Favorite list has been updated', favdoc)
                        res.statusCode = 200
                        res.setHeader('Content-Type', 'application/json')
                        res.json(favdoc)
                    })
                })
                .catch(err=> next(err))
            }
        }
        else{
            const fav = new Favorites()
            fav.user = req.user._id
            for(var i=0; i< req.body.length; i++){
                fav.dishes.push(req.body[i]._id)
            }
            fav.save((err,favdoc)=>{
                if(err){
                    return next(err)
                }
                else{
                    Favorites.findById(favdoc._id)
                    .populate('user')
                    .populate('dishes')
                    .then((favdoc)=>{
                        console.log('Favorite list has been updated', favdoc)
                        res.statusCode = 200
                        res.setHeader('Content-Type', 'application/json')
                        res.json(favdoc)
                    })
                }
            })
        }
    })
})

.delete(cors.corsWithOptions, Authenticate.verifyUser, (req,res,next)=>{
    Favorites.remove({user: req.user._id})
    .then((resp)=>{
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(resp)
    })
    .catch(err=> next(err))
});

favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req,res) => res.sendStatus(200))

.get(cors.cors, Authenticate.verifyUser, (req,res,next)=> {
    Favorites.findOne({user: req.user._id})
    .then((favorites)=> {
        if(!favorites){
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json({exists: false, favorites: favorites})
        }
        else{
            if(favorites.dishes.indexOf(req.params.dishId) < 0){
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json({exists: false, favorites: favorites})
            }
            else{
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json({exists: true, favorites: favorites})
            }
        }
    }, err=> next(err))
    .catch(err=> next(err))
})

.post(cors.corsWithOptions, Authenticate.verifyUser, (req,res,next)=>{
    Favorites.findOne({user: req.user._id}, (err,doc)=>{
        if(err){
            return next(err)
        }
        else if(doc != null){
            if(doc.dishes.indexOf(req.params.dishId) !== -1){
                var er = new Error('This dish is already a favorite')
                er.status = 400
                return next(er)
            }
            else{
                doc.dishes.push(req.params.dishId)
                doc.save((err,favdoc)=>{
                    if(err){
                        return next(err)}
                    else{
                        Favorites.findById(favdoc._id)
                        .populate('user')
                        .populate('dishes')
                        .then((favdoc)=>{
                        console.log('Favorite list has been updated', favdoc)
                        res.statusCode = 200
                        res.setHeader('Content-Type', 'application/json')
                        res.json(favdoc)
                    })
                    }
                })
            }
        }
        else{
            const fav = new Favorites()
            fav.user = req.user._id
            fav.dishes.push(req.params.dishId)
            fav.save((err,favdoc)=>{
                if(err){
                    return next(err)
                }
                else{
                    Favorites.findById(favdoc._id)
                    .populate('user')
                    .populate('dishes')
                    .then((favdoc)=>{
                        console.log('Favorite list has been updated', favdoc)
                        res.statusCode = 200
                        res.setHeader('Content-Type', 'application/json')
                        res.json(favdoc)
                    })
                }
            })
        }
    })
})

.delete(cors.corsWithOptions, Authenticate.verifyUser, (req,res,next)=>{
    Favorites.findOne({user: req.user._id}, (err,doc)=>{
        if(err){
            return next(err)
        }
        else if(doc != null){
            if(doc.dishes.indexOf(req.params.dishId) !== -1){
                var arr = doc.dishes.filter((id)=> id != req.params.dishId)
                doc.dishes = arr
                doc.save((err,favdoc)=>{
                    if(err){
                        return next(err)
                    }
                    else{
                        Favorites.findById(favdoc._id)
                        .populate('user')
                        .populate('dishes')
                        .then((favdoc)=>{
                        console.log('Favorite list has been updated', favdoc)
                        res.statusCode = 200
                        res.setHeader('Content-Type', 'application/json')
                        res.json(favdoc)
                    })
                    }
                })
            }
            else{
                var er = new Error('This Dish is not your favorite')
                er.status = 400
                return next(er)
            }
        }
        else{
            var er = new Error('You don\'t have a favorite list')
            er.status = 400
            return next(er)
        }
    })
});

module.exports = favoriteRouter