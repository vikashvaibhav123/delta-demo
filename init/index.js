const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust2";

main()
    .then(()=>{
        console.log("connection is successful");
    })
    .catch((err)=>{console.log(err);});


async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDb= async () =>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"6a43fac085d859c7e0d31855"}));
    await Listing.insertMany(initData.data);
    console.log("Database was initialized");
    console.log(initData.data.length);
}

initDb();