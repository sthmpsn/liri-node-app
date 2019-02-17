// enable ability to set any environment variables with the dotenv package
require("dotenv").config();

var axios = require("axios"); 
var Spotify = require("node-spotify-api");
var keys = require("./keys.js");
var moment = require('moment');

var command = process.argv[2];
var searchItem = process.argv[3];


switch(command){
    case "concert-this":
        concertSearch();
        break;

    case "spotify-this":
        songSearch();
        break;

    case "movie-this":
        movieSearch();
        break;

     default:
        console.log(`Valid commands are:
        concert-this <artist/band name>
        spotify-this-song <song name>
        movie-this <movie name>
        `); 
}




// Get a listing of a specific artist band venues
function concertSearch(){
    //set the artist to the user search term.  Default to "Foo Fighters" if no search term present
    var artist = (searchItem != undefined) ? searchItem : "Foo Fighters";   
    
    axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp")
        .then(function(response) {
            results = response.data;
            (searchItem === undefined) ? console.log("\n\[Default Artist Concert Chosen\]") : console.log("\n\[User Concert Search Results\]"); 
            console.log("Here are the venues where " +artist+ " is playing\n");
            results.forEach(function(result){
                console.log("Venue: " +result.venue.name);
                console.log("City: " +result.venue.city);
                (result.venue.region != "") ? console.log("State: " +result.venue.region) : "";
                console.log("Country: " +result.venue.country);
                console.log("Date of Event: " +moment(result.datetime).format("MM-DD-YYYY")+ "\n");
            });
        })
        .catch(function(err){
            if (err.response){
                console.log("error:\n" +err.response.data);
                console.log(err.response.status);
                console.log(err.response.headers);
            }else if (err.request){
                console.log(err.request);
            }else{
                console.log("Error", err.message);
            }
            console.log(err.config);
        });
    // END BAND VENUES
}


//SPOTIFY SEARCH
function songSearch(){
    var spotify = new Spotify(keys.spotify);

    var category = 'track';   // easier to adjust if need to change down the line
    var song = (searchItem != undefined) ? searchItem : 'The Sign';
    
    console.log("Song Search Query: " +song+ "\n");

    spotify.search({ type: category, query: song, limit: 10 }, function(err, response) {
        if (err) {
        return console.log('Error occurred: ' + err);
        }
        
        var results = response.tracks.items;
        if (searchItem != undefined){
            var songCount = 0;
            results.forEach(function(result){
                songCount++;
                console.log("\[Song #" +songCount+ "\]");
                // console.log(result.artists[0].name);
                // console.log(result.external_urls.spotify);
                console.log("  Artist: " +result.artists[0].name);
                console.log("  Song Name: " +result.name);
                console.log("  Album Name: " +result.album.name);
                console.log("  Song URL: " +result.external_urls.spotify+ "\n");
            });               
        }
        else{
            results.forEach(function(result){
                if ((result.artists[0].name) === "Ace of Base"){
                    // console.log("Found Ace of Base, The Sign: " +result.external_urls.spotify);
                    console.log("\[Default Song Chosen\]");
                    console.log("  Artist: " +result.artists[0].name); 
                    console.log("  Song Name: " +result.name);
                    console.log("  Album Name: " +result.album.name);
                    console.log("  Song URL: " +result.external_urls.spotify+ "\n");
                }
            });
        }
    });
}

function movieSearch(){






}