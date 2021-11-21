const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// User Schema
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Name is required"],
  },
  lastName: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Please provide the email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  nic: {
    type: String,
    required: [true, "Please provide the nic"],
    unique: true,
    maxlength: 12,
    minlength: 9,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: true,
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords aren't the same",
    },
  },
  address: {
    type: String,
    required: [true, "Please provide address"],
  },
  phoneNumber: {
    type: Number,
    required: [true, "Please provide the phone number"],
  },
  dob: {
    type: Date,
    required: [true, "Please provide the date of birth"],
  },
  gender: {
    type: String,
    required: [true, "Please provide the gender"],
    enum: ["male", "female"],
  },
  amount: {
    type: Number,
    default: 0,
  },
});

// User Model
const User = mongoose.model("User", userSchema);

module.exports = User;
