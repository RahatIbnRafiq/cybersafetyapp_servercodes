var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

app.use(bodyParser.json());

//Connect to mongoose
mongoose.connect('mongodb://localhost/CyberSafetyApp');
//need a database object
var db = mongoose.connection;


Guardian =require('./models/guardian');




//Register Guardian into CybersafetyApp

app.post('/api/guardian/register', (req, res) => {
	var guardian = req.body;
	var email = guardian.email;


	Guardian.checkIfGuardianExists(email, (err, count) => {
		if(err){
			res.json({"success":"failure","message":"Something unexpected happened. Please try again."});
			//throw err;
		}
		if(count>0)
		{
			res.json({"success":"failure","message":"This email is already registered."});
		}
		else
		{
			Guardian.registerGuardian(guardian, (err, guardian) => {
			if(err){
				res.json({"success":"failure","message":"Something unexpected happened. Please try again."});
			}
			res.json({"success":"success","message":"Yay! Your registration was successful!"});
	});
		}
		
	});

	
});


// Guardian Log in

app.post('/api/guardian/login', (req, res) => {
	var login = req.body;
	var email = login.email;
	var password = login.password;


	Guardian.loginGuardian(email, password, (err, count) => {
		if(err){
			res.json({"success":"failure","message":"Something unexpected happened. Please try again."});
			//throw err;
		}
		if(count<1)
		{
			res.json({"success":"failure","message":"Sorry the login credentials might be wrong. Please try again."});
		}
		else
		{
			res.json({"success":"success","message":"Yay! The login was successful."});
		}
		
	});

	
});











//Setting route for the application
app.listen(3000);
console.log('Running on port 3000...');