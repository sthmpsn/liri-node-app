# Liri-Node-App
CLI client that takes in a predefined command that takes in user parameters and calls the corresponding API and returns a result.

## Instructions
**Clone this repo, install node.js and run "node liri.js \<valid command\>"**

**Valid commands are:**
* ***concert-this \<artist/band name\>*** 
   * Will default to "Foo Fighters"
* ***spotify-this-song \<song name\>***
   * Will default to "The Sign" from "Ace of Base"
* ***movie-this \<movie name\>***
   * Defaults to "Mr. Nobody"
* ***do-what-it-says***
   * Pulls from the "random.txt" file which contains a command,query set on each line that gets read in and executed

## Techonologies
* Node
* Express
* MySQL
* HTML
* Bootstrap
* jQuery
* Heroku + JawsDB (for deploying MySQL on Heroku)

## Example Usage
* **No Agruments**
![No Arguments](screenshots/01-liri-noArguments.JPG)

* **concertThis No Args**
![concertThis No Arguments](screenshots/02-liri-concertThis-NoArgs.JPG)

* **concertThis with Args**
![concertThis Arguments](screenshots/03-liri-concertThis-withArgs.JPG)

* **spotifyThis No Args**
![spotifyThis No Arguments](screenshots/04-liri-spotifyThis-noArgs.jpg)

* **spotifyThis with Args**
![spotifyThis Arguments](screenshots/05-liri-spotifyThis-withArgs.jpg)

* **movieThis No Args**
![movieThis No Arguments](screenshots/06-liri-movieThis-noArgs.jpg)

* **movieThis with Args**
![movieThis Arguments](screenshots/07-liri-movieThis-withArgs.jpg)

* **RandomTxtContent**
![Batch File Content](screenshots/08-liri-RandomTxtContent.jpg)

* **doWhatItSays No Args**  
![doWhatItSays No Arguments](screenshots/09-liri-doWhatItSays-noArgs.jpg)






