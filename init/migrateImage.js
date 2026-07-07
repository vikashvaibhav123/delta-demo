require("dotenv").config({
  path: require("path").join(__dirname, "../.env"),
});

const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const Listing = require("../models/listing");

// Check if .env is loaded
console.log("Cloud Name:", process.env.CLOUD_NAME);
console.log("API Key:", process.env.CLOUD_API_KEY);
console.log("API Secret:", process.env.CLOUD_API_SECRET ? "Loaded" : "Not Loaded");

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// MongoDB Connection
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust2";

async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("MongoDB Connected");

  const listings = await Listing.find({});
  console.log("Total Listings:", listings.length);

  for (let listing of listings) {
    try {
      if (
        listing.image.url &&
        listing.image.url.includes("res.cloudinary.com")
      ) {
        console.log(`✔ ${listing.title} already uploaded`);
        continue;
      }

      console.log(`Uploading: ${listing.title}`);
      console.log("URL:", listing.image.url);

      const result = await cloudinary.uploader.upload(listing.image.url, {
        folder: "wanderlust_DEV",
      });

      listing.image.filename = result.public_id;
      listing.image.url = result.secure_url;

      await listing.save();

      console.log(`✅ ${listing.title} uploaded successfully`);
    } catch (err) {
      console.log("\n==============================");
      console.log("Listing:", listing.title);
      console.log("Image URL:", listing.image.url);
      console.log("Full Error:");
      console.dir(err, { depth: null });
      console.log("==============================\n");
    }
  }

  console.log("Migration Completed");
  await mongoose.connection.close();
}

main().catch(console.error);