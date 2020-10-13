const mongoose = require('mongoose')
const schema = mongoose.Schema

const favoriteSchema = new schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dishes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish'
    }]
})

const Favorites = mongoose.model('favorite', favoriteSchema)

module.exports = Favorites