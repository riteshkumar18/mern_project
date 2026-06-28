const User=require("../models/User");
const bcrypt=require("bcryptjs");
const generateToken=require("../utils/generateToken");


// SIGNUP

exports.signup=async(req,res)=>{

try{

const {fullName,email,password}=req.body;

const userExists=await User.findOne({email});

if(userExists){

return res.status(400).json({
message:"User already exists",
});

}

const salt=await bcrypt.genSalt(10);

const hashedPassword=await bcrypt.hash(password,salt);

const user=await User.create({

fullName,
email,
password:hashedPassword,

});

const token=generateToken(user._id);

res.json({

_id:user._id,
fullName:user.fullName,
email:user.email,
token,

});

}
catch(error){

res.status(500).json(error);

}

};


// LOGIN

exports.login=async(req,res)=>{

try{

const {email,password}=req.body;

const user=await User.findOne({email});

if(!user){

return res.status(400).json({
message:"User not found",
});

}

const isMatch=await bcrypt.compare(password,user.password);

if(!isMatch){

return res.status(400).json({
message:"Wrong Password",
});

}

const token=generateToken(user._id);

res.json({

_id:user._id,
fullName:user.fullName,
email:user.email,
token,

});

}
catch(error){

res.status(500).json(error);

}

};


// LOGOUT

exports.logout=(req,res)=>{

res.json({

message:"Logout Successful",

});

};