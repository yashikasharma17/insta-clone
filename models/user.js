import mongoose from "mongoose";
const userschema=new mongoose.Schema({
    username:{type:String,required:true,unique:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true,unique:true},
    profilepic:{type:String,default:''},
    bio:{type:String,default:''},
     gender:{type:String,enum:['male','female']},
    followers:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],
    following:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],
    Posts:[{type:mongoose.Schema.Types.ObjectId,ref:'Post'}],
    bookmark:[{type:mongoose.Schema.Types.ObjectId,ref:'Post'}],
},{timestamp:true});
export const User =
  mongoose.models.User || mongoose.model('User', userschema);

