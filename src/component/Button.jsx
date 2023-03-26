import React from "react";
import PropTypes from "prop-types";

const Button = ({ callback, buttonColor, label }) => {
  const colorVariants = {
    blue: "bg-blue-600 hover:bg-blue-800",
    green: "bg-green-600 hover:bg-green-800",
    red: "bg-rose-600 hover:bg-rose-800",
    orange: "bg-orange-600 hover:bg-orange-800",
  };
  return (
    <button
      type="button"
      className={`${colorVariants[buttonColor]} text-white font-medium rounded-lg text-sm px-5 py-2.5 mr-2 focus:outline-none transition-all duration-300`}
      onClick={callback}
    >
      {label}
    </button>
  );
};

Button.propTypes = {
  callback: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  buttonColor: PropTypes.oneOf(["blue", "green", "red", "orange"]),
};

Button.defaultProps = {
  buttonColor: "blue",
};

export default Button;
