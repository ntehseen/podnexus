import React, { useRef, useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Loader } from "lucide-react";
import { GenerateThumbnailProps } from "@/types";
import { Input } from "./ui/input";
import Image from "next/image";
import { useToast } from "./ui/use-toast";
import { useAction, useMutation } from "convex/react";
import { useUploadFiles } from "@xixixao/uploadstuff/react";
import { api } from "@/convex/_generated/api";
import { v4 as uuidv4 } from "uuid";

const GenerateThumbnail = ({
  setImage,
  setImageStorageId,
  image,
  imagePrompt,
  setImagePrompt,
}: GenerateThumbnailProps) => {
  const [isAiThumbnail, setIsAiThumbnail] = useState(false);
  const [isImageLoading, setImageLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateThumbnail = useAction(api.openai.generateThumbnailAction);

  const generateImage = async () => {
    // Your code for generating an image goes here

    try {
      const response = await handleGenerateThumbnail({ prompt: imagePrompt });
      const blob = new Blob([response], { type: "image/png" });
      handleImage(blob, `thumbnail-${uuidv4()}`);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error generating thumbnail",
        variant: "destructive",
      });
    }
  };

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    try {
      const files = e.target.files;
      if (!files) return;
      const file = files[0];
      const blob = await file.arrayBuffer().then((ab) => new Blob([ab]));

      handleImage(blob, file.name);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error Uploading Image",
        variant: "destructive",
      });
    }
  };

  const imageRef = useRef<HTMLInputElement>(null);

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const { startUpload } = useUploadFiles(generateUploadUrl);
  const getImageUrl = useMutation(api.podcasts.getUrl);

  const handleImage = async (blob: Blob, fileName: string) => {
    setImageLoading(true);
    setImage("");

    try {
      const file = new File([blob], fileName, { type: "image/png" });

      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;

      setImageStorageId(storageId);

      const ImageUrl = await getImageUrl({ storageId });

      setImage(ImageUrl!);
      setImageLoading(false);

      toast({
        title: "Thumbnail Generated Successfully",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error generating thumbnail",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="generate_thumbnail">
        {/* <Button
          type="button"
          variant="plain"
          onClick={() => setIsAiThumbnail(true)}
          className={cn("", { "bg-black-6": isAiThumbnail })}
        >
          Use AI to Generate Thumbnail
        </Button> */}

        <button
          type="button"
          onClick={() => setIsAiThumbnail(true)}
          className={cn("", {
            "inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50":
              isAiThumbnail,
          })}
        >
          Use AI to Generate Thumbnail
        </button>

        {/* <Button
          type="button"
          variant="plain"
          onClick={() => setIsAiThumbnail(false)}
          className={cn("", { "bg-black-6": !isAiThumbnail })}
        >
          Upload Custom Thumbnail
        </Button>  */}

        <button
          type="button"
          onClick={() => setIsAiThumbnail(false)}
          className={cn("", {
            "inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50":
              !isAiThumbnail,
          })}
        >
          Upload Custom Thumbnail
        </button>

      </div>
      {isAiThumbnail ? (
        <div className="flex flex-col gap-5 text-white-1">
          <div className="flex flex-col gap-2.5 mt-5 ">
            <Label className="text-16 font-bold text-white-1">
              AI Prompts to Generate Podcast Thumbnail
            </Label>

            <Textarea
              className="input-class font-light focus-visible:ring-offset-cyan-1"
              placeholder="Write something to Generate Thumbnail..."
              rows={5}
              value={imagePrompt}
              onChange={(e) => setImagePrompt(e.target.value)}
            />
          </div>

          <div className="w-full max-w-[200px]">
            <button
              type="submit"
              onClick={generateImage}
              className="inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 text-16 font-bold"
            >
              {isImageLoading ? (
                <>
                  <Loader size={20} className="animate-spin mr-3" />
                  Generating
                </>
              ) : (
                "Generate Thumbnail"
              )}
            </button>

            
            {/* <Button
              type="submit"
              onClick={generateImage}
              className="text-16 bg-cyan-1 py-4 font-bold text-white-1 transition-all duration-500 hover:bg-slate-800 "
            
            >
              {isImageLoading ? (
                <>
                  <Loader size={20} className="animate-spin mr-3" />
                  Generating
                </>
              ) : (
                "Generate Thumbnail"
              )}
            </Button> */}
          </div>
        </div>
      ) : (
        <div className="image_div" onClick={() => imageRef?.current?.click()}>
          <Input
            type="file"
            className="hidden"
            ref={imageRef}
            onChange={(e) => uploadImage(e)}
          />
          {!isImageLoading ? (
            <Image
              src="/icons/upload-image.svg"
              width={40}
              height={40}
              alt="upload"
            />
          ) : (
            <div className="text-16 flex-center font-medium text-white-1">
              Uploading
              <Loader size={20} className="animate-spin ml-2" />
            </div>
          )}

          <div className="flex flex-col items-center gap-1 text-slate-500">
            <h2 className="text-12 font-semibold text-cyan-1">
              Click to Upload
            </h2>
            <p className="text-12 font-normal text-gray-1">
              SVG, PNG, JPG, JPEG, GIF (Max. 1080x1080px)
            </p>
          </div>
        </div>
      )}

      {image && (
        <div className="flex-center w-full ">
          <Image
            src={image}
            width={200}
            height={200}
            alt="thumbnail"
            className="mt-5"
          />
        </div>
      )}
    </>
  );
};

export default GenerateThumbnail;
