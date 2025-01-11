// src/components/products/ImageUpload.js
"use client";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function ImageUpload({ value = [], disabled, onChange, onRemove }) {
  const onDrop = useCallback(
    (acceptedFiles) => {
      const newFiles = acceptedFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      onChange?.(acceptedFiles);
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
    disabled,
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6 
          ${isDragActive ? "border-primary" : "border-border"}
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        `}
      >
        <input {...getInputProps()} />
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Drag & drop images here, or click to select files
          </p>
        </div>
      </div>
      {value?.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {value.map((url, index) => (
            <div key={url || index} className="relative aspect-square group">
              <div className="relative w-full h-full rounded-lg overflow-hidden">
                <Image
                  src={typeof url === "string" ? url : url.preview || ""}
                  alt={`Product image ${index + 1}`}
                  className="object-cover group-hover:opacity-75 transition"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={index === 0}
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition"
                onClick={() => onRemove?.(url)}
                disabled={disabled}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
