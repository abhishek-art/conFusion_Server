const express = require('express')
const cors = require('cors')

const app = express()

const whitelist = ['http://localhost:3000', 'https://localhost:3443', 'http://LAPTOP-AR0F6FDR:3001'];
var corsOptionsDelegate = (req, callback) => {
    var corsOptions;
    if(whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true };
        console.log('Cors is working fine')
    }
    else {
        corsOptions = { origin: false };
        console.log('Cors is not working fine')
    }
    callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);