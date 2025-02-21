"use client";
import { useCallback, Dispatch, SetStateAction } from "react";
import { generateClientDropzoneAccept } from "uploadthing/client";
import { Button } from "@/components/ui/button";
import { convertFileToUrl } from "@/lib/utils";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { ImageUp, X } from "lucide-react";
import { useDropzone } from "@uploadthing/react";

type FileUploaderProps = {
  onFieldChange: (url: string) => void;
  imageUrl: string;
  setFiles: Dispatch<SetStateAction<File[]>>;
  disabled?: boolean;
  placeHolder?: React.ReactNode;
  max_file_size_mb?: number;
};

export function File_uploader({
  imageUrl,
  onFieldChange,
  setFiles,
  disabled = false,
  placeHolder,
  max_file_size_mb = 2,
}: FileUploaderProps) {
  const { toast } = useToast();
  const MAX_FILE_SIZE_BYTES = max_file_size_mb * 1024 * 1024;

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const selectedFile = acceptedFiles[0];

        if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
          toast({
            title: "File too large",
            description: `The selected file is too large. Maximum size allowed is ${max_file_size_mb}MB.`,
            variant: "destructive",
          });
          return;
        }

        setFiles([selectedFile]);
        onFieldChange(convertFileToUrl(selectedFile));
      }
    },
    [onFieldChange, setFiles, toast, MAX_FILE_SIZE_BYTES, max_file_size_mb]
  );

  const handleDeselectImage = () => {
    if (disabled) return;
    setFiles([]);
    onFieldChange("");
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(["image/*"]),
    disabled,
  });

  return (
    <div
      {...getRootProps()}
      className={`flex border w-full aspect-video justify-center overflow-hidden rounded-xl relative cursor-pointer bg-background ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      <input {...getInputProps()} disabled={disabled} />

      {imageUrl ? (
        <div className="flex items-center w-full aspect-video overflow-hidden relative object-cover">
          <Image
            src={imageUrl}
            alt="image"
            width={250}
            height={250}
            quality={70}
            className="w-full"
          />
          {!disabled && ( // Only show the button if not disabled
            <Button
              variant="secondary"
              className="absolute top-3 right-3 rounded-full w-16 h-16 p-0 hover:bg-background"
              onClick={(e) => {
                e.stopPropagation();
                handleDeselectImage();
              }}
            >
              <X className="w-8 h-8 opacity-80" />
            </Button>
          )}
        </div>
      ) : (
        <>
          {placeHolder ? (
            placeHolder
          ) : (
            <div className="flex flex-col justify-center items-center gap-2 p-4">
              <ImageUp className="w-16 h-16 text-muted-foreground" />
              <p className="text-sm text-primary">
                Drag and drop an image here or
              </p>
              <p className="text-sm text-muted-foreground">Or</p>
              <Button
                type="button"
                variant={"outline"}
                className="rounded-full"
                disabled={disabled}
              >
                Select from device
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
