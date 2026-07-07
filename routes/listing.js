const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedin, isOwner, validateListing } = require("../middleware.js");
const { populate } = require("../models/review.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");

const upload = multer({ storage });

router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedin,upload.single('Listing[image][url]'),validateListing,wrapAsync(listingController.createListing));

//New route
router.get("/new", isLoggedin, listingController.renderNewForm);

router
.route("/:id")
    .get( wrapAsync(listingController.showListing))
    .put(isLoggedin,isOwner, upload.single('Listing[image][url]'), validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedin,isOwner,wrapAsync(listingController.deleteListing));

//edit route
router.get(
  "/:id/edit",
  isLoggedin,
  isOwner,
  wrapAsync(listingController.editListing),
);

module.exports = router;


// //Index route
// router.get("/", wrapAsync(listingController.index));

// //Create route
// router.post(
//   "/",
//   isLoggedin,
//   validateListing,
//   wrapAsync(listingController.showListing),
// );

//Show route
// router.get("/:id", wrapAsync(listingController.showListing));

// //Update route
// router.put("/:id", isLoggedin, validateListing, isOwner, wrapAsync());

// //Delete route
// router.delete(
//   "/:id",
//   isLoggedin,
//   isOwner,
//   wrapAsync(listingController.deleteListing),
// );