var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	email: { type: String, unique: true, lowercase: true },
	displayName: String,
	picture: String,
	facebook: String,
	google: String
});

var User = mongoose.model('User', userSchema);
module.exports = User;