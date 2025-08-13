export function getOriginalFilename(filename) {
  const parts = filename.split("-");
  if (parts.length >= 2) {
    // Remove the last part before the extension (random suffix)
    const suffix = parts.pop(); // removes "lbhdr6"
    const nameWithoutSuffix = parts.join("-");
    const extension = suffix.split(".").pop(); // "pdf"

    return `${nameWithoutSuffix}.${extension}`;
  }
  return filename;
}
