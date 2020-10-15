const
	mongoose = require('mongoose'),
	banSchema = new mongoose.Schema({
        ip: {type: String, unique: true},
	})
banSchema.methods.toClient = function() {
        return {
            id: this._id,
            ip: this.ip,
        };
}
const Ban = mongoose.model('Ban', banSchema);
module.exports = Ban;