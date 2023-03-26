import React from "react";
import PropTypes from "prop-types";

const PreviewImage = ({ previewImage }) => {
  return (
    <div className="p-4 bg-white rounded-md mt-4">
      <img src={previewImage} className="w-auto" />
    </div>
  );
};

PreviewImage.propTypes = {
  previewImage: PropTypes.string.isRequired,
};

export default PreviewImage;
