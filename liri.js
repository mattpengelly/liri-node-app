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

let liri = function () {
  // ERROR HANDLING I ENDED UP DOING AS THE DEFAULT OF THE MAIN SWITCH STATEMENT
  // switch (command) {
  //   case `concert-this`:
  //   case `spotify-this-song`:
  //   case `movie-this`:
  //   case `do-what-it-says`:
  //     validCommand = true;
  // }

  // // console.log(validCommand);

  // if (!validCommand) {
  //   console.log(
  //     "'" +
  //       command +
  //       "' is not a valid command.  Valid commands are 'concert-this', 'spotify-this-song', 'movie-this', and 'do-what-it-says'."
  //   );
  // }

  switch (command) {
    case `concert-this`:
      queryUrl =
        "https://rest.bandsintown.com/artists/" +
        parameters.join(" ") +
        "/events?app_id=edf7ea989c59659c0f6f694a40a353d1";
      // console.log(queryUrl);

      axios
        .get(queryUrl)
        .then(function (response) {
          var jsonData = response.data;
          // console.log(jsonData);
          // console.log("==========================================");
          // console.log(parameters.join(" "));
          // console.log("==========================================");

          fs.appendFile(
            "log.txt", command + " " + parameters.join(" ") + "\n" +
            "---------------------------------------\n---------------------------------------\n\n",
            function (error) {
              if (error) {
                return console.log(error);
              }
            });

          for (i = 0; i < jsonData.length; i++) {
            console.log("Venue:     " + jsonData[i].venue.name);
            console.log(
              "Location:  " +
              jsonData[i].venue.city +
              ", " +
              jsonData[i].venue.region +
              " - " +
              jsonData[i].venue.country
            );
            console.log(
              "Date:      " + moment(jsonData[i].datetime).format("MM/DD/YYYY")
            );
            console.log("---------------------------------------");
            fs.appendFile(
              "log.txt",
              "Venue:     " + jsonData[i].venue.name + "\n" +
              "Location:  " +
              jsonData[i].venue.city +
              ", " +
              jsonData[i].venue.region +
              " - " +
              jsonData[i].venue.country +
              "\nDate:      " + moment(jsonData[i].datetime).format("MM/DD/YYYY") +
              "\n---------------------------------------\n",
              function (error) {
                if (error) {
                  return console.log(error);
                }
              });
          };
          fs.appendFile("log.txt",
            "\n\n********************************************************\n********************************************************\n\n",
            function (error) {
              if (error) {
                return console.log(error);
              }
            });
        })
        .catch(function (error) {
          console.log(error);
        });
      break;

    case `spotify-this-song`:
      // console.log(keys);
      // console.log(keys.spotify.id);
      // console.log("parameters = " + parameters);
      if (parameters.length === 0) {
        parameters = ["The", "Sign", "Ace"];
      }

      spotify.search({ type: "track", query: parameters }, function (err, data) {
        if (err) {
          return console.log("Error occurred: " + err);
        }

        fs.appendFile(
          "log.txt", command + " " + parameters.join(" ") + "\n\n" +
          "---------------------------------------\n---------------------------------------\n\n",
          function (error) {
            if (error) {
              return console.log(error);
            }
          });

        // console.log(data.tracks);
        let artists = [];
        for (i = 0; i < data.tracks.items[0].artists.length; i++) {
          artists.push(data.tracks.items[0].artists[i].name);
        };
        console.log("Artist(s):   " + artists.join(", "));
        console.log("Song Title:  " + data.tracks.items[0].name);

        fs.appendFile(
          "log.txt", "Artist(s):   " + artists.join(", ") +
          "\nSong Title:  " + data.tracks.items[0].name,
          function (error) {
            if (error) {
              return console.log(error);
            };
          });

        if (!data.tracks.items[0].preview_url) {
          console.log("Preview:     Sorry, no previeww available");
          fs.appendFile(
            "log.txt", "\nPreview:     Sorry, no previeww available",
            function (error) {
              if (error) {
                return console.log(error);
              };
            });
        } else {
          console.log("Preview:     " + data.tracks.items[0].preview_url);
          fs.appendFile(
            "log.txt", "\nPreview:     " + data.tracks.items[0].preview_url,
            function (error) {
              if (error) {
                return console.log(error);
              };
            });
        };

        console.log("Album:       " + data.tracks.items[0].album.name);
        fs.appendFile(
          "log.txt", "\nAlbum:       " + data.tracks.items[0].album.name +
          "\n\n********************************************************\n********************************************************\n\n",
          function (error) {
            if (error) {
              return console.log(error);
            };
          });
      });

      // METHOD USING SPOTIFY API DIRECTLY WITHOUT NODE PACKAGE
      // axios({
      //   url: "https://accounts.spotify.com/api/token",
      //   method: "post",
      //   params: {
      //     grant_type: "client_credentials"
      //   },
      //   headers: {
      //     Accept: "application/json",
      //     "Content-Type": "application/x-www-form-urlencoded"
      //   },
      //   auth: {
      //     username: keys.spotify.id,
      //     password: keys.spotify.secret
      //   }
      // })
      //   .then(function(response) {
      //     // console.log(response);

      //     var spotToken = response.data.access_token;

      //     console.log("==========================================");
      //     console.log("Spotify API Code:  " + spotToken);
      //     console.log("==========================================");

      //     axios({
      //       url: "https://api.spotify.com/v1/search",
      //       method: "get",
      //       params: {
      //         q: parameters.join("+"),
      //         type: "track"
      //       },
      //       headers: {
      //         Authorization: "Bearer " + spotToken
      //         //   "Content-Type": "application/x-www-form-urlencoded"
      //       }
      //     })
      //       .then(function(response) {
      //         // console.log("==========================================");
      //         console.log("Spotify return object:  " + response);
      //         // console.log("==========================================");
      //         for (var property in response) {
      //           console.log(property + "=" + response[property]);
      //         }
      //         // console.log(response.data.tracks.items[0]);

      //         let artists = [];
      //         for (i = 0; i < response.data.tracks.items[0].artists.length; i++) {
      //           artists.push(response.data.tracks.items[0].artists[i].name);
      //         }
      //         console.log("Artist(s):   " + artists.join(", "));

      //         console.log("Song Title:  " + response.data.tracks.items[0].name);

      //         if (!response.data.tracks.items[0].preview_url) {
      //           console.log("Preview:     Sorry, no previeww available");
      //         } else {
      //           console.log(
      //             "Preview:     " + response.data.tracks.items[0].preview_url
      //           );
      //         }

      //         console.log(
      //           "Album:       " + response.data.tracks.items[0].album.name
      //         );
      //       })
      //       .catch(function(error) {
      //         console.log(error);
      //       });
      //   })
      //   .catch(function(error) {
      //     console.log(error);
      //   });

      break;

    case `movie-this`:
      queryUrl =
        "http://www.omdbapi.com/?apikey=dd65be43&t=" + parameters.join(" ");
      // console.log(queryUrl);

      axios
        .get(queryUrl)
        .then(function (response) {
            // console.log(response);

          let jsonData = response.data;
          // console.log(jsonData);

          let ratings = jsonData.Ratings;
          // console.log(ratings);

          let ratingSourceArr = [];

          for (i = 0; i < ratings.length; i++) {
            ratingSourceArr.push(ratings[i].Source);
          }

          // console.log(ratingSourceArr);

          let imdbRatingIndex = ratingSourceArr.indexOf(
            "Internet Movie Database"
          );
          // console.log(imdbRatingIndex);
          if (imdbRatingIndex < 0) {
            var imdbRating = "Not Available";
          } else {
            var imdbRating = ratings[imdbRatingIndex].Value;
          }
          // console.log(imdbRating);

          let rottenTomIndex = ratingSourceArr.indexOf("Rotten Tomatoes");
          // console.log(rottenTomIndex);
          if (rottenTomIndex < 0) {
            var rottenTomRating = "Not Available";
          } else {
            var rottenTomRating = ratings[rottenTomIndex].Value;
          }
          // console.log(rottenTomRating);

          console.log("Title:            " + jsonData.Title);
          console.log("Year:             " + jsonData.Year);

          // This seemed to work but assumes the ratings are always there and always in
          // the same position in the ratings array so I changed to a more robust method
          // console.log("IMDB Rating:      " + jsonData.Ratings[0].Value);
          // console.log("Rotten Tomatoes:  " + jsonData.Ratings[1].Value);

          console.log("IMDB Rating:      " + imdbRating);
          console.log("Rotten Tomatoes:  " + rottenTomRating);

          console.log("Country:          " + jsonData.Country);
          console.log("Language:         " + jsonData.Language);
          console.log("Plot:             " + jsonData.Plot);
          console.log("Actors:           " + jsonData.Actors);

          fs.appendFile(
            "log.txt",
            command + " " + parameters.join(" ") + "\n\n" +
            "---------------------------------------\n---------------------------------------\n\n" +
            "IMDB Rating:      " + imdbRating +
            "\nRotten Tomatoes:  " + rottenTomRating +
            "\nCountry:          " + jsonData.Country +
            "\nLanguage:         " + jsonData.Language +
            "\nPlot:             " + jsonData.Plot +
            "\nActors:           " + jsonData.Actors +
            "\n\n********************************************************\n********************************************************\n\n",
            function (error) {
              if (error) {
                return console.log(error);
              };
            });
        })
        .catch(function (error) {
          console.log(error);
        });
      break;

    case `do-what-it-says`:
      // console.log("Do what it says was called");

      fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
          return console.log(error);
        }

        // console.log(data);

        var dataArr = data.split(",");

        // console.log(dataArr);
        if (dataArr[0] === "do-what-it-says") {
          console.log("Nope, no infinite loops allowed!");
        } else {
          command = dataArr[0];
          parameters = dataArr[1].split(" ");
          // console.log(parameters);

          liri();
        }
      });
      break;

    default:
      console.log(
        "'" +
        command +
        "' is not a valid command.  Valid commands are 'concert-this', 'spotify-this-song', 'movie-this', and 'do-what-it-says'."
      );
  }
};

liri();
