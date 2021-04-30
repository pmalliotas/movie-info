const express = require('express');
const router = express.Router();
const User = require('../Models/User');
const Authenticate = require('../Utilities/Authenticate');
const Utils = require('../Utilities/Utils');

router.post('/rateMovie', Authenticate.verifyToken, async (req, res) => {
	const verificationData = Authenticate.verifyUserToken(req.token);
	if (!verificationData) {
		return res.status(401).json({
			message: 'Could not authenticate user',
		});
	}

	const userData = await User.findOne({ email: verificationData.email });

	try {
		userData.genreRatings = Utils.addRating(userData.genreRatings, req.body);
		await userData.save();
	} catch (err) {
		return res.status(400).json({
			message: err,
		});
	}
	res.status(200).json({
		message: "Rating saved successfully",
	});
});

router.post('/removeRatingMovie', Authenticate.verifyToken, async (req, res) => {
	const verificationData = Authenticate.verifyUserToken(req.token);
	if (!verificationData) {
		return res.status(401).json({
			message: 'Could not authenticate user',
		});
	}

	const userData = await User.findOne({ email: verificationData.email });

	try {
		userData.genreRatings = Utils.removeRating(userData.genreRatings, req.body);
		await userData.save();
	} catch (err) {
		return res.status(400).json({
			message: err,
		});
	}
	res.status(200).json({
		message: "Rating removed successfully",
	});
});

router.post('/addMovieToWishlist', Authenticate.verifyToken, async (req, res) => {
	const verificationData = Authenticate.verifyUserToken(req.token);
	if (!verificationData) {
		return res.status(401).json({
			message: 'Could not authenticate user',
		});
	}

	const userData = await User.findOne({ email: verificationData.email });

	try {
		userData.wishList = Utils.addMovieToWishList(userData.wishList, req.body.movieId);
		await userData.save();
	} catch (err) {
		return res.status(400).json({
			message: err,
		});
	}
	res.status(200).json({
		message: "Movie added to wishlist successfully",
	});
});

router.post('/removeMovieFromWishlist', Authenticate.verifyToken, async (req, res) => {
	const verificationData = Authenticate.verifyUserToken(req.token);
	if (!verificationData) {
		return res.status(401).json({
			message: 'Could not authenticate user',
		});
	}

	const userData = await User.findOne({ email: verificationData.email });

	try {
		userData.wishList = Utils.removeMovieFromWishList(userData.wishList, req.body.movieId);
		await userData.save();
	} catch (err) {
		return res.status(400).json({
			message: err,
		});
	}
	res.status(200).json({
		message: "Movie removed from wishlist successfully",
	});
});

router.post('/getRecommendedMovies', Authenticate.verifyToken, async (req, res) => {
	const verificationData = Authenticate.verifyUserToken(req.token);
	if (!verificationData) {
		return res.status(401).json({
			message: 'Could not authenticate user',
		});
	}

	const userData = await User.findOne({ email: verificationData.email });

	const recommendedGenres = Utils.getRecommendedGenres(userData.genreRatings);
	
	const movies = await Utils.getRecommendedGenresMoviesFromDB(recommendedGenres);

	const movieData = await Utils.getMoviesData(movies);

	res.status(200).json({
		message: "Movie removed from wishlist successfully",
		movieData
	});
});

module.exports = router;