var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

app.use(bodyParser.json());

//Connect to mongoose
mongoose.connect('mongodb://localhost/CyberSafetyApp');
//need a database object
var db = mongoose.connection;

var NO_OF_USERS_CAN_MONITOR = 2;


Guardian =require('./models/guardian');
InstagramMonitoringUsers =require('./models/instagram_monitoring_users');







//Register Guardian into CybersafetyApp

app.post('/api/guardian/register', (req, res) => {
	var guardian = req.body;
	var email = guardian.email;

	
	Guardian.checkIfGuardianExists(email, (err, count) => {
		if(err){
			res.json({"success":"failure","message":"Something unexpected happened. Please try again."});
			throw err;
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

app.get('/api/guardian/login', (req, res) => {
	var login = req.query;
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


// Guardian autehntication token

app.get('/api/guardian/instagramAuthToken', (req, res) => {
	var req = req.query;
	var code = req.code;
	var email = req.email;
	var request = require('request');

	request.post(
	    'https://api.instagram.com/oauth/access_token',
	    { form: { client_id: '362741ea25924668af07edfb3873e3a2',
	     client_secret: 'ed14022584a2494690a6d9da21f7ee6e',
	      grant_type: 'authorization_code', 
	      redirect_uri: 'http://localhost', 
	      code:code } },
	    function (error, response, body) {
	        if (!error && response.statusCode == 200) {
	        	res.json({"success":"success","message":"Yay! authentication was successful.","token":response.body});
	        }
	        else
	        {
	        	res.json({"success":"failure","message":"authentication was unsuccessful."});
	        }
	    }
	);
});





//Add user to InstagramMonitoringUser table

app.post('/api/guardian/instagram/useraddRequest', (req, res) => {
	var useraddRequest = req.body;
	var email = useraddRequest.email;
	var countRequest = useraddRequest.countRequest;	
	var data = useraddRequest.data;
	InstagramMonitoringUsers.numberOfCurrentlyMonotoring(email, (err, count) => {
		if(err){
			res.json({"success":"failure","message":"Something unexpected happened. Please try again."});
			throw err;
		}
		if(count == NO_OF_USERS_CAN_MONITOR)
		{
			res.json({"success":"failure","message":"The number of monitored users for Instagram has reached its limit."});
		}
		else if (count+countRequest > NO_OF_USERS_CAN_MONITOR)
		{
			res.json({"success":"failure","message":"You are already monitoring "+(count)+" users. You can only monitor "+(NO_OF_USERS_CAN_MONITOR-count)+" users now."});
		}
		else
		{
			for(var i=0;i<data.length;i++)
			{
				var temp = data[i];
				InstagramMonitoringUsers.addInstagramMonitoringUser(temp, (error, temp) => 
				{
			    	if(error)
			    	{
						res.json({"success":"failure","message":"something bad must have happened. Please try again."});
					}
					
	       		});
			}
			res.json({"success":"success","message":"Your monitoring request was successful."});
		}
		
	});

	
});


// Guardian get monitoring users


app.get('/api/guardian/instagram/getMonitoringUsers', (req, res) => {
	var queryBody = req.query;
	var email = queryBody.email;

	InstagramMonitoringUsers.getMonitoringUsers(email, (err, users) => {
		if(err){
			res.json({"success":"failure","message":"something bad must have happened. Please try again."});
			throw err;
		}
		else
		{
			res.json({"success":"success","message":"The request was successful","users":users});
		}
		
	});

	
});


// Guardian get monitoring count

/*
app.get('/api/guardian/instagram/getMonitoringCount', (req, res) => {
	var queryBody = req.query;
	var email = queryBody.email;

	InstagramMonitoringUsers.numberOfCurrentlyMonotoring(email, (err, count) => {
		if(err){
			res.json({"success":"failure","message":"Something unexpected happened. Please try again.","count":-1});
		}
		else
		{
			res.json({"success":"success","message":"Yay! The login was successful.","count":count});
		}
		
	});

	
});
*/













//Setting route for the application
app.listen(3000);
console.log('Running on port 3000...');