export const getImageUrl = (image) => {
  console.log("image url", image, process.env.NEXT_PUBLIC_BASE_URL_API)
  if (!image) return "";

  if (typeof image === "string") {
    // If already a full URL, return as-is
    if (image.startsWith("http")) return image;

    // Otherwise prepend your base API URL
    return `${process.env.NEXT_PUBLIC_BASE_URL_API}/${image}`;
  }

  // Local uploaded file
  return URL.createObjectURL(image);
};
