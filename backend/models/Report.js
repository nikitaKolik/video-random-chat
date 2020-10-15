const
	mongoose = require('mongoose'),
	reportSchema = new mongoose.Schema({
		to: { type: String},
		description: {type: String},
		from: { type: mongoose.Schema.Types.ObjectId, required: true},
	})

reportSchema.methods.toClient = function() {
        return {
            id: this._id,
            to: this.to,
            description: this.description,
            from: this.from,
        };
}
const Report = mongoose.model('Report', reportSchema);
module.exports = Report;