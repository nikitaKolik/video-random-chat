const
	mongoose = require('mongoose'),
	bcrypt = require('bcrypt-nodejs'),
	userSchema = new mongoose.Schema({
		username: { type: String, required: true, unique: true},
		password: { type: String, required: true },
		avatar: {type: String},
		age: {type: Number, required: true },
		gender: {type: String, required: true },
		location: {type: String, required: true },
		aboutMe: {type: String},
		ip: { type: String },
		status: { type: String },
	})

// adds a method to a user document object to create a hashed password
userSchema.methods.generateHash = async function(password) {
	return await bcrypt.hashSync(password, bcrypt.genSaltSync(8))
}

// adds a method to a user document object to check if provided password is correct
userSchema.methods.validPassword = function(password) {
	return (password == this.password)
}
userSchema.methods.toClient = function() {
	return {
		id: this._id,
		username: this.username,
		avatar: this.avatar,
		age: this.age,
		gender: this.gender,
		location: this.location,
		aboutMe: this.aboutMe,
		ip: this.ip,
		status: this.status,
	};
}

// middleware: before saving, check if password was changed,
// and if so, encrypt new password before saving:
userSchema.pre('save', function(next) {
	if(this.isModified('password')) {
		this.password = this.password
	}
	next()
})

const User = mongoose.model('User', userSchema)
module.exports = User