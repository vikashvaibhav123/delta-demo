const User = require("../models/user.js");
//render SignUp
module.exports.renderSignup=(req,res)=>{
    res.render("users/signup.ejs");
};

//signUp
module.exports.signUp=async(req,res)=>{
    try{
        let {username,email,password}=req.body;
        const newUser=new User({username,email});
        const registerdUser=await User.register(newUser,password);
        // console.log(registerdUser);
        req.login(registerdUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","welcome to wanderlust!");
            res.redirect("/listing");
        });
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/listing");
    }
};

//render login
module.exports.renderLogin=(req,res)=>{
    res.render("users/login.ejs");
}

//login
module.exports.login=async (req, res) => {
    req.flash("success", "Welcome to Wanderlust! You are logged in!");
    let redirectUrl=res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl);
};

//logout
module.exports.logOut=(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","you are successfully logout");
        res.redirect("/listing");
    });
};