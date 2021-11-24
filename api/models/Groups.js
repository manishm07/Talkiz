const mongoose = require("mongoose");

const GroupsSchema = new mongoose.Schema(
  {
    members: {
      type: Array,
      default: [],
    },
    groupName: {
        type: String,
      },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Groups", GroupsSchema);