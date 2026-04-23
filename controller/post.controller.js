import sharp from 'sharp';
import cloudinary from '../util/cloudinary.js';
import {Post} from '../models/post.js';
import {User} from '../models/User.js';
import { Comment } from "../models/comment.js";

export const createpost=async (req,res)=>{
try{
const {caption} = req.body;
const image=req.file
const authorid=req.id;
if(!image){
    return res.status(400).json({
        message:"image is not available",
        success:false
    });
}
    const optimizedbuffer=await sharp(image.buffer)
    //Resize & optimize image
    .resize({width:800, height:800,fit:'inside'})
    .toFormat('jpeg',{quality:80})
    .toBuffer();
    //so in optiized buffer.to string we are converting it to base64 string 
    //and by data:image/jpeg; 64 , we are telling the image format and ecoding type
    const fileuri=`data:image/jpeg;base64,${optimizedbuffer.toString('base64')}`;
    const cloudresponse=await cloudinary.uploader.upload(fileuri);
    const post=new Post({
        caption,
        image:cloudresponse.secure_url,
        author:authorid
    })
    await post.save();
    const user=await User.findById(authorid);
    if(user){
        user.posts.push(post._id);
        await user.save();
    }
    //populate the author , that is in author , we add username and profile pic , we added 
    await post.populate({path:'author',select:'-password'});
    return res.status(201).json({
        message:'Post created succesfully',
        post,
        success:true
    })

}catch(error){
    console.log(error);
}
}

export const getallpost=async (req,res)=>{
    try{
const posts=await Post.find().sort({createdAt:-1})
.populate({path:'author',select:'username profilepic'})
.populate({
    path:'comments',
    sort:{createdAt:-1},
    populate:{path:'author',select:'username profilepic'}
});
return res.status(200).json({
    posts,
    success:true
})
    } 
    catch(error){
        console.log(error);
    }
}

export const getuserpost=async (req,res)=>{
    try{
const posts=await Post.find({author:req.id}).sort({createdAt:-1})
.populate({path:'author',select:'username profilepic'})
.populate({
    path:'comment',
    sort:{createdAt:-1},
    populate:{path:'author',select:'username profilepic'}
});
return res.status(200).json({
    posts,
    success:true
})
    } 
    catch(error){
        console.log(error);
    }
}
export const likepost=async (req,res)=>{
    try{
const postid=req.params.id;
const likekarneywala=req.id;
const post=await Post.findById(postid);
if(!post){
    return res.status(400).json({
        message:"post not found",
        success:false
    })
}
await post.updateOne({$addToSet:{likes:likekarneywala}});
await post.save();
return res.status(200).json({
    message:"Post liked",
    success:true
})
    }
    catch(error){
        console.log(error);
    }
}

export const dislikepost=async (req,res)=>{
    try{
const postid=req.params.id;
const likekarneywala=req.id;
const post=await Post.findById(postid);
if(!post){
    return res.status(400).json({
        message:"post not found",
        success:false
    })
}
await post.updateOne({$pull:{likes:likekarneywala}});
await post.save();
return res.status(200).json({
    message:"Post disliked",
    success:true
})
    }
    catch(error){
        console.log(error);
    }
}

export const commentpost=async (req,res)=>{
   try{
const postid=req.params.id;
const {text}=req.body;
const commentid=req.id;
if(!text){
    return res.status(400).json({
        message:"Comment is not added",
        success:false
    })
}
const post=await Post.findById(postid);
if(!post){
    return res.status(400).json({
        message:"Post not found",
        success:false
    })
}
const comment=await Comment.create({
    text,
    author:commentid,
    post:postid
}).populate({
    path:'author',
    select:'username profilepic'
})
post.comment.push(comment._id);
await post.save();
return res.status(200).json({
    message:"Comment added",
    comment,
    success:true
})
   }
   catch(error){
       console.log(error);
   }
}

export const viewComment=async (req,res)=>{
    try{
const postid=req.params.id;
const comment=await Comment.find({post:postid}).sort({createdAt:-1}).populate({
    path:'author',
    select:'username profilepic'
})
if(!comment){
    return res.status(400).json({
        message:"No comment found",
        success:false
    })
}
return res.status(200).json({
    message:"Comments fetched",
    comment,
    success:true
})
    }
    catch(error){
        console.log(error);
    }
}

export const deletepost=async (req,res)=>{
    try{
const postid=req.params.id;
const author=req.id;
const post=await Post.findById(postid);
if(!post){
    return res.status(400).json({
        message:"Post not found",
        success:false
    })
}
if(post.author.toString()!==author){
    return res.status(400).json({
        message:"Unauthorized",
        success:false
    })
}
await Post.findByIdAndDelete(postid);
let user=await User.findById(author);
user.posts=user.posts.filter((id)=>id.toString()!==postid);
await user.save();
await Comment.deleteMany({post:postid});

return res.status(200).json({
    message:"Post deleted",
    success:true
})
    }
    catch(error){
        console.log(error);
    }
}
export const bookmark=async (req,res)=>{
    try{
const postid=req.params.id;
const author=req.id;
const post=await Post.findById(postid);
if(!post){
    return res.status(400).json({
        message:"Post not found",
        success:false
    })
}
let user=await User.findById(author);
if(user.bookmark.includes(postid)){
await user.updateOne({$pull:{bookmark:postid}});
await user.save();
return res.status(200).json({
    message:"Post removed from bookmark",
    success:true
})
}
else{
await user.updateOne({$addToSet:{bookmark:postid}});
await user.save();
return res.status(201).json({
    message:"Post added to bookmark",
    success:true
})
}
    }
    catch(error){
        console.log(error);
    }
}