import { cloudinary } from "../helpers/helper.js";

export const uploadImage = async (file, folderName) => {
  if (!file) return null;
  try {
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      upload_preset: folderName,
      format: "webp",
    });

    const optimizedUrl = cloudinary.url(result.public_id, {
      transformation: [
        {
          quality: "auto",
          fetch_format: "auto",
          width: 900,
          height: 900,
          crop: "fill",
          gravity: "auto",
        },
      ],
    });

    return {
      url: optimizedUrl,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
};

export const deleteImage = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
    console.log("Cloudinary image deleted:", publicId);
  } catch (error) {
    console.error("Cloudinary delete error:", error);
  }
};
