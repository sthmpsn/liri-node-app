// enable ability to set any environment variables with the dotenv package
require("dotenv").config();

var axios = require("axios"); 
var Spotify = require("node-spotify-api");
var keys = require("./keys.js");
var moment = require('moment');
var fs = require("fs");
var log4js = require('log4js');

var userCmd = process.argv[2];
// Joining the remaining arguments since an actor or tv show name may contain spaces
var userSearchItem = process.argv.slice(3).join(" ");

// setup logging to console and logfile in one command through the use of "log4js" package
log4js.configure({
    appenders: {
        console: { type: 'console' },
        logFile: { type: 'file', filename: 'log.txt' }
    },
    categories: { default: {appenders: ['console','logFile'], level: 'info'}}
});

var logger = log4js.getLogger('log.txt');


function logIt(logInfo){
    fs.appendFile("log.txt", logInfo, function(err){
        // If the code experiences any errors it will log the error to the console.
        if (err) {
            return console.log(err);
        }
    });
}

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
            logger.info(`Valid commands are:
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
            (query === undefined) ? logger.info("\n\[Default Artist Concert Chosen\]") : logger.info("\n\[User Concert Search Results\]"); 
            logger.info("Here are the venues where " +artist+ " is playing\n");
            results.forEach(function(result){
                logger.info("Venue: " +result.venue.name);
                logger.info("City: " +result.venue.city);
                (result.venue.region != "") ? logger.info("State: " +result.venue.region) : "";
                logger.info("Country: " +result.venue.country);
                logger.info("Date of Event: " +moment(result.datetime).format("MM-DD-YYYY")+ "\n");
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
    
    logger.info("Song Search Query: " +song+ "\n");

    spotify.search({ type: category, query: song, limit: 10 }, function(err, response) {
        if (err) {
        return console.log('Error occurred: ' + err);
        }
        
        var results = response.tracks.items;
        if (query != undefined){
            var songCount = 0;
            logger.info("\[Users Song Search Results\]\nHere are the Song results for \"" +query+ "\"\n");
            results.forEach(function(result){
                songCount++;
                logger.info("\[Song #" +songCount+ "\]");
                logger.info("  Artist: " +result.artists[0].name);
                logger.info("  Song Name: " +result.name);
                logger.info("  Album Name: " +result.album.name);
                logger.info("  Song URL: " +result.external_urls.spotify+ "\n");
            });               
        }
        else{
            results.forEach(function(result){
                if ((result.artists[0].name) === "Ace of Base"){
                    logger.info("\[Default Song Chosen\]");
                    logger.info("  Artist: " +result.artists[0].name); 
                    logger.info("  Song Name: " +result.name);
                    logger.info("  Album Name: " +result.album.name);
                    logger.info("  Song URL: " +result.external_urls.spotify+ "\n");
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
            (query === undefined) ? logger.info("\n\[Default Movie Chosen\]") : logger.info("\n\[User Movie Search Results\]"); 
            logger.info("Here are the movie searh results for " +movie+ "\n");
            logger.info("  Title: " +results.Title);
            logger.info("  Year Released: " +results.Year);
            logger.info("  IMDB Rating: " +results.Ratings[0].Value);
            logger.info("  Rotten Tomatoes Rating: " +results.Ratings[1].Value);
            logger.info("  Country Produced In: " +results.Country);
            logger.info("  Language: " +results.Language);
            logger.info("  Plot: " +results.Plot);
            logger.info("  Cast: " +results.Actors);
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

        logger.info("\[COMMAND FILE CONTENT\]\n" +data);
        logger.info("\[END OF FILE CONTENT\]\n");

        var cmdList = data.split("\r\n");

        cmdList.forEach(function(cmd){
            var liriCmd = cmd.split(",");
            cmd = liriCmd[0];
            query = liriCmd[1];
            logger.info("Command: " +cmd);
            logger.info("Query: " +query+ "\n");
            executeCommand(cmd, query);
        });

    })

    
}

logger.info("\[hal9000@ODYSSEY\] > Hello Dave...You're looking well today\n");  //2001 Space Odyssey joke

logger.info("Liri Initialized " +moment().format("MM-DD-YYYY hh:mma")+ "\n");
logger.info("User Command: " +userCmd);
executeCommand(userCmd, userSearchItem);