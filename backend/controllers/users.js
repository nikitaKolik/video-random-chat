const User = require('../models/User.js');
const signToken = require('../serverAuth.js').signToken;

module.exports = {
	// get a random user
	getRandomUser: async (req, res) => {
		console.log("user.randomUser")
		var user = await User.find({status: 'loading'})
		res.json(user)
	},
	//get all user
	getAll: async (req, res) => {
		console.log('User controller getAll...');
		try{
			var users = await User.find();
			if(users) return res.json({success: true, users: users.map((user)=>user.toClient())});
		}catch(err){
			console.log("Error",err);
			return res.json({success: false, error: err.message});
		}
	},
	// get particular user
	show: async (req, res) => {
		console.log("Current User:")
		console.log(req.user)
		var user = await User.findById(req.params.id)
		res.json(user)
	},
	getAUser: async (req, res) => {
		console.log('getAUser requset ..', req.body);
		try{
			var user = await User.findById(req.body.id);
			if(user){
				return res.send({success:true, user: user.toClient()});
			}
			return res.json({success: false, message: "Can't find the user."})
		}catch(err){
			console.log(err);
			return res.json({success: false, error: err.message});
		}
	},
	//login
	login: async (req, res) => {
		try{
			let user = await User.findOne({username: req.body.username});
			console.log("login..", req.body, user);
			if(user){
				if(user.password === req.body.password) {
					const token = signToken(user)
					user.save();
					let userData = user.toObject();			
					return res.json({success: true, message: "Token attached.", token, user: userData})
				}
			}
			return res.json({success: false, message: "Invalid credentials."});
		}catch(err){
			console.log("in login, some errors..", err);
			return res.json({success: false, error: err.message});
		}
	},

	logout: async (req, res) => {
		console.log('logout', req.headers.token)
		// req.user.status = 'logout';
		// await req.user.save();
		return res.send({})
	},
	// create a new user
	create: async (req, res) => {
		console.log('create user', req.body)
		var newUser = req.body;
		if(!newUser.username || !newUser.password || !newUser.location || !newUser.age || !newUser.gender){
			return res.json({success: false, message: "All fields must be filled."});
		}
		try{
			users = await User.find({username: newUser.username});
			if(users.length > 0) return res.json({success: false, message: "The username already exists."});
		}catch(e){
			console.log(err);
			return res.json({success: false, error: err.message});
		}
		User.create({...newUser, status: 'logout'}, (err, user) => {
			if(err) {
				console.log(err)
				return res.json({success: false, error: error.code})
			}
			console.log("user created...", {...newUser, status: 'logout'});
			res.json({success: true, message: "User created. Token attached."});
		})
	},

	// update an existing user
	update: async (req, res) => {
		console.log("user updating...", req.body.user);
		let user = req.user;
		Object.assign(user, req.body.user);
		try{
			await user.save();
			const token = signToken(user);
			return res.json({success: true, message: "User updated.", token, user: user.toObject()});
		}catch(err){
			console.log("err occured", err);
			return res.json({success: false, error: err});
		}
	},

	// delete an existing user
	destroy: (req, res) => {
		User.findByIdAndRemove(req.params.id, (err, user) => {
			res.json({success: true, message: "User deleted.", user})
		})
	},

	// the login route
	authenticate: async (req, res) => {
		try{
			var user = await User.findOne(req.user._id);
			if(user) res.json({success: true, message: "Valid token."});
			else return res.json({success: false, message: "Invalid credentials."});
		}catch(err){
			console.log("in login, some errors..", err);
			return res.json({success: false, error: err.message});
		}
	},
}