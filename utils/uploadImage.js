const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;

const upload = multer(
    {
        storage: multer.diskStorage({}),
        fileFilter: (req, file, cb) =>{
            let ext = path.extname(file.originalname);
            if(ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png'){
                cb(new Error('File type not supported'), false);
                return;
            };
            req.body.image = file.originalname;
            console.log(req.body.image);
            cb(null, true);
        }
    }
);

cloudinary.config(
    {
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true
    }
);

module.exports = {upload, cloudinary};