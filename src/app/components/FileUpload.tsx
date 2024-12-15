"use client";

import { Button } from "@/components/ui/button";
import { useMemo, CSSProperties, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Loader2 } from "lucide-react";
import * as PDFJS from "pdfjs-dist/legacy/build/pdf.mjs";
import { cn } from "@/lib/utils";

// provide worker for PDF.js
PDFJS.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

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
  textAlign: "center",
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
  isSubmitting,
}: {
  handleUpload: (images: string[] | undefined) => Promise<void>;
  isSubmitting: boolean;
}) {
  const [images, setImages] = useState<string[]>();
  const [previewUrl, setPreviewUrl] = useState<string>();
  const [processingImages, setProcessingImages] = useState(false);
  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({
      accept: {
        "application/pdf": [".pdf"],
      },
      maxFiles: 1,
      onDrop: async (acceptedFiles) => {
        setProcessingImages(true);
        setPreviewUrl(URL.createObjectURL(acceptedFiles[0]));
        await pdfToImage(setImages, acceptedFiles[0]);
        setProcessingImages(false);
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
  }, [previewUrl]);

  return (
    <div className="flex flex-col gap-6">
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        <p>drop your gojek wrapped file here</p>
        <p className="text-xs mt-2">
          p.s. don&apos;t worry, we don&apos;t store your files
        </p>
      </div>
      {!isSubmitting ? (
        <Button
          className={cn("w-full", processingImages && "opacity-50")}
          disabled={processingImages}
          onClick={async () => {
            await handleUpload(images);
            setPreviewUrl(undefined);
            setImages(undefined);
          }}
        >
          get roasted
        </Button>
      ) : (
        <Button className="w-full" disabled>
          <Loader2 className="animate-spin" />
          crafting your roast
        </Button>
      )}
      {previewUrl !== undefined && (
        <iframe src={previewUrl} className="w-full h-[50vh]" />
      )}
    </div>
  );
}

// Adapted from https://github.com/mozilla/pdf.js/blob/master/examples/node/pdf2png/pdf2png.mjs
const pdfToImage = async (
  setImages: (images: string[]) => void,
  file: File
) => {
  const data = new Uint8Array(await file.arrayBuffer());
  try {
    const pdfDocument = await PDFJS.getDocument({ data }).promise;

    const images: string[] = [];
    for (let i = 0; i < pdfDocument.numPages; i++) {
      const page = await pdfDocument.getPage(i + 1);
      const canvasFactory = pdfDocument.canvasFactory;
      const viewport = page.getViewport({ scale: 1.0 });
      // @ts-ignore
      const canvasAndContext = canvasFactory.create(
        viewport.width,
        viewport.height
      );
      const renderContext = {
        canvasContext: canvasAndContext.context,
        viewport,
      };

      await page.render(renderContext).promise;

      // Convert the canvas to an image buffer.
      const image = canvasAndContext.canvas.toDataURL("image/png");
      images.push(image);

      // Release page resources.
      page.cleanup();
    }
    setImages(images);
  } catch (reason) {
    console.log(reason);
  }
};
