// components/shared/SingleImageUploader
"use client";
import { useDropzone } from "react-dropzone";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { X } from "lucide-react";

export default function ImageUploader({
  multiple = false,
  value = null, // array or single url
  onChange = () => {},
  label = "Upload Image",
}) {
  const [previews, setPreviews] = useState([]);

  // Set initial file previews
  useEffect(() => {
    if (!value) return;

    if (multiple && Array.isArray(value)) {
      setPreviews(value);
    } else if (!multiple && typeof value === "string") {
      setPreviews([value]);
    }
  }, [value, multiple]);

  // Handle file drop
  const onDrop = useCallback(
    (acceptedFiles) => {
      const urls = acceptedFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));

      // merge previews
      let newPreviews = multiple
        ? [...previews, ...urls]
        : [urls[0]];

      setPreviews(newPreviews);

      // send raw files to parent
      onChange(
        multiple
          ? newPreviews.map((item) => item.file || item.preview)
          : newPreviews[0].file
      );
    },
    [multiple, previews, onChange]
  );

  const removeImage = (index) => {
    const updated = previews.filter((_, i) => i !== index);
    setPreviews(updated);

    onChange(multiple ? updated : null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple,
    accept: { "image/*": [] },
    onDrop,
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className="p-6 border border-dashed rounded-lg text-center cursor-pointer hover:bg-gray-50"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-sm">Drop files here...</p>
        ) : (
          <p className="text-sm">{label}</p>
        )}
      </div>

      {/* Previews */}
      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mt-4">
          {previews.map((item, index) => (
            <div key={index} className="relative">
              <Image
                src={item.preview || item}
                width={200}
                height={200}
                alt="preview"
                className="w-full h-32 object-cover rounded-md"
              />
              <button
                type="button"
                className="absolute top-1 right-1 bg-white rounded-full p-1 shadow"
                onClick={() => removeImage(index)}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
