const mongoose = require('mongoose')
require('mongoose-currency').loadType(mongoose)
const schema = mongoose.Schema;
const currency = mongoose.Types.Currency;

const promoSchema = new schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    label : {
        type: String,
        default: ''
    },
    price : {
        type: currency,
        required: true,
        min: 0
    },
    description : {
        type: String,
        required: true
    },
    featured :{
        type: Boolean,
        default: false
    }
},{
    timestamps: true
})

const Promotions = mongoose.model('Promotion', promoSchema);

module.exports = Promotions