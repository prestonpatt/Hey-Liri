require("dotenv").config();

var request = require("request");
var fs = require("fs");
var axios = require("axios")
var moment = require("moment")
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var command = process.argv[2];
var input = process.argv.slice(3).join(" ");

var divider = "\n\n------------------------------------------------------------\n\n";

CommandInput(command, input)

function CommandInput(command, input) {
    switch (command) {
        case 'concert-this':
            concertFunction(input);
            break;
        case 'spotify-this-song':
            spotifyFunction(input);
            break;
        case 'movie-this':
            movieFunction(input);
            break;
        case 'do-what-it-says':
            doWhatFunction(input);
            break;
        default:
            console.log("That's not valid. Enter one of the following: \n\nconcert-this \nspotify-this-song \nmovie-this \ndo-what-it-says\n")
    }
}

function concertFunction(input) {
    if (input === "") {
        console.log("Come on, you gotta search an artist!")
    } else {
        var queryUrl = "https://rest.bandsintown.com/artists/" + input + "/events?app_id=codingbootcamp";
        axios
            .get(queryUrl).then(
                function (response) {
                    if (response.data.length <= 0) {
                        console.log("Couldn't find this artist. Try another artist")
                    } else {
                        for (var i = 0; i < response.data.length; i++) {
                            var concertInfo = `\n
                            Venue name: ${response.data[i].venue.name}\n
                            Venue location: ${response.data[i].venue.city + ", " + response.data[0].venue.region}\n
                            Event date: ${moment(response.data[i].datetime).format('L')}`
                            console.log(concertInfo)
                            fs.appendFile('log.txt', concertInfo + divider, 'utf8', function (error) {
                                if (error) {
                                    console.log("Couldn't append Data")
                                }
                                console.log("Data has been added to log.txt file.")
                            })
                        }

                    }
                }
            );
    }
}

function spotifyFunction() {
    if (input === "") {
        input = "The Sign Ace of Base"
    }
    spotify.search({
        type: 'track',
        query: input,
    }, function (error, data) {
        if (error) {
            console.log("Couldn't find your song.")
        }
        var results = data.tracks.items[0]
        var spotifyInfo = (`\n
            Artist: ${results.artists[0].name}\n
            Song Title: ${results.name}\n
            Preview: ${results.preview_url}\n
            Album: ${results.album.name}`);
        console.log(spotifyInfo)
        fs.appendFile('log.txt', spotifyInfo + divider, 'utf8', function (error) {
            if (error) {
                console.log("Couldn't append Data")
            }
            console.log("Data has been added to log.txt file.")
        })
    })
}

function movieFunction() {
    if (input === "") {
        input = "Mr. Nobody"
        console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
        console.log("It's on Netflix!");
    }
    var queryUrl = "http://www.omdbapi.com/?apikey=trilogy&t=" + input;
    axios
        .get(queryUrl).then(
            function (response) {
                var movieInfo = (`\n
                Title: ${response.data.Title}\n
                Released: ${response.data.Year}\n
                IMDB Rating: ${response.data.imdbRating}\n
                Rotten Tomatos Rating: ${response.data.Ratings[1].Value}\n
                Country: ${response.data.Country}\n
                Language: ${response.data.Language}\n
                Plot: ${response.data.Plot}\n
                Actors: ${response.data.Actors}`)
                console.log(movieInfo)
                fs.appendFile('log.txt', movieInfo + divider, 'utf8', function (error) {
                    if (error) {
                        console.log("Couldn't append Data")
                    }
                    console.log("Data has been added to log.txt file.")
                })
            })
}

function doWhatFunction() {
    if (command === "do-what-it-says") {
        fs.readFile('random.txt', 'UTF8', function (error, data) {
            if (error) {
                console.log("I'm not sure what your saying.")
            }
            var dataArray = data.split(',');
            command = dataArray[0],
            input = dataArray[1];
            CommandInput();
        });
    }
}

