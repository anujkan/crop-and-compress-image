import React, { useRef, useState } from "react";
import imageCompression from "browser-image-compression";
import ReactCrop from "react-image-crop";
import "react-image-crop/src/ReactCrop.scss";
import { canvasPreview } from "../utils/createCanvas";
import { centerAspectCrop } from "../utils/cropAspectDefault";
import UploadFileInput from "../component/UploadFileInput";
import PreviewImage from "../component/PreviewImage";
import LoadingState from "../component/LoadingState";
import ImageDetails from "../component/ImageDetails";
import Button from "../component/Button";

const UploadImage = () => {
  const [uploadedImage, setUploadedImage] = useState({});
  const imageRef = useRef(null);
  const [crop, setCrop] = useState({});
  const [aspect, setAspect] = useState(16 / 9);
  const [completedCrop, setCompletedCrop] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // UploadFileInput onClick event
  // Handling Image upload and updating image data in setUploadedImage state
  // KEY src is used to display image in Image crop section
  // setLoading set to true initially and false after states updated
  const handleImageUpload = async (e) => {
    setIsLoading(true);
    const imageFile = e.target.files[0];
    setUploadedImage({
      name: imageFile.name,
      src: URL.createObjectURL(imageFile),
      originalSize: `${imageFile.size / 1024 / 1024} mb`,
      type: imageFile.type,
    });
    setIsLoading(false);
  };

  // Called when Image Loaded in crop section
  // Setting states so that initial crop section appears in the middle of the section
  // Utility function: centerAspectCrop used so that crop section appears in the middle
  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    setCompletedCrop(centerAspectCrop(width, height, aspect));
    setCrop(centerAspectCrop(width, height, aspect));
  };

  // Helper function to Compress and convert image into base64
  // updated states: setPreviewImage with base64 and setUploadedImage as a final payload
  const compressImage = async (img) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(img, options);
      const base64Image = await imageCompression.getDataUrlFromFile(
        compressedFile
      );
      setPreviewImage(base64Image);
      setUploadedImage((prev) => ({
        ...prev,
        size: `${compressedFile.size / 1024 / 1024} mb`,
        base64: base64Image,
      }));
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  // Called on "Crop and Save" button onClick event
  // setLoading set to true initially and false after states updated
  // Creates a Canvas and using helper function "canvasPreview" to create cropped image
  // Calling compressImage function to compress the cropped image and then converting it to base64
  const handleImageCrop = async () => {
    setIsLoading(true);
    const canvas = document.createElement("canvas");
    canvasPreview(imageRef.current, canvas, completedCrop);

    let blob = await new Promise(
      (resolve) => canvas.toBlob(resolve, uploadedImage.type) // Setting original file type. Eg: image/jpeg, image/png, etc.
    );
    compressImage(blob); // Compressing Cropped Image

    // Just for demo. Otherwise Not required. Can be removed
    setUploadedImage((prev) => ({
      ...prev,
      afterCropSize: `${blob.size / 1024 / 1024} mb`,
    }));
  };

  // Toggle Aspect ratio of the crop section
  const handleAspectRatio = () => {
    if (aspect) {
      setAspect(null);
    } else {
      setAspect(16 / 9);
    }
  };

  return (
    <>
      <UploadFileInput handleImageUpload={handleImageUpload} />
      {uploadedImage.name && (
        <div className="w-full bg-white p-6 mt-4 rounded-md">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={aspect}
            ruleOfThirds={true}
            keepSelection={true}
          >
            <img
              ref={imageRef}
              src={uploadedImage.src}
              alt={uploadedImage.name}
              className="h-auto max-w-full"
              onLoad={onImageLoad}
            />
          </ReactCrop>
          <div className="flex items-center justify-center p-6">
            <Button callback={handleImageCrop} label={"Crop and Save Image"} />
            <Button
              callback={handleAspectRatio}
              buttonColor={"green"}
              label={"Disable Aspect Ratio"}
            />
          </div>
          <ImageDetails uploadedImage={uploadedImage} />
        </div>
      )}

      {isLoading && <LoadingState />}

      {previewImage && !isLoading && (
        <PreviewImage previewImage={previewImage} />
      )}
      {uploadedImage.name && (
        <pre className="w-full bg-white p-6 mt-4 rounded-md overflow-hidden">
          <h1 className="text-slate-500 text-2xl mb-4 font-semibold border-b pb-4">
            Payload
          </h1>
          <code className="text-slate-600">
            {JSON.stringify(uploadedImage, undefined, 2)}
          </code>
        </pre>
      )}
    </>
  );
};

export default UploadImage;
