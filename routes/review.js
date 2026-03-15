const express = require("express");
const router = express.Router({mergeParams: true });
const wrapAsyc = require("../utils/wrapAsyc.js");
const ExpressError = require("../utils/ExpressError.js");
const Reviews = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");

//Post Review Route
router.post(
    "/", 
    isLoggedIn,
    validateReview, 
    wrapAsyc(reviewController.createReview));

//Delete Review Route
router.delete(
    "/:reviewId", 
    isLoggedIn,
    isReviewAuthor,
    wrapAsyc(reviewController.destroyReview));

  module.exports = router;