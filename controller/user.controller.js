import { User } from "../models/user.js";
import bcrypt from "bcryptjs";

export const register=async (req,res)=>{
    try{
const {username,password,email}=req.body;
if(!username || !password || !email){
    return res.status(401).json({
        message:"Something is missing , try again",
        success:false
    });
}
const user=await User.findOne({email});
if(user){
     return res.status(401).json({
        message:"User already exists , try again",
        success:false
    });
};
const hashpassword=await bcrypt.hash(password,10);
await User.create({
    username,
    password:hashpassword,
    email
});
return res.status(201).json({
    message:"user registered succesfully",
    success:true
});
    }
    catch(error){
console.log(error);

    }

}
export const login=async (req,res)=>{
    try{
    const {email,password}=req.body;
    if(!email || !password){
          return res.status(401).json({
        message:"Something is missing , try again",
        success:false
    });
    }
    const user=await User.findOne({email});
if(!user){
     return res.status(401).json({
        message:"User does not exists, try again",
        success:false
    });
};
const iscorrectpassword=await bcrypt.compare(password,user.password);
if(!iscorrectpassword){
    return res.status(401).json({
        message:"Password does not match, try again",
        success:false
    });
}

    }
    catch(error){
console.log(error);
    }
}