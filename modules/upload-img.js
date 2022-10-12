const multer = require('multer');
const {v4:uuidv4}=require('uuid');

const extMap = {
    'image/jpeg':'.jpg',
    'image/png':'.png',
    'image/gif':'.gif',    
};

const fileFilter = (req,file,cb)=>{
    cb(null,!!extMap[file.mimetype]);
}

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,__dirname+'/../public/uploads')
    },
    filename:(req,file,cb)=>{
        let ext = extMap[file.mimetype];//副檔名
        cb(null,uuidv4()+ext)
    }
});

const uploads =multer({storage,fileFilter});
module.exports = uploads;