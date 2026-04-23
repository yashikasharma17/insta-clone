import { User } from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataParser from "../util/dataUri.js";

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
    let  user=await User.findOne({email});
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
const token =await jwt.sign({userid:user._id},process.env.SECRET_KEY,{expiresIn:'10d'});
const populatedpost=await Promise.all(
    user.Posts.map(async(postid)=>{
        const post=await Post.findById(postid);
        if(post.author.equals(user._id)){
return post;
        }
        return null;
    })
)

user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            profilepic: user.profilepic,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
            Posts: populatedpost
        }
return res.cookie('token',token,{httpOnly:true,sameSite:'strict',maxAge:10*24*60*60*1000}).json({
    message:`Welcome back ${user.username}`,
    sucess:true,
    user
});
    }
    catch(error){
console.log(error);
    }
}
export const logout=async (req,res)=>{
    try{
return res.cookie("token","",{maxAge:0}).json({
message:"User logout successfully",
success:true
})
    }
    catch(error){
        console.log(error);
    }
}
export const getprofile=async (req,res)=>{
    try {
        const userId=req.params.id;
        let user=await User.findById(userId);
        return res.status(201).json({
            user,
            success:true
        });
    } catch (error) {
        console.log(error);
    }
}
export const editprofile=async (req,res)=>{
    try {
        
    const userid=req.id;
    const {bio,gender}=req.body;
    const profilepic=req.file;
    let cloudresponse;
    if(profilepic){
        const fileuri=getDataParser(profilepic);
        cloudresponse=await cloudinary.uploader.upload(fileuri);
    }
    const user = await User.findById(userid).select('-password');
        if (!user) {
            return res.status(404).json({
                message: 'User not found.',
                success: false,
                user
            });
        };

    if(bio){
        user.bio=bio;
    }
    if(gender){
        user.gender=gender;
    }
    if(profilepic){
        user.profilepic=cloudresponse.secure_url;
    }
    await user.save();
    return res.status(200).json({
        message:"Pofile updates",
        success:true,
        user
    });
    } catch (error) {
        console.log(error);
    }
}
export const suggestedusers=async (req,res)=>{
    try{
        const suggestusers=await User.find({_id:{$ne:req.id}}).select('-password');
        //_id is how id is saved in mongodb and not in id form 
        /*.find({ _id: { $ne: req.id } })
find() → fetches documents from your database
_id → unique ID of each user
$ne → “not equal to”*/
        if(!suggestusers){
            return res.status(404).json({
                message:"No user found",
                success:false
            })
        }
        return res.status(200).json({
            success:true,
            users:suggestusers
        })


    }
    catch(error){
        console.log(error);
    }
}
export const followOrUnfollow=async (req,res)=>{
    try{
    const whofollowsus=req.id;
    const whoWefollow=req.params.id;
    if(whofollowsus===whoWefollow){
        return res.status(401).json({
            message:"You cannot follow yourself",
            success:false
        })
    }

     const user = await User.findById(whofollowsus);
        const targetUser = await User.findById(whoWefollow);

        if (!user || !targetUser) {
            return res.status(400).json({
                message: 'User not found',
                success: false
            });
        }
    const isfollowed=user.following.includes(whoWefollow);
    if(isfollowed){
await Promise.all([
    User.updateOne({_id:whoWefollow},{$pull:{followers:whofollowsus}}),
    User.updateOne({_id:whofollowsus},{$pull:{following:whoWefollow}})
])
return res.status(200).json({message:"User unfollowed",success:true});
    }else{
        await Promise.all([
            User.updateOne({_id:whoWefollow},{$push:{followers:whofollowsus}}),
    User.updateOne({_id:whofollowsus},{$push:{following:whoWefollow}})
])
return res.status(200).json({message:"User followed",success:true});
    }
}
catch(error){
    console.log(error);
}
}