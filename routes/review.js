const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
const{isLoggedin,validateReview,isReviewAuthor}=require("../middleware.js");
const reviewController=require("../controllers/review.js");

//review
//post Review request
router.post("/",isLoggedin ,validateReview , wrapAsync(reviewController.createReview));

//Delete review request
router.delete("/:reviewId",isLoggedin,isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports=router;