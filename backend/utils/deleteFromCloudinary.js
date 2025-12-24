import cloudinary from "../config/cloudinary.js";

const deleteFromCloudinary = async (imageUrl) => {
  if (!imageUrl) return;

  try {
    // Extract public ID from URL
    // Example: https://res.cloudinary.com/demo/image/upload/v1234567890/avatars/filename.jpg
    // Public ID: avatars/filename
    const splitUrl = imageUrl.split("/");
    const filename = splitUrl[splitUrl.length - 1]; // filename.jpg
    const folder = splitUrl[splitUrl.length - 2]; // avatars
    const publicId = `${folder}/${filename.split(".")[0]}`;

    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
  }
};

export default deleteFromCloudinary;
