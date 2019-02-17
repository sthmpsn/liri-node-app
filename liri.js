// enable ability to set any environment variables with the dotenv package
require("dotenv").config();

var axios = require("axios"); 
var Spotify = require("node-spotify-api");
var keys = require("./keys.js");
var moment = require('moment');
var fs = require("fs");

var userCmd = process.argv[2];
var userSearchItem = process.argv[3];


function executeCommand(cmd, query){
    switch(cmd){
        case "concert-this":
            concertSearch(query);
            break;

        case "spotify-this-song":
            songSearch(query);
            break;

        case "movie-this":
            movieSearch(query);
            break;

        case "do-what-it-says":
            batchedCommands(query);
            break;

        default:
            console.log(`Valid commands are:
            concert-this <artist/band name>
            spotify-this-song <song name>
            movie-this <movie name>
            do-what-it-says
            `); 
    }
}

// START BAND VENUES - Get a listing of a specific artist band venues
function concertSearch(query){
    //set the artist to the user search term.  Default to "Foo Fighters" if no search term present
    var artist = (query != undefined) ? query : "Foo Fighters";   
    
    // Remove any encapsulating double quotes if present (like from the batch commands)
    artist = artist.replace(/"/g,"");

    axios.get('https://rest.bandsintown.com/artists/' + artist + '/events?app_id=codingbootcamp')
        .then(function(response) {
            results = response.data;
            (query === undefined) ? console.log("\n\[Default Artist Concert Chosen\]") : console.log("\n\[User Concert Search Results\]"); 
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
}
// END BAND VENUES

//SPOTIFY SEARCH
function songSearch(query){
    var spotify = new Spotify(keys.spotify);

    var category = 'track';   // easier to adjust if need to change down the line
    var song = (query != undefined) ? query : 'The Sign';
    
    console.log("Song Search Query: " +song+ "\n");

    spotify.search({ type: category, query: song, limit: 10 }, function(err, response) {
        if (err) {
        return console.log('Error occurred: ' + err);
        }
        
        var results = response.tracks.items;
        if (query != undefined){
            var songCount = 0;
            console.log("\[Users Song Search Results\]\nHere are the Song results for \"" +query+ "\"\n");
            results.forEach(function(result){
                songCount++;
                console.log("\[Song #" +songCount+ "\]");
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

function movieSearch(query){
    //set the movie to the user search term.  Default to "Mr. Nobody" if no search term present
    var movie = (query != undefined) ? query : "Mr. Nobody";   
    
    axios.get("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy")
        .then(function(response) {
            results = response.data;
            (query === undefined) ? console.log("\n\[Default Movie Chosen\]") : console.log("\n\[User Movie Search Results\]"); 
            console.log("Here are the movie searh results for " +movie+ "\n");
            console.log("  Title: " +results.Title);
            console.log("  Year Released: " +results.Year);
            console.log("  IMDB Rating: " +results.Ratings[0].Value);
            console.log("  Rotten Tomatoes Rating: " +results.Ratings[1].Value);
            console.log("  Country Produced In: " +results.Country);
            console.log("  Language: " +results.Language);
            console.log("  Plot: " +results.Plot);
            console.log("  Cast: " +results.Actors);
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

}

function batchedCommands(query){
    // take in a file of scripted commands to run for Liri
    fs.readFile("random.txt", "utf-8", (error, data) => {
        if (error) {
            return console.log(error);
        }

        console.log("\[COMMAND FILE CONTENT\]\n" +data);
        console.log("\[END OF FILE CONTENT\]\n");

        var cmdList = data.split("\r\n");

        cmdList.forEach(function(cmd){
            var liriCmd = cmd.split(",");
            cmd = liriCmd[0];
            query = liriCmd[1];
            console.log("Command: " +cmd);
            console.log("Query: " +query+ "\n");
            executeCommand(cmd, query);
        });

    })

    
}

console.log("User Command: " +userCmd);
executeCommand(userCmd, userSearchItem);