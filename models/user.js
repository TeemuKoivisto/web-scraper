var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	primary: String,
	google: {
		id: String,
		email: String,
		picture: String,
		displayName: String
	},
	facebook: {
		id: String,
		email: String,
		picture: String,
		displayName: String
	}
});

var User = mongoose.model('User', userSchema);
module.exports = User;