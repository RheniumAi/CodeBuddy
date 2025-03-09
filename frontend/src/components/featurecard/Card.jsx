import React, { useState } from "react";
import Lottie from "lottie-react";

const FeatureCard = ({ title, description, animationData, demoVideo, buttonText = "Watch Demo" }) => {
  const [showModal, setShowModal] = useState(false);
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <>
      <div className="card card-side bg-[#ffffff] shadow-sm m-4 max-w-md">
        <figure className="p-4">
          <div style={{ width: 750, height: 250 }}>
            <Lottie animationData={animationData} loop style={{ width: "100%", height: "100%" }} />
          </div>
        </figure>
        <div className="card-body">
          <h2 className="card-title text-[#1d4ed8]">{title}</h2>
          <p className="text-[#1d4ed8]">{description}</p>
          {demoVideo && (
            <div className="card-actions justify-end">
              <button onClick={openModal} className="btn btn-primary">
                {buttonText}
              </button>
            </div>
          )}
        </div>
      </div>

      {demoVideo && showModal && (
        <div className="modal modal-open">
          <div className="modal-box relative w-3/5 max-w-5xl">
            <button onClick={closeModal} className="btn btn-sm btn-circle absolute right-2 top-2">
              ✕
            </button>
            <video src={demoVideo} controls autoPlay className="w-full rounded-lg" />
          </div>
        </div>
      )}
    </>
  );
};

export default FeatureCard;
