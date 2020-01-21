const mongoose      = require('mongoose');

const pictureSchema = new mongoose.Schema({
	data: Buffer,
	contentType: String,
	name: String
});

module.exports      = mongoose.model('picture', pictureSchema);