import React from "react";

const SkeletonLoader = ({ width = "100%", height = "20px", borderRadius = "4px" }) => {
  return (
    <div
      className="bg-gray-300 animate-pulse"
      style={{
        width: width,
        height: height,
        borderRadius: borderRadius,
      }}
    ></div>
  );
};

export default SkeletonLoader;
