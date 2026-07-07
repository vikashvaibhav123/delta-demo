const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");

//signup
router
  .route("/signup")
  .get(userController.renderSignup)
  .post(wrapAsync(userController.signUp));


//login
router
  .route("/login")
  .get(userController.renderLogin)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/listing",
      failureFlash: true,
    }),
    userController.login,
  );


//logout
router.get("/logout", userController.logOut);

module.exports = router;


// //signup
// router.get("/signup", userController.renderSignup);

// router.post("/signup", wrapAsync(userController.signUp));

// //login
// router.get("/login", userController.renderLogin);

// router.post(
//   "/login",
//   saveRedirectUrl,
//   passport.authenticate("local", {
//     failureRedirect: "/listing",
//     failureFlash: true,
//   }),
//   userController.login,
// );
