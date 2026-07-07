const Listing=require("../models/listing.js");
const defaultImageUrl ="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=60";

function normalizeListingImage(listing) {
    if (!listing) return listing;
    if (typeof listing.image === 'string') {
        listing.image = { url: listing.image };
    }
    return listing;
}

//Index Route
module.exports.index=async (req,res)=>{
    const allListing=await Listing.find({});
    const normalizedListings = allListing.map(normalizeListingImage);
    res.render("./listings/index.ejs",{allListing: normalizedListings});
};    

//New Route
module.exports.renderNewForm=(req,res)=>{
    console.log(req.user);
    res.render("listings/new.ejs");
};

//create Listing
module.exports.createListing = async (req, res, next) => {
    const listingData = { ...req.body.Listing };

    let imageObj;

    // ✅ Case 1: If file uploaded (Cloudinary)
    if (req.file) {
        imageObj = {
            url: req.file.path,
            filename: req.file.filename
        };
    }  
    // // ✅ Case 2: Default image
    else {
        imageObj = {
            url: defaultImageUrl,
            filename: "default"
        };
    }

    listingData.image = imageObj;

    const newListing = new Listing(listingData);
    newListing.owner = req.user._id;

    await newListing.save();

    req.flash("success", "New listing Created!");
    res.redirect("/listing");
};

//Show Route
module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
    const listing=normalizeListingImage(await Listing.findById(id)
            .populate({ 
                path:"reviews",
                populate:{
                path:"author",
                },
            })
            .populate("owner"));
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        return res.redirect("/listing");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
};

//Edit Route
module.exports.editListing=async (req,res)=>{
    let {id}=req.params;
    const listing=normalizeListingImage(await Listing.findById(id));
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        return res.redirect("/listing");
    }
    let OriginalImageUrl=listing.image.url;
    OriginalImageUrl = OriginalImageUrl.replace("/upload","/upload/h_300,w_250");
    res.render("listings/edit.ejs",{listing,OriginalImageUrl});
};

//Update Route
module.exports.updateListing=async (req,res)=>{
    let {id}=req.params;
    const listingData = { ...req.body.Listing };
    let listing=await Listing.findByIdAndUpdate(id, listingData);

    if(typeof req.file !== "undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }
    req.flash("success","Listing Updated!");
    res.redirect(`/listing/${id}`);
};

//Delete Listing
module.exports.deleteListing=async (req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted!");
    res.redirect("/listing");
};

////Create Route
// module.exports.createListing=async (req,res,next)=>{

//     // let url=req.file.path;
//     // let filename=req.file.filename;
//     // console.log(url ,". .",filename);

//     const listingData = { ...req.body.Listing };
//     const imageUrl = typeof listingData.image === "string" ? listingData.image : "";

//     listingData.image = {
//         filename: "listingimage",
//         url: imageUrl.trim() ? imageUrl : defaultImageUrl,
//     };

//     const newListing = new Listing(listingData);
//     req.flash("success","New listing Created!");
//     newListing.owner=req.user._id;

//     // newListing.image={url,filename};
//     await newListing.save();
//     res.redirect("/listing");

// };

// //Update Route
// module.exports.updateListing=async (req,res)=>{
//     let {id}=req.params;
//     const listingData = { ...req.body.Listing };
//     const imageUrl = typeof listingData.image === "string" ? listingData.image : "";

//     listingData.image = {
//         filename: "listingimage",
//         url: imageUrl.trim() ? imageUrl : defaultImageUrl,
//     };

//     await Listing.findByIdAndUpdate(id, listingData);
//     req.flash("success","Listing Updated!");
//     res.redirect(`/listing/${id}`);
// };
