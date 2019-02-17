console.log('this is loaded');
// don't need to require the "dotenv" package here.  Can do it in the "liri.js" file


exports.spotify = {
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
};
