import multer from "multer"
import path from "path"
import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";
import { TCloudinaryResponse, TFile } from "../app/interfaces/file";

cloudinary.config({
    cloud_name: 'deojcyafw',
    api_key: '993997657296863',
    api_secret: '2X5fMT0rb-9sIA3KSyERbzrmOmo' // Click 'View API Keys' above to copy your API secret
});

// multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(process.cwd(), 'uploads'))
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage })

// cloudinary
const uploadToCloudinary = async (file: TFile): Promise<TCloudinaryResponse | undefined> => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(file.path,
            (error: Error, result: TCloudinaryResponse) => {
                fs.unlinkSync(file.path)
                if (error) {
                    reject(error)
                }
                else {
                    resolve(result)
                }
            }
        );
    })
}

export const fileUploader = {
    upload,
    uploadToCloudinary
}