const express  = require('express');
const bodyParser = require('body-parser');
const app = express();

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
	res.sendFile(__dirname + '/views/home.html');
});

app.use("/static", express.static('./static'));


app.listen(3000, () => {
	console.log("Listening for stuff");

});
/* Given a username and passwords authenticates the credentials against the DB. */
/* @param {req.body}
/* Upon succesfull authentication redirects to /reversegeolocate */
app.post("/authenticate", (req, res) => {
	console.log(req.body.username);
	MongoClient.connect(url, function(err, db) {
	  if (err) throw err;
	  var dbo = db.db("GermanyDB");
	  var query = { username: req.body.username };
	  dbo.collection("Users").find(query).toArray(function(err, result) {
	    if (err) throw err;
		console.log(result[0]);
		if(result[0] != undefined && result[0]["password"] === req.body.password) {
			res.redirect('/reversegeolocate');
			console.log("User logged in successfully")
		}
		else {
			console.log("Authentication failed.");
		}
	    db.close();
	  });
	});
});

/* Given a username and password register the user and redirect them to the homepage */
/* @param {req.body} */


app.post("/register", (req, res) => {
	
	console.log(req.body.username + " " + req.body.password + " wants to register");
	MongoClient.connect(url, function(err, db) {
	  if (err) throw err;
	  var dbo = db.db("GermanyDB");
	  
	  dbo.collection("Users").insertOne({username: req.body.username, password: req.body.password}, (err, result)=> {
		  if(err) console.log(err);
		  else res.redirect('/');
	  });
  });
	
});


app.get('/reversegeolocate', (req, res) => {
	res.sendFile(__dirname + '/views/reversegeolocate.html');
});


/* Given a request with lattitude and longitude returns the zipcode (Germany only). */
/* @param {req.query} */
/* @returns {zipcode: ZipCodeForGivenLattitudeAndLongitude} */
app.get('/findZipCode', (req, res) => {

	MongoClient.connect(url, function(err, db) {

	  if (err) throw err;
	  var dbo = db.db("GermanyDB");

	  console.log("Will make a DB request with" + parseFloat(req.query.longitude) + " " + parseFloat(req.query.lattitude));
	  dbo.collection("Data").find({
		  geometry: {
			  $near: {
				  $geometry: { type: "Point",  coordinates: [ parseFloat(req.query.longitude), parseFloat(req.query.lattitude)] },
				  $minDistance: 0,
				  $maxDistance: 5000
			  }
		  }
	  }).toArray(function(err, result) {
		 if(err) throw err;
		 if(result[0] != undefined) {
			 res.send({zipcode: result[0]["properties"]["plz"]});
		 }
		 else {
			 res.send({zipcode: "Can't find"});
		 }
	  });

	});


});


app.get("/signup", (req, res) => {
	res.sendFile(__dirname + '/views/signup.html');
});