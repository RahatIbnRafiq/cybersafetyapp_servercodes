const mongoose = require('mongoose');

// Guardian Information Schema
const guardianSchema = mongoose.Schema({
	email:{
		type: String,
		required: true
	},
	password:{
		type: String,
		required: true
	},
	phone_number:{
		type: String,
		required: true
	},
	instagram_access_token:{
		type: String
	}
});

const Guardian = module.exports = mongoose.model('guardian', guardianSchema);


// Add Guardian
module.exports.registerGuardian = (guardian, callback) => {
	Guardian.create(guardian, callback);
}

// Check if Guardian Already Exists

module.exports.checkIfGuardianExists = (email, callback) => {
	Guardian.count({ email: email }).count(callback);
}

// Guardian LogIn

module.exports.loginGuardian = (email,password, callback) => {
	Guardian.count({ email: email,password:password}).count(callback);
}