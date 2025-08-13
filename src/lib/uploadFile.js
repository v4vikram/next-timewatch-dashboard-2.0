import path from "path";
import { writeFile, mkdir } from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import seoFriendlySlug from "@/backend/lib/seoFriendlySlug";

/**
 * Save an uploaded file to the given subfolder path inside `public/`
 *
 * @param {File | Blob} file - The uploaded file (from FormData)
 * @param {string[]} folderParts - Array of folder parts, e.g., ['uploads', 'docs', 'datasheet']
 * @returns {Promise<string>} - Relative file path (e.g., /uploads/docs/datasheet/filename.pdf)
 */
export async function saveUploadedFile(file, folderParts) {
  if (!file || !folderParts || !Array.isArray(folderParts)) {
    throw new Error("Valid file and folder path array are required.");
  }

  const originalName = seoFriendlySlug(path.parse(file.name).name);
  const extension = path.extname(file.name);
  const uuid = Math.random().toString(36).substr(2, 6);;
  console.log("uuid", uuid)

  const safeName = `${originalName}-${uuid}${extension}`;
  const uploadDir = path.join(process.cwd(), "public", ...folderParts);
  const filePath = path.join(uploadDir, safeName);

  // Create folder if it doesn't exist
  await mkdir(uploadDir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  // Return relative path for database
  return `/${path.join(...folderParts, safeName).replace(/\\/g, "/")}`;
}
