export async function uploadImage(file) {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "searchsphere_upload");

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/dl5yadj7c/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    throw new Error("Image upload failed");
  }
}
