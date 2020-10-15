const Ban = require('../models/Ban.js');
const User = require('../models/User.js');

module.exports = {
    getAll: async (req, res) => {
        console.log('Ban controller getAll...');
		try{
			let bans = await Ban.find({});
			if(bans) res.json({success: true, message: "Getting all bans success.", bans: bans.map((ban) => ban.toClient())});
			else return res.json({success: false, message: "Getting all bans failed."});
		}catch(err){
			console.log("Getting all ban error:", err);
			return res.json({success: false, error: err.message});
		}
	},
	createOne: async (req, res) => {
        console.log('Ban controller createOne...');
		try{
			let ban = await Ban.create(req.body.ip);
			if(ban) res.json({success: true, message: "Ban success."});
			else return res.json({success: false, message: "Ban failed."});
		}catch(err){
			console.log("creating ban error:", err);
			return res.json({success: false, error: err.message});
		}
    },
    createAccountOne: async (req, res) => {
        console.log('Ban controller createAccountOne...');
        let userId = req.params.userId;
		try{
			let user = await User.findById(userId);
			if(user) {
                user.status = 'banned';
                await user.save();
                return res.json({success: true, message: "Ban success."});
            }
			else return res.json({success: false, message: "Ban failed."});
		}catch(err){
			console.log("creating ban error:", err);
			return res.json({success: false, error: err.message});
		}
    },
    deleteAccountOne: async (req, res) => {
        console.log('Ban controller createOne...');
        let userId = req.params.userId;
		try{
			let user = await User.findById(userId);
			if(user) {
                user.status = '';
                await user.save();
                return res.json({success: true, message: "Ban success."});
            }
			else return res.json({success: false, message: "Ban failed."});
		}catch(err){
			console.log("creating ban error:", err);
			return res.json({success: false, error: err.message});
		}
	},
	deleteOne: async (req, res) => {
        console.log('Ban controller deleteOne...');
		try{
			let ban = await Ban.findByIdAndDelete(req.body.id);
			if(ban) {
                res.json({success: true, message: "Deleting ban success."});
            }
			else return res.json({success: false, message: "Deleting ban failed."});
		}catch(err){
			console.log("Deleting ban error:", err);
			return res.json({success: false, error: err.message});
		}
	}
}