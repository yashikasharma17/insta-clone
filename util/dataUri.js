import DataUriParser from "datauri/parser.js";//This library converts file buffers into Data URI format.
import path from "path";//It helps extract:file extensions
const parser=new DataUriParser();
const getDataParser=(file)=>{
    const Extname=path.extname(file.originalname).toString();//Because path.extname() returns file extension.
    return parser.format(Extname,file.buffer).content;
/*Here’s what happens:

file.buffer → raw file data

Extname → file type (like .png)

parser.format() → converts buffer into Data URI format

.content → returns final base64 string*/

};
export default getDataParser;