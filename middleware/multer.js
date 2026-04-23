//Multer is middleware used with Express.js to handle file uploads
import multer from "multer";
//here we are making a multer instace and defining the storage 
const upload=multer({
    storage:multer.memoryStorage()//there are two types of memory -disk or memory , 
    //disk is used to store file in our server , 
    //memory puts the file as temporary file in the memory 
})
export default upload;
