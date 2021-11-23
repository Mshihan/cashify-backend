const express = require("express");
const userRouter = require("./routes/userRoutes");

const app = express();

app.use(express.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, PATCH");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, token"
  );
  next();
});
app.use(express.static(`${__dirname}/public`));

// =================================
// Routes
// =================================

app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  next(new Error(`Can't find ${req.originalUrl} on the server`));
});
module.exports = app;
