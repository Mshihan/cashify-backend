const express = require("express");
const userRouter = require("./routes/userRoutes");

const app = express();

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// =================================
// Routes
// =================================

app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  next(new Error(`Can't find ${req.originalUrl} on the server`));
});
module.exports = app;
