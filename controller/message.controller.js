import { Conversation } from '../models/conversation.js';
import {Message} from '../models/message.js';
export const sendmessage=async (req,res)=>{
    try {
       const senderid=req.id;
       const receiverid=req.params.id;
       const {textmessage:message}=req.body;
       const newmessage=await Message.create({
       senderid,
       receiverid,
        message
       })
       let conversation =await Conversation.findOne({
        participants:{$all:[senderid,receiverid]}
       });
       if(!conversation){
         conversation=await Conversation.create({
            participants:[senderid,receiverid]
        })
       }
       if(newmessage){
        conversation.message.push(newmessage._id);

       }
       await Promise.all([conversation.save(),newmessage.save()]);
       return res.status(200).json({
        success:true,
        newmessage
       })
    } catch (error) {
        console.log(error);
    }
}

export const getmessages=async (req,res)=>{
    try {
        const senderid=req.id;
        const receiver=req.params.id;
        const convo=await Conversation.findOne({
            participants:{$all:[senderid,receiver]}
        }).populate({
            path:'message'
        })
        if(!convo){
            return res.status(400).json({
                success:false,
                message:[]
            })
        }
        return res.status(201).json({
            message:convo?.message,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}