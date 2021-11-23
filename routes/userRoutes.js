const express = require("express");
const authControllers = require("../controllers/authControllers");
const userControllers = require("../controllers/userControllers");

// =================================
// Separate Routes accordingly
// =================================

const router = express.Router();

router.route("/signup").post(authControllers.signup);
router.route("/login").post(authControllers.login);
// withdraw
router
  .route("/withdraw")
  .patch(authControllers.protected, userControllers.withdraw);
router
  .route("/deposit")
  .patch(authControllers.protected, userControllers.deposit);
router
  .route("/details")
  .post(authControllers.protected, userControllers.details);
router
  .route("/transfer")
  .patch(authControllers.protected, userControllers.transfer);
router.route("/nic-check").post(userControllers.nicChecker);
router.route("/email-check").post(userControllers.emailChecker);

module.exports = router;
