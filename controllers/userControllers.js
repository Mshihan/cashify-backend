const catchAsync = require("./../utils/catchAsync");
const User = require("./../models/userModel");

exports.details = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const user = await User.findOne({ email });

  res.status(200).json({
    status: "success",
    user,
  });
});

exports.transfer = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const transferAmount = req.body.amount;

  const user = await User.findOne({ email });
  let amount = user.amount - transferAmount;
  if (amount < 0) {
    res.status(200).json({
      status: "Error",
      message: "No enough money",
    });
  }
  const updatedUser = await User.findOneAndUpdate({ email, amount });
  await updateReference(req);

  res.status(200).json({
    status: "success",
    message: "Withdraw successful",
  });
});

const updateReference = catchAsync(async (req) => {
  const email = req.body.targetEmail;
  const transferAmount = req.body.amount;

  const targetUser = await User.findOne({ email: email });
  const amount = transferAmount + targetUser.amount;
  targetUser.amount = amount;

  const targetUpdatedUser = await User.findOneAndUpdate(
    { email: email },
    { amount: amount }
  );
});

exports.withdraw = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const withdraw = req.body.withdraw;
  const user = await User.findOne({ email });

  const amount = user.amount - withdraw;
  const updatedUser = await User.findOneAndUpdate({ email, amount });

  res.status(200).json({
    status: "success",
    message: "Withdraw successful",
  });
});

exports.deposit = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const deposit = req.body.deposit;
  const user = await User.findOne({ email });

  const amount = user.amount + deposit;
  const updatedUser = await User.findOneAndUpdate({ email, amount });

  res.status(200).json({
    status: "success",
    message: "Deposit successful",
  });
});
