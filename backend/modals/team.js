const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  team_name: {
    type: String,
    required: true, 
  },
  team_tagline: {
    type: String,
    required: true, 
  },
  users: [{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  }]
});

module.exports = mongoose.model("team", teamSchema);
