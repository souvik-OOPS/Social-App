import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'
dotenv.config()

const uploadOnCloudinary = async (buffer, filename) => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
    try {
        if (!buffer) {
            throw new Error("No file buffer provided");
        }
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { resource_type: "auto", public_id: filename },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(buffer);
        })
        return result
    } catch (error) {
        console.error("Cloudinary upload error:", error.message);
        return null;
    }
}

export default uploadOnCloudinary