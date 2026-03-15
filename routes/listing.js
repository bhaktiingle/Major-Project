const express = require("express");
const router = express.Router();
const wrapAsyc = require("../utils/wrapAsyc.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });


//Search bar
router
    .get ("/search", async (req, res) => {
    const { query } = req.query;

    const listings = await Listing.find({
      $or: [
        { title: { $regex: query, $options: "i" }},
        { location: { $regex: query, $options: "i" } }
        ]
    });

    res.render("listings/index", { allListings: listings });
});

//category Route
router
.get ("/category/:category", async (req,res) => {
    let {category} = req.params;
    const listings = await Listing.find({category: category});

    res.render("listings/index.ejs", {allListings: listings});
});



router 
    .route("/")
    .get( wrapAsyc(listingController.index))
    .post( 
        isLoggedIn,
        upload.single("listing[image][url]"),
        validateListing,
        wrapAsyc(listingController.createListing)
    );
    

//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
    .route("/:id")
    .get( wrapAsyc(listingController.showListing))
    .put( 
        isLoggedIn,
        isOwner, 
        upload.single("listing[image]"),
        validateListing, 
        wrapAsyc(listingController.updateListing)) 
    .delete(isLoggedIn,isOwner, wrapAsyc(listingController.destroyListing)
    );

//Edit Route 
router.get("/:id/edit", isLoggedIn,isOwner, wrapAsyc(listingController.renderEditForm));


module.exports = router;
