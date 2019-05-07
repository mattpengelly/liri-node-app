# liri-node-app

This app is run by entering 'node liri.js' in the command line, followed by one of the following commands:

-concert-this
    Type in the name of a band you'd like to see after the command
        e.g. node liri.js concert-this Black Keys
    You will receive the venue, locaction, and date of all upcoming shows for the artist

-movie-this
    Type in the name of the movie you want info about after the command
        e.g. node liri.js movie-this Princess Bride
    You will receive the IMDB and Rotten Tomatoes ratings, country in which the movie was made, the language of the movie, a summary of the plot, and the leading actors in the movie

-spotify-this-song
    Type in the name of the song you want info about after the command
        e.g. node liri.js spotify-this-song Folsom Prison Blues
    You will receive the Artist(s) that recorded the song, the official song title, a link to listen to a preview of the song, and the name of the album on which the song was released.

-do-what-it-says
    Type in the command node liri.js do-what-it-says
    Liri will read the file random.txt that contains a liri command followed by a comma an then the associated info for that command
    For example, random.txt might contain 'spotify-this-song,I want it that way'

See the Video-liri.gif file for a demonstartion of liri's functionality