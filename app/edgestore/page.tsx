"use client";
import {
  MultiImageDropzone,
  type FileState,
} from "@/components/EdgstoreMultiImage";
import { SingleImageDropzone } from "@/components/EdstoreSingleImage";
import { useEdgeStore } from "@/utils/edgestore";
import React, { useState } from "react";

export default function page() {
  const [file, setFile] = useState<File>();
  console.log(file);
  const [fileStates, setFileStates] = useState<FileState[]>([]);
  const { edgestore } = useEdgeStore();
  function updateFileProgress(key: string, progress: FileState["progress"]) {
    setFileStates((fileStates) => {
      const newFileStates = structuredClone(fileStates);
      const fileState = newFileStates.find(
        (fileState) => fileState.key === key
      );
      if (fileState) {
        fileState.progress = progress;
      }
      return newFileStates;
    });
  }
  return (
    <div>
      <section className="w-full max-w-4xl mb-4 mx-auto p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="py-4">Single Image Upload</h2>
          <button>Change Image</button>
        </div>
        <SingleImageDropzone
          width={200}
          height={200}
          value={file}
          onChange={(file) => {
            setFile(file);
          }}
        />
        <button
          onClick={async () => {
            if (file) {
              const res = await edgestore.publicFiles.upload({
                file,
                onProgressChange: (progress) => {
                  // you can use this to show a progress bar
                  // alert("Progress started");
                  console.log(progress);
                },
              });
              // you can run some server action or api here
              // to add the necessary data to your database
              console.log(res);
            }
          }}
        >
          Upload
        </button>
      </section>
      <section className="w-full max-w-4xl mb-4 mx-auto p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="py-4">Single Image Upload</h2>
          <button>Change Image</button>
        </div>
        <MultiImageDropzone
          value={fileStates}
          dropzoneOptions={{
            maxFiles: 6,
          }}
          onChange={(files) => {
            setFileStates(files);
          }}
          onFilesAdded={async (addedFiles) => {
            setFileStates([...fileStates, ...addedFiles]);
            await Promise.all(
              addedFiles.map(async (addedFileState) => {
                try {
                  const res = await edgestore.publicFiles.upload({
                    file: addedFileState.file,
                    onProgressChange: async (progress) => {
                      updateFileProgress(addedFileState.key, progress);
                      if (progress === 100) {
                        // wait 1 second to set it to complete
                        // so that the user can see the progress bar at 100%
                        await new Promise((resolve) =>
                          setTimeout(resolve, 1000)
                        );
                        updateFileProgress(addedFileState.key, "COMPLETE");
                      }
                    },
                  });
                  console.log(res);
                } catch (err) {
                  updateFileProgress(addedFileState.key, "ERROR");
                }
              })
            );
          }}
        />
      </section>
    </div>
  );
}
