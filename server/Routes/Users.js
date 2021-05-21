const express = require('express');
const router = express.Router();
const User = require('../Models/User');
const Authenticate = require('../Utilities/Authenticate');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
	if (await Authenticate.userExists(req.body.email)) {
		return res.status(400).json({
			message: 'User already exists',
		});
	}
	let user;
	try {
		user = await createUser(req.body);
		await user.save();
	} catch (err) {
		return res.status(400).json({
			message: err,
		});
	}
	res.status(200).json({
		message: 'User created successfully',
		user
	});
});

router.post('/login', async (req, res) => {
	if (!(await Authenticate.verifyUser(req.body))) {
		return res.status(401).json({
			message: 'Could not authenticate user',
		});
	}
	const token = jwt.sign({ email: req.body.email }, process.env.PRIVATE_KEY);
	res.status(200).json({
		message: 'User authenticated',
		token,
	});
});

async function createUser(user) {
	return new User({
		userName: user.userName,
		email: user.email,
		password: await Authenticate.hashPassword(user.password),
		firstName: user.firstName || undefined,
		lastName: user.lastName || undefined,
	});
}

module.exports = router;
