const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      min: 3,
      max: 20,
      unique: true,
    },
    email: {
      type: String,
      max: 50,
      unique: true,
    },
    verified: {
      type: Number,
      enum: [1, 2],
    },
    phone: {
      type:String,
      min: 10,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      min: 6,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    coverPicture: {
      type: String,
      default: "",
    },
    
    requestTo: {
      type: Array,
      default: [],
    },
    requestFrom: {
      type: Array,
      default: [],
    },
    friends: {
      type: Array,
      default: [],
    },
    blocked: {
      type: Array,
      default: [],
    },
    blockedBy: {
      type: Array,
      default: [],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    desc: {
      type: String,
      max: 50,
    },
    city: {
      type: String,
      max: 50,
    },
    country: {
      type: String,
      max: 50,
    },
    relationship: {
      type: Number,
      enum: [1, 2, 3],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);