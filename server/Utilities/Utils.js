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

module.exports = {
	addRating,
	removeRating,
	addMovieToWishList,
	removeMovieFromWishList,
};
