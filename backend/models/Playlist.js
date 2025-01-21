const mongoose = require("mongoose");

const PlaylistSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  snippet: {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    thumbnails: {
      default: {
        url: String,
      },
      medium: {
        url: String,
      },
      high: {
        url: String,
      },
    },
  },
  contentDetails: {
    itemCount: {
      type: Number,
    },
  },
  videos: [
    {
      videoId: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
      },
      thumbnails: {
        default: {
          url: String,
        },
        medium: {
          url: String,
        },
        high: {
          url: String,
        },
      },
      duration: {
        type: String,
      },
    },
  ],
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Playlist", PlaylistSchema);
