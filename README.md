### How To Run

* Import the GeoSpatial data to MongoDB using `mongoimport --db GermanyDB -c Data --type json --file ~/Desktop/ReverseGeolocation/output.geojson --jsonArray`

* Index the DB using `db.Data.createIndex({geometry: "2dsphere"})` 

* `npm install` 
* `node index.js`

### Features:

1) Log In - Allows an existing user to log in

2) Sign Up - Allows a new to sign-up

3) Find a ZipCode using lattitude and longitude and via marking it on the map


To view the demo please navigate to: https://youtu.be/xmtaftzpJq0

