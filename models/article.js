const mongoose      = require('mongoose');
const articleSchema = new mongoose.Schema({
	name: String,
	text: String,
});

module.exports      = mongoose.model('article', articleSchema);