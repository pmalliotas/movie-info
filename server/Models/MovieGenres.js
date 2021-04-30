const mongoose = require("mongoose");

const RecommendedMovies = new mongoose.Schema({
    _id:false,
    Action: [{
        movieId: String,
    }],
    Adventure: [{
        movieId: String,
    }],
    Animation: [{
        movieId: String,
    }],
    Comedy: [{
        movieId: String,
    }],
    Crime: [{
        movieId: String,
    }],
    Documentary: [{
        movieId: String,
    }],
    Drama: [{
        movieId: String,
    }],
    Family: [{
        movieId: String,
    }],
    Fantasy: [{
        movieId: String,
    }],
    History: [{
        movieId: String,
    }],
    Horror: [{
        movieId: String,
    }],
    Music: [{
        movieId: String,
    }],
    Mystery: [{
        movieId: String,
    }],
    Romance: [{
        movieId: String,
    }],
    ScienceFiction: [{
        movieId: String,
    }],
    Thriller: [{
        movieId: String,
    }],
    War: [{
        movieId: String,
    }],
    Western: [{
        movieId: String,
    }],
})

module.exports = mongoose.model('RecommendedMovies', RecommendedMovies);