const dotenv = require('dotenv');
const cloudinaryModule = require('cloudinary');
const { ModuleGraph } = require('vite');

dotenv.config();
const cloudinary = cloudinaryModule.v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

module.exports = cloudinary