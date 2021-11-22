const User = require("./../models/userModel");
const catchAsync = require("../utils/catchAsync");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    nic: req.body.nic,
    address: req.body.address,
    phoneNumber: req.body.phoneNumber,
    dob: req.body.dob,
    gender: req.body.gender,
  });

  const token = signToken(newUser._id);
  res.status(201).json({
    status: "success",
    token,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) check if the email & password exists
  if (!email || !password) {
    return next(new Error("Please provide email and password"));
  }

  // 2) check if the user exists & password is correct
  const user = await User.findOne({ email }).select("+password");

  // 3) if everything is ok, send the json web token
  const token = signToken(user._id);

  res.status(200).json({
    status: "success",
    token,
  });
});

exports.protected = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.token && req.headers.token.startsWith("Bearer ")) {
    token = req.headers.token.split(" ")[1];
  }

  if (!token) {
    return next(
      new Error(
        "You are not logged in. Please log in to access this route",
        401
      )
    );
  }

  // Verification token
  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // Check if the user is exists
  const currentUser = await User.findById(decode.id);

  // Check if the user exists
  if (!currentUser) {
    return next(
      new Error("The user belonging to the token does not exist", 401)
    );
  }

  // Check if the password is changed by the user
  // if (currentUser.changedPasswordAfter(decode.iat)) {
  //   return next(
  //     new AppError(
  //       "User recently changed the password. Please login again",
  //       401
  //     )
  //   );
  // }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});
