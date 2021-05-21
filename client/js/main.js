$(document).ready(() => {
	$('#searchForm').on('submit', (e) => {
		let searchText = $('#searchText').val();
		getMovies(searchText);
		e.preventDefault();
	});
});

function getMovies(searchText) {
	axios
		.get('http://www.omdbapi.com?s=' + searchText + '&apikey=76cc9b33')
		.then((response) => {
			console.log(response);
			let movies = response.data.Search;
			let output = '';
			$.each(movies, (index, movie) => {
				output += `
            <div class="col-md-3" style="margin: 20px">
              <div class="well text-center">
                <img src="${movie.Poster}">
                <h5>${movie.Title}</h5>
                <a onclick="movieSelected('${movie.imdbID}')" class="btn btn-primary" href="#">Movie Details</a>
              </div>
            </div>
          `;
			});

			$('#movies').html(output);
			document.getElementById('movies').scrollIntoView({ behavior: 'smooth' });
		})
		.catch((err) => {
			console.log(err);
		});
}

function movieSelected(id) {
	window.localStorage.setItem('movieId', id);
	window.location = 'movie.html';
	return false;
}

function getMovie() {
	let movieId = window.localStorage.getItem('movieId');
	let movieRating;
	let moviegenres;
	axios
		.post(
			'http://localhost:5000/movies/getMovieRating',
			{
				movieId: movieId,
			},
			{
				headers: {
					Authorization: `Bearer ${window.localStorage.getItem('token')}`,
				},
			}
		)
		.then((response) => {
			try {
				movieRating = response.data.movieRating.rating;
			} catch (err) {}

			axios
				.get('http://www.omdbapi.com?i=' + movieId + '&apikey=76cc9b33')
				.then((response) => {
					let movie = response.data;
					moviegenres = movie.Genre;
					let output = `
          <div class="row">
            <div class="col-md-4">
              <img src="${movie.Poster}" class="thumbnail">
            </div>
            <div class="col-md-8">
              <h2>${movie.Title}</h2>
              <ul class="list-group">
                <li class="list-group-item"><strong>Genre:</strong> ${
									movie.Genre
								}</li>
                <li class="list-group-item"><strong>Released:</strong> ${
									movie.Released
								}</li>
                <li class="list-group-item"><strong>Rated:</strong> ${
									movie.Rated
								}</li>
                <li class="list-group-item"><strong>IMDB Rating:</strong> ${
									movie.imdbRating
								}</li>
                <li class="list-group-item"><strong>Director:</strong> ${
									movie.Director
								}</li>
                <li class="list-group-item"><strong>Writer:</strong> ${
									movie.Writer
								}</li>
                <li class="list-group-item"><strong>Actors:</strong> ${
									movie.Actors
								}</li>
              </ul>
              ${getRatingTemplate()}
            </div>
          </div>
          <div class="row">
            <div class="well">
              <h3>Plot</h3>
              ${movie.Plot}
              <hr>
              <a href="http://imdb.com/title/${
								movie.imdbID
							}" target="_blank" class="btn btn-primary">View IMDB</a>
              <a href="index.html" class="btn btn-default">Go Back To Search</a>
            </div>
          </div>
        `;
					window.localStorage.setItem('moviescore', movieRating);
					window.localStorage.setItem('moviegenres', moviegenres);
					window.localStorage.setItem('movieId', movieId);
					$('#movie').html(output);
					const elem = 'star' + movieRating;
					document.getElementById(elem).checked = true;
				})
				.catch((err) => {
					console.log(err);
				});
		})
		.catch((err) => {
			console.log(err);
		});
}

function getRecommendedMovies() {
	axios
		.post('http://localhost:5000/movies/getRecommendedMovies', null, {
			headers: {
				Authorization: `Bearer ${window.localStorage.getItem('token')}`,
			},
		})
		.then((response) => {
			let movies = response.data.movieData;
			let output = '';
			$.each(movies, (index, movie) => {
				output += `
            <div class="col-md-3" style="margin: 20px;">
              <div class="well text-center">
                <img src="${movie.Poster}">
                <h5>${movie.Title}</h5>
                <a onclick="movieSelected('${movie.imdbID}')" class="btn btn-primary" href="#">Movie Details</a>
              </div>
            </div>
          `;
			});
			if (movies.length == 0) {
				$('#recommendedMovies').html('No available recommended movies yet');
				return;
			}
			$('#recommendedMovies').html(output);
		})
		.catch((err) => {
			console.log(err);
		});
}
getRecommendedMovies();

function getRatingTemplate() {
	return `<div class="rate" id="rate" onclick="getRating(event)">
  <input type="radio" id="star10" name="rate" value="10" />
  <label for="star10" title="text">10 stars</label>
  <input type="radio" id="star9" name="rate" value="9" />
  <label for="star9" title="text">9 stars</label>
  <input type="radio" id="star8" name="rate" value="8" />
  <label for="star8" title="text">8 stars</label>
  <input type="radio" id="star7" name="rate" value="7" />
  <label for="star7" title="text">7 stars</label>
  <input type="radio" id="star6" name="rate" value="6" />
  <label for="star6" title="text">6 stars</label>
  <input type="radio" id="star5" name="rate" value="5" />
  <label for="star5" title="text">5 stars</label>
  <input type="radio" id="star4" name="rate" value="4" />
  <label for="star4" title="text">4 stars</label>
  <input type="radio" id="star3" name="rate" value="3" />
  <label for="star3" title="text">3 stars</label>
  <input type="radio" id="star2" name="rate" value="2" />
  <label for="star2" title="text">2 stars</label>
  <input type="radio" id="star1" name="rate" value="1" />
  <label for="star1" title="text">1 star</label>
</div>`;
}

function getRating(e) {
	if (e.target.matches('input')) {
		if (window.localStorage.getItem('moviescore')) {
			axios
				.post(
					'http://localhost:5000/movies/removeRatingMovie',
					{
						movieId: window.localStorage.getItem('movieId'),
					},
					{
						headers: {
							Authorization: `Bearer ${window.localStorage.getItem('token')}`,
						},
					}
				)
        .then((response) => {
          window.localStorage.setItem("moviescore", e.target.value);
					axios
						.post(
							'http://localhost:5000/movies/rateMovie',
							{
								rating: e.target.value,
								genres: window.localStorage.getItem('moviegenres'),
								movieId: window.localStorage.getItem('movieId'),
							},
							{
								headers: {
									Authorization: `Bearer ${window.localStorage.getItem(
										'token'
									)}`,
								},
							}
						)
						.then((response) => {
							console.log(response);
						})
						.catch((err) => {
							console.log(err);
						});
				})
				.catch((err) => {
					console.log(err);
				});
    } else {
      window.localStorage.setItem("moviescore", e.target.value);
			axios
				.post(
					'http://localhost:5000/movies/rateMovie',
					{
						rating: e.target.value,
						genres: window.localStorage.getItem('moviegenres'),
						movieId: window.localStorage.getItem('movieId'),
					},
					{
						headers: {
							Authorization: `Bearer ${window.localStorage.getItem('token')}`,
						},
					}
				)
				.then((response) => {
					console.log(response);
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}
}
