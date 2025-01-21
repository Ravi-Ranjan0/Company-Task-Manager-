const { google } = require("googleapis");
const Playlist = require("../models/Playlist");

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.ORIGIN}/oauth-callback`
);

// Helper function to handle Google API requests
const getYouTubeService = (accessToken) => {
  oauth2Client.setCredentials({ access_token: accessToken });
  return google.youtube({ version: "v3", auth: oauth2Client });
};

// Function to generate the Google OAuth2 authorization URL
exports.getAuthUrl = (req, res) => {
  const scopes = [
    "https://www.googleapis.com/auth/youtube.readonly",
    "https://www.googleapis.com/auth/userinfo.email",
  ];
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    prompt: "consent",
  });
  res.json({ url });
};

// Function to handle the OAuth2 callback and retrieve the tokens
exports.authCallback = async (req, res) => {
  const { code } = req.body;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    console.log("Tokens received:", tokens);
    res.json(tokens);
  } catch (err) {
    console.error("Error exchanging code for token:", err.message);
    res.status(500).json({ message: "Error exchanging code for token" });
  }
};

// Function to fetch the user's playlists from YouTube
exports.getUserPlaylists = async (req, res) => {
  try {
    const accessToken = req.header("Authorization")?.split(" ")[1];
    if (!accessToken) {
      return res.status(401).json({ message: "Missing access token" });
    }

    const youtube = getYouTubeService(accessToken);

    // Fetch user playlists
    const playlistResponse = await youtube.playlists.list({
      part: "snippet,contentDetails",
      mine: true,
      maxResults: 50,
    });

    const playlists = playlistResponse.data.items;
    if (!playlists || playlists.length === 0) {
      return res.status(404).json({ message: "No playlists found." });
    }

    // Process each playlist to fetch video details
    await Promise.all(
      playlists.map(async (playlist) => {
        const videoResponse = await youtube.playlistItems.list({
          part: "snippet,contentDetails",
          playlistId: playlist.id,
          maxResults: 50,
        });

        const videoIds = videoResponse.data.items.map(
          (item) => item.contentDetails.videoId
        );
        const videoDetailsResponse = await youtube.videos.list({
          part: "contentDetails,snippet",
          id: videoIds.join(","),
        });

        const videos = videoDetailsResponse.data.items.map((video) => ({
          videoId: video.id,
          title: video.snippet.title,
          description: video.snippet.description,
          thumbnails: video.snippet.thumbnails,
          duration: video.contentDetails.duration,
        }));

        await Playlist.updateOne(
          { id: playlist.id, userId: req.user.id },
          {
            ...playlist,
            userId: req.user.id,
            videos,
            lastUpdated: new Date(),
          },
          { upsert: true }
        );
      })
    );

    res.json(playlists);
  } catch (err) {
    console.error(
      "Error fetching playlists or videos:",
      err.response?.data || err.message
    );
    res.status(500).json({ message: "Error fetching playlists or videos" });
  }
};

// Function to fetch playlists from the database for the authenticated user
exports.getUserPlaylist = async (req, res) => {
  try {
    const playlists = await Playlist.find({ userId: req.user.id }).select(
      "-__v"
    );
    res.json(playlists);
  } catch (err) {
    console.error("Error fetching user playlists:", err.message);
    res.status(500).json({ message: "Error fetching user playlists" });
  }
};
