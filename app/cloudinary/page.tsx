"use client";
import { CldUploadWidget, CldUploadWidgetInfo } from "next-cloudinary";
import React, { useState } from "react";

export default function page() {
  const [uploadedFiles, setUploadedFiles] = useState<CldUploadWidgetInfo[]>([]);
  //
  console.log(uploadedFiles);
  return (
    <div>
      <section className="w-full max-w-4xl mb-4 mx-auto p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="py-4">Single Image Upload</h2>
          <button>Change Image</button>
        </div>
        <CldUploadWidget
          uploadPreset="testUploads"
          onSuccess={(result, { widget }) => {
            console.log(result?.info);
            widget.close();
          }}
        >
          {({ open }) => {
            return (
              <button
                className="py-3 rounded-md px-4 bg-slate-900 text-slate-100"
                onClick={() => open()}
              >
                Upload an Image
              </button>
            );
          }}
        </CldUploadWidget>
      </section>
      <section className="w-full max-w-4xl mb-4 mx-auto p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="py-4">Multiple Image Upload</h2>
          <button>Change Image</button>
        </div>
        <CldUploadWidget
          options={{
            sources: ["local", "url", "unsplash"],
            multiple: true,
            maxFiles: 5,
            showCompletedButton: true,
          }}
          uploadPreset="testUploads"
          onSuccess={(result, { widget }) => {
            setUploadedFiles((prevFiles: any) => [...prevFiles, result.info]);
            widget.close();
          }}
        >
          {({ open }) => {
            return (
              <button
                className="py-3 rounded-md px-4 bg-slate-900 text-slate-100"
                onClick={() => open()}
              >
                Upload an Image
              </button>
            );
          }}
        </CldUploadWidget>
      </section>
    </div>
  );
}
