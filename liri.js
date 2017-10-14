var request = require('request');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');

var keys = require('./keys.js');
// console.log(keys);

var client = new Twitter({
   consumer_key: keys.twitterKeys.consumer_key,
   consumer_secret: keys.twitterKeys.consumer_secret,
   access_token_key: keys.twitterKeys.access_token_key,
   access_token_secret: keys.twitterKeys.access_token_secret
});

var spotify = new Spotify({
	id: keys.spotifyKeys.id,
	secret: keys.spotifyKeys.secret
});

var command = process.argv[2];

switch(command) {
	case "tweet":
		tweet();
		break;
	case "spotify":
		spotifySong();
		break;
	case "movie":
		searchMovie();
		break;
	default:
		help();
		break;
}

function tweet() {
	client.get('statuses/user_timeline',screen_name='@trvisxx', function(err, tweet, response){
	   if(err) return console.log(err);
	   
	   console.log("\nHere are your tweets");

	   for(var i=0; i<tweet.length; i++) {
	   	  console.log("-  -  -  -");
	   	  var t = tweet[i].created_at.slice(0,20);
	   	  console.log(t  +tweet[i].text);
	      
	   }
	   
	});
}

function spotifySong() {
	var song = process.argv[3];

	for (var i = 4; i<process.argv.length; i++) {
		song += " " + process.argv[i]; 
	}

	spotify.search({type: 'track', query: song}, function(err, data) {
		if(err) return console.log(err);

		console.log("\n-  -  -  " + data.tracks.items[0].name + "  -  -  -");
		console.log("Artist: " + data.tracks.items[0].artists[0].name);
		console.log("Album: " +data.tracks.items[0].album.name);
		console.log("Sample: "+ data.tracks.items[0].preview_url);
	});
}

function searchMovie() {
	var movieName = process.argv[3];

	for(var i = 4; i<process.argv.length; i++) {
		movieName += " " + process.argv[i];
	}

	var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";
	request(queryUrl, function(err, resp, body) {

		if(!err && resp.statusCode === 200) {
			console.log("\n-  -  -  " + JSON.parse(body).Title + "  -  -  -" +
						"\nReleased: " + JSON.parse(body).Year + 
						"\nIMDB Rating: "+JSON.parse(body).imdbRating +
						"\nActors: " + JSON.parse(body).Actors +
						"\nLanguage(s): " +JSON.parse(body).Language + 
						"\nCountry: " + JSON.parse(body).Country +
						"\nPlot:\n" +JSON.parse(body).Plot);
		}
	});
}

function help() {
	console.log("\nSorry, I don't know what you mean" + 
				"\nHere is what I can do:" + 
				"\nliri movie -- To search a movie" +
				"\nliri spotify -- To search a song");
}