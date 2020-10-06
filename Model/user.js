const mongoose = require('mongoose')
const schema = mongoose.Schema;
const Plm = require('passport-local-mongoose')

const user = new schema({
    admin: {
        type: Boolean,
        default: false,
    }
})

user.plugin(Plm)

module.exports = mongoose.model('User', user)