import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectdb from "./util/db.js";

import userroute from "./routes/user.routes.js";
import postroute from "./routes/post.routes.js";
import messageroute from "./routes/message.routes.js"

dotenv.config({});
const port=process.env.PORT || 8000;
const app=express();
app.get("/",(req,res)=>{
return res.status(200).json({
    message:"heloo everyone",
    success:true
})
})
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({extended:true}));
const corsOptions={
    origin:"http://localhost:5073",
    credentials:true
}
app.use(cors(corsOptions));
app.use("/api/v1/user",userroute);
app.use("/api/v1/post",postroute);
app.use("/api/v1/message",messageroute);


app.listen(port,()=>{
connectdb();
    console.log(`Server is running at ${port}`);
    
})
