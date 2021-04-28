const express = require('express');
const cors = require('cors');
require('dotenv').config();
const UsersRoute = require('./Routes/Users');
const MoviesRoute = require('./Routes/Movies');
const mongoose = require('mongoose');

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors({ origin: '*' }));

app.use('/users', UsersRoute);
app.use('/movies', MoviesRoute);

try {
	mongoose.connect(process.env.DB_CONNECTION, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
	console.log('Connected to Database');
} catch (e) {
	console.log(e);
}

app.listen(process.env.PORT, () => {
	console.log(`Server running on port: ${process.env.PORT}`);
});
