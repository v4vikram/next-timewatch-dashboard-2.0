"use client";
import { useDropzone } from "react-dropzone";
import { useState, useCallback, useEffect } from "react";
import Image from "next/image";

export default function DropzoneUploader({
  preview,
  setPreview,
  uploadUrl,
  setFile,
  initalFile, // This should be a string URL when editing
}) {
  // Set initial preview from initalFile
  useEffect(() => {
    if (initalFile && typeof initalFile === "string") {
      setPreview(initalFile); // No createObjectURL needed
    }
  }, [initalFile, setPreview]);

  const onDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];
      console.log("file", file)
      if (!file) return;

      setFile(file); // save the file for upload
      const localPreview = URL.createObjectURL(file);
      setPreview(localPreview);
    },
    [setFile, setPreview]
  );
  console.log("preview", preview);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div>
      <div
        {...getRootProps()}
        className="p-6 border border-dashed rounded-lg text-center cursor-pointer"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the file here ...</p>
        ) : (
          <p>Drag & drop or click to select an image</p>
        )}
      </div>
      {preview && (
        <div className="mt-4">
          <img
            src={preview.startsWith("http") ? preview : `${preview}`}
            alt="Preview"
            width={400}
            height={400}
            className="w-full h-[170px] rounded object-contain mx-auto"
          />
        </div>
      )}
    </div>
  );
}
