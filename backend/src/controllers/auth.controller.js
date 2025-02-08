const mongoose=require('mongoose')
const User=require('../models/User')
const {body ,validationResult}=require('express-validator')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcryptjs')
const dotenv=require('dotenv')
const generateToken=require('../middleware/utils')
const cloudinary= require('../middleware/cloudinary')
dotenv.config()
//Route 1 - Create a user using signup POST "/api/auth/signup" No login required
const signup = async (req, res) => {
   const errors = validationResult(req).array();
   if (errors.length > 0) {
      console.log("Validation errors:", errors);
      return res.status(400).json({ errors });
   }
   try{
            const {username,email,password}=req.body
         let user= await User.findOne({email})
         if (user) {
            return res.status(400).json({ error: "User already exists" }); // ❌ Duplicate email
         }
            const salt=await bcrypt.genSalt(10);
            const hashedPassword=await bcrypt.hash(password,salt)
         user=new User({
            username:username,
            email:email,
            password:hashedPassword
         })
         if(user){
            //generate jwt token here
            generateToken(user._id,res)
            await user.save()
            res.status(201).json({
               user_id:user._id,
              username:user.username,
              email:user.email,
              profilePic:user.profilePic

            }) 
         }
         else{
            res.status(400).json({message:"Invalid user data"});
         }

           
   }   
   catch (error) {
      console.error("Error in signup:", error);
      res.status(500).json({ error: "Internal Server Error" });
   }
};



const login= async (req,res)=>{
   const errors = validationResult(req).array();
   if (errors.length > 0) {
      console.log("Validation errors:", errors);
      return res.status(400).json({ errors });
   }
   try{
      const {email,password}=req.body
         let user= await User.findOne({email});
         if(!user){
            return res.status(404).json({errors:"Invalid Credentials"})
         }
         const hashedPassword=user.password
         const verify= await bcrypt.compare(password,hashedPassword)
         if(!verify){
            return res.status(403).json({errors:"Access Denied"})
         }
        const token= generateToken(user._id,res)
         
         res.status(200).json({user:{
            user_id:user._id,
              username:user.username,
              email:user.email,
              profilePic:user.profilePic
         },token:token})
       
   }
   catch (error) {
      console.error("Error in Login:", error);
      res.status(500).json({ error: "Internal Server Error" });
   }
}
  
const logout=(req,res)=>{
   const errors = validationResult(req).array();
   if (errors.length > 0) {
      console.log("Validation errors:", errors);
      return res.status(400).json({ errors });
   }
   try{
        res.cookie("jwt_token","", {masAge:0})
        res.status(200).json({message:"Logged Out Successfully"})
   }
   catch (error) {
      console.error("Error in logout:", error);
      res.status(500).json({ error: "Internal Server Error" });
   }
}
const updateProfile= async(req,res)=>{
   const errors = validationResult(req).array();
   if (errors.length > 0) {
      console.log("Validation errors:", errors);
      return res.status(400).json({ errors });
   }
   try{
     const {profilePic}=req.body;
     const userId=req.user._id;
     if(!profilePic){
      return res.status(400).json({message:"Profile pic is required"})
     }
   const uploadResponse=  await cloudinary.uploader.upload(profilePic)
   const updatedUser=await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true})
   res.status(200).json(updatedUser)
   }
   catch (error) {
      console.error("Error in updateProfile:", error);
      res.status(500).json({ error: "Internal Server Error" });
   }
}
const checkAuth=(req,res)=>{
   try{
res.status(200).json(req.user)  
   }
   catch(error){ 
      console.log("Error in ChechAuth Controller",error.message);
      res.status(500).json({Error:"Internal Server Error"});
   }
}
module.exports={login,signup,logout,updateProfile,checkAuth}