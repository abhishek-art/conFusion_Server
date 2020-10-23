const mongoose = require('mongoose')
require('mongoose-currency').loadType(mongoose)
const schema = mongoose.Schema;
const currency = mongoose.Types.Currency;

const dishSchema = new schema({
    name : {
        type: String,
        required: true,
        unique: true
    },
    description : {
        type: String,
        required: true
    },
    image : {
        type: String,
        required : true
    },
    category: {
        type: String,
        required : true
    },
    label: {
        type: String,
        default: ''
    },
    price : {
        type: currency,
        required: true,
        min: 0
    },
    featured :{
        type: Boolean,
        default: false
    }
},
{
    timestamps: true
})

const Dishes = mongoose.model('Dish', dishSchema);

module.exports = Dishes