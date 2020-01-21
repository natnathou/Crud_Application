const mongoose     = require('mongoose');
const picture      = require('./picture');

const tipoulSchema = new mongoose.Schema({
	name: String,
	description: String,
	image: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'picture'
	}
});

module.exports     = mongoose.model('tipoul', tipoulSchema);