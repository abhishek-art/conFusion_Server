const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    author: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dish: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish'
    }
},{
    timestamps: true
})

module.exports = mongoose.model('Comment', commentSchema)