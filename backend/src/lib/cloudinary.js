import {v2 as cloudinary} from 'cloudinary';

import {config} from 'dotenv'

config();

console.log(process.env.CLOUDINARY_CLOUD_NAME);  // Should not be undefined
console.log(process.env.CLOUDINARY_API_KEY);    // Should not be undefined
console.log(process.env.CLOUDINARY_API_SECRET); // Should not be undefined

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Replace with your Cloudinary cloud name
    api_key: process.env.CLOUDINARY_API_KEY,       // Replace with your Cloudinary API key
    api_secret: process.env.CLOUDINARY_API_SECRET, // Replace with your Cloudinary API secret
});

export default cloudinary;