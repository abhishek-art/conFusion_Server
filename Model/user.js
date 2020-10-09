const mongoose = require('mongoose')
const schema = mongoose.Schema;
const Plm = require('passport-local-mongoose')

const user = new schema({
    firstname:{
        type: String,
        default: ''
    },
    lastname:{
        type: String,
        default: ''
    },
    admin: {
        type: Boolean,
        default: false,
    }
})

user.plugin(Plm)

module.exports = mongoose.model('User', user)