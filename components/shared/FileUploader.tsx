'use client';
import { useCallback, SetStateAction, Dispatch } from "react";
import type { FileWithPath } from "react-dropzone";
import { useDropzone } from "@uploadthing/react";
import { generateClientDropzoneAccept } from "uploadthing/client";

import { convertFileToUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type FileUploaderProps = {
  imageUrl: string;
  onFieldChange: (url: string) => void;
  setFiles: Dispatch<SetStateAction<File[]>>;
};

export function FileUploader({ imageUrl, onFieldChange, setFiles }: FileUploaderProps) {
  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    setFiles(acceptedFiles);
    onFieldChange(convertFileToUrl(acceptedFiles[0]));
  }, []);

  // const { startUpload, permittedFileInfo } = useUploadThing(
  //   "myUploadEndpoint",
  //   {
  //     onClientUploadComplete: () => {
  //       alert("uploaded successfully!");
  //     },
  //     onUploadError: () => {
  //       alert("error occurred while uploading");
  //     },
  //     onUploadBegin: () => {
  //       alert("upload has begun");
  //     },
  //   },
  // );
  // const fileTypes = permittedFileInfo?.config ? Object.keys(permittedFileInfo?.config) : [];

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*' ? generateClientDropzoneAccept(['image/*']) : undefined,
  });

  return (
    <div {...getRootProps()}
      className="flex flex-col flex-center h-72 overflow-hidden cursor-pointer rounded-xl bg-dark-3 bg-grey-50">
      
      <input {...getInputProps()} className="cursor-pointer" />
      {imageUrl ? (
        <div className="flex flex-1 justify-center w-full h-full">
          <img src={imageUrl} alt="image" width={250} height={250} className="w-full object-contain object-center" />
        </div>
      ) : (
        <div className="flex-col flex-center text-grey-500 py-5">
          <img src="/assets/icons/upload.svg" alt="file upload" width={77} height={77} />

          <h3 className="mb-2 mt-2">Drag photo here</h3>
          <p className="p-medium-12 mb-4">SVG, PNG, JPG</p>

          <Button type="button" className="rounded-full">
            Select from device
          </Button>
        </div>
      )}
      
    </div>
  );
};
