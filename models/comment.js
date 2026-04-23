import mongoose from 'mongoose';
const commentschema=new mongoose.Schema({
    author:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    comment:{type:String,required:true},
    post:{type:mongoose.Schema.Types.ObjectId,ref:'Post'}
});
export const Comment=mongoose.model('Comment',commentschema);