
const multer = require('multer');
const path = require('path');

const fs = require('fs');
const { useErrorResponse } = require('../../config/methods/response');
const uploads = async (req, res, next) => {
    try {

        var fileName
        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                const publicDir = path.join("", 'public');
                const imagesDir = path.join(publicDir, 'images');
                // create the directories if they don't exist
                if (!fs.existsSync(publicDir)) {
                    fs.mkdirSync(publicDir);
                }
                if (!fs.existsSync(imagesDir)) {
                    fs.mkdirSync(imagesDir);
                }
                console.log('i am here to upload');

                cb(null, imagesDir);
            },
            filename: async (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                fileName = file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop();
                console.log(fileName);
                console.log('i am here to upload');


                // req.imagePath = fileName;
                cb(null, fileName);
            },
        });
        const upload =  multer({ storage }).single('file');
        upload(req, res, (err) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log(fileName)
                let imagePath = '/images/' + fileName;


                req.imagePath = imagePath,

                    next();
            }
        });
    }
    catch (err) {
        console.log(err);
      return  useErrorResponse(res, 'error', 404)

    }
}

module.exports = { uploads };