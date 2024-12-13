"use client";

import { Button } from "@/components/ui/button";
import { useMemo, CSSProperties, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";

// Type assertion to prevent "Type 'string' is not assignable to type ..." errors
// https://github.com/frenic/csstype#what-should-i-do-when-i-get-type-errors
const baseStyle: CSSProperties = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
};

const focusedStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

export default function FileUpload({
  handleUpload,
}: {
  handleUpload: (file: File) => void;
}) {
  const [file, setFile] = useState<File>();
  const [previewUrl, setPreviewUrl] = useState<string>();
  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({
      accept: {
        "application/pdf": [".pdf"],
      },
      maxFiles: 1,
      onDrop: (acceptedFiles) => {
        setFile(acceptedFiles[0]);
        setPreviewUrl(URL.createObjectURL(acceptedFiles[0]));
      },
    });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    if (previewUrl === undefined) return;
    return () => URL.revokeObjectURL(previewUrl);
  }, [file]);

  return (
    <div className="flex flex-col gap-6">
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        <p>drag & drop ur gojek wrapped file here</p>
      </div>
      {previewUrl !== undefined && (
        <iframe src={previewUrl} className="w-full h-[50vh] pt-6" />
      )}
      <Button className="w-full" onClick={handleUpload}>
        get roasted
      </Button>
    </div>
  );
}
