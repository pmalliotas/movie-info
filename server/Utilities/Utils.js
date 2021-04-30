const axios = require('axios');
const RecommendedMovies = require('../Models/MovieGenres');

function splitGenres(genres) {
	const ommitCommas = genres.replace(/,/g, '');
	return ommitCommas.split(' ');
}

function addRating(userGenreRatings, genreRating) {
	const genres = splitGenres(genreRating.genres);

	for (seperateGenre of genres) {
		let genreFound = false;
		for (genre of userGenreRatings) {
			if (genre.genreName == seperateGenre) {
				genre.rating += genreRating.rating;
				genre.totalRatings += 1;
				genreFound = true;
			}
		}
		if (!genreFound) {
			userGenreRatings.push({
				genreName: seperateGenre,
				rating: genreRating.rating,
				totalRatings: 1,
			});
		}
	}

	return userGenreRatings;
}

function removeRating(userGenreRatings, genreRating) {
	const genres = splitGenres(genreRating.genres);
	for (seperateGenre of genres) {
		for (genre of userGenreRatings) {
			if (genre.totalRatings == 0) continue;
			if (genre.genreName == seperateGenre) {
				genre.rating -= genreRating.rating;
				genre.totalRatings -= 1;
			}
		}
	}
	return userGenreRatings;
}

function addMovieToWishList(wishList, movieId) {
	if (!wishList.some((movie) => movie.movieId == movieId)) {
		wishList.push({
			movieId: movieId,
		});
	}
	return wishList;
}

function removeMovieFromWishList(wishList, movieId) {
	let newWishList = wishList;
	if (wishList.some((movie) => movie.movieId == movieId)) {
		newWishList = wishList.filter((movie) => movie.movieId != movieId);
	}
	return newWishList;
}

function getRecommendedGenres(userGenreRatings) {
	const recommendedGenres = [];
	for (genreRating of userGenreRatings) {
		if (genreRating.totalRatings == 0) continue;
		const genreScore = ((genreRating.rating / genreRating.totalRatings) * (0.1 * genreRating.totalRatings)).toFixed(5);
		const genreToRecommend = {
			genreName: genreRating.genreName,
			genreScore: parseFloat(genreScore)
		}
		recommendedGenres.push(genreToRecommend);
	}
	recommendedGenres.sort((genreA, genreB) => {
		return genreB.genreScore - genreA.genreScore;
	})
	return recommendedGenres;
}

async function getRecommendedGenresMoviesFromDB(recommendedGenres) {
	const data = [];
	const MovieGenres = await RecommendedMovies.find();
	for (genre of recommendedGenres) {
		data.push(MovieGenres[0][genre.genreName]);
	}
	return data.slice(0,2);
}

async function getMoviesData(recommendedGenres) {
	const data = [];
	for (genre of recommendedGenres) {
		for (movie of genre) {
			const res = await axios.get(`http://www.omdbapi.com/?i=${movie.movieId}&apikey=76cc9b33`);
			data.push(res.data);
		}
	}
	return data;
}

module.exports = {
	addRating,
	removeRating,
	addMovieToWishList,
	removeMovieFromWishList,
	getRecommendedGenres,
	getRecommendedGenresMoviesFromDB,
	getMoviesData
};
