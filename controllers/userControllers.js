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
  console.log("transfered");
  const email = req.body.email;
  const transferAmount = req.body.amount;

  const user = await User.findOne({ email });
  let amount = user.amount - transferAmount;

  console.log(amount);
  if (amount < 0) {
    res.status(200).json({
      status: "Error",
      message: "No enough money",
    });
  }
  const updatedUser = await User.findOneAndUpdate(
    { email: email },
    {
      amount: amount,
      $push: {
        transactions: {
          transactionType: "Withdraw",
          transferAmount: transferAmount,
        },
      },
    }
  );
  await User.updateOne({ email: email }, {});
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
  const amount = parseInt(transferAmount) + parseInt(targetUser.amount);
  targetUser.amount = amount;

  const targetUpdatedUser = await User.findOneAndUpdate(
    { email: email },
    {
      amount: amount,
      $push: {
        transactions: {
          transactionType: "Deposit",
          transferAmount: req.body.amount,
        },
      },
    }
  );
  // await User.updateOne(
  //   { email: email },
  //   {
  //     $push: {
  //       transactions: { transactionType: "Deposit", amount: transferAmount },
  //     },
  //   }
  // );
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

exports.nicChecker = catchAsync(async (req, res, next) => {
  const { nic } = req.body;

  // 2) check if the user exists & password is correct
  const user = await User.findOne({ nic: nic });

  if (user) {
    res.status(200).json({
      status: "fail",
      message: "NIC already exists",
    });
  }

  res.status(200).json({
    status: "success",
    message: "Valid NIC",
  });
});

exports.emailChecker = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email: email });

  if (user) {
    return res.status(200).json({
      status: "fail",
      message: "Email already exists",
    });
  }

  res.status(200).json({
    status: "success",
    message: "Valid Email",
  });
});
