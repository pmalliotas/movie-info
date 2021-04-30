const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	firstName: String,
	lastName: String,
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	userName: {
		type: String,
		required: true,
	},
	movies: [
		{
			_id: false,
			movieId: String,
			rating: Number,
			genres: String,
		},
	],
	genreRatings: [
		{
			_id: false,
			genreName: String,
			rating: {
				type: Number,
				default: 0,
			},
			totalRatings: {
				type: Number,
				default: 0,
			},
		},
	],
	wishList: [
		{
			_id: false,
			movieId: String,
		},
	],
});

module.exports = mongoose.model('User', UserSchema);
