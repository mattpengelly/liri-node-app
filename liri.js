require("dotenv").config();
var fs = require("fs");
var moment = require("moment");
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var axios = require("axios");
var queryUrl = "";

let input = process.argv;
let command = input[2];
let parameters = input.slice(3, input.length + 1);
let validCommand = false;

// console.log(command);
// console.log(parameters);

switch (command) {
  case `concert-this`:
  case `spotify-this-song`:
  case `movie-this`:
  case `do-what-it-says`:
    validCommand = true;
}

// console.log(validCommand);

if (!validCommand) {
  console.log(
    "'" +
      command +
      "' is not a valid command.  Valid commands are 'concert-this', 'spotify-this-song', 'movie-this', and 'do-what-it-says'."
  );
}

switch (command) {
  case `concert-this`:
    queryUrl =
      "https://rest.bandsintown.com/artists/" +
      parameters.join(" ") +
      "/events?app_id=edf7ea989c59659c0f6f694a40a353d1";
    // console.log(queryUrl);

    axios
      .get(queryUrl)
      .then(function(response) {
        var jsonData = response.data;
        // console.log(jsonData);
        console.log("==========================================");
        console.log(parameters.join(" "));
        console.log("==========================================");

        for (i = 0; i < jsonData.length; i++) {
          console.log(jsonData[i].venue.name);
          console.log(
            jsonData[i].venue.city +
              ", " +
              jsonData[i].venue.region +
              " - " +
              jsonData[i].venue.country
          );
          console.log(moment(jsonData[i].datetime).format("MM/DD/YYYY"));
          console.log("---------------------------------------");
        }
      })
      .catch(function(error) {
        console.log(error);
      });
    break;

  case `spotify-this-song`:
    //spotify account not working.  once fixed need to write code to send artist to spotify API and pull back needed data
    console.log(keys);
    console.log(keys.spotify.id);

    // let spotQueryUrl =
    //   "https://accounts.spotify.com/authorize?client_id=" +
    //   keys.spotify.id +
    //   "&response_type=code&redirect_uri=https://github.com/mattpengelly/liri-node-app";

    axios({
      url: "https://accounts.spotify.com/api/token",
      method: "post",
      params: {
        grant_type: "client_credentials"
      },
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      auth: {
        username: keys.spotify.id,
        password: keys.spotify.secret
      }
    })
      .then(function(response) {
        // console.log(response);

        var spotToken = response.data.access_token;

        console.log("==========================================");
        console.log("Spotify API Code:  " + spotToken);
        console.log("==========================================");

        axios({
          url: "https://api.spotify.com/v1/search",
          method: "get",
          params: {
            q: parameters.join("+"),
            type: "track"
          },
          headers: {
            Authorization: "Bearer " + spotToken
            //   "Content-Type": "application/x-www-form-urlencoded"
          }
        })
          .then(function(response) {
            // console.log("==========================================");
            console.log("Spotify return object:  " + response);
            // console.log("==========================================");
            for (var property in response) {
              console.log(property + "=" + response[property]);
            }
            console.log(response.data.tracks.items[0]);
            
          })
          .catch(function(error) {
            console.log(error);
          });
      })
      .catch(function(error) {
        console.log(error);
      });
    break;

  case `movie-this`:
    queryUrl =
      "http://www.omdbapi.com/?apikey=dd65be43&s=" + parameters.join(" ");
    console.log(queryUrl);

    axios
      .get(queryUrl)
      .then(function(response) {
        //   console.log(response);

        var jsonData = response.data;
        console.log(jsonData);
        for (i = 0; i < jsonData.length; i++) {}
      })
      .catch(function(error) {
        console.log(error);
      });

  case `do-what-it-says`:
    break;
    validCommand = true;
}
