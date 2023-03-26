import React from "react";
import PropTypes from "prop-types";

const ImageDetails = ({ uploadedImage }) => {
  const { name, originalSize, afterCropSize, size } = uploadedImage;
  return (
    <div className="mt-4">
      <ul className="text-slate-700">
        <li className="mb-4">
          <b>File Name:</b> {name}
        </li>
        <li className="mb-4">
          <b>Original File Size:</b> {originalSize}
        </li>
        {afterCropSize && (
          <li className="mb-4">
            <b>After Crop File Size:</b> {afterCropSize}
          </li>
        )}
        {size && (
          <li className="mb-4">
            <b>Compressed File Size:</b> {size}
          </li>
        )}
      </ul>
    </div>
  );
};

ImageDetails.propTypes = {
  uploadedImage: PropTypes.object.isRequired,
};

export default ImageDetails;
