const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    tag: String,
});

module.exports = mongoose.model('post', postSchema);