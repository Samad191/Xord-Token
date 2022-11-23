const mongoose = require('mongoose');

const lastBlockSchema = new mongoose.Schema({
    lastBlock: {
        type: String,
        required: true,
    }
})

const lastBlock = mongoose.model('LastBlock', lastBlockSchema)
module.exports = { lastBlock }