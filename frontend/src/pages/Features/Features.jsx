import React from "react";
import FeatureCard from "../../components/featurecard/Card"; 

import askaivideo from "../../assets/AskAI.mp4";
import collabvideo from "../../assets/Collaborate.mp4";
import Ai from "../../assets/Ai.json";
import Collab from "../../assets/Collab.json";
import Secure from "../../assets/Secure.json";

const Features = () => {
  return (
    <div className="bg-[#f3f4f6] min-h-screen p-8">
      <div className="mb-8">
        <p className="text-left text-[#1d4ed8] font-medium">Version- 1.0.0</p>
        <h1 className="text-center text-3xl font-bold text-[#1d4ed8]">Features</h1>
      </div>
      
      <div className="flex flex-wrap justify-center items-start">
        <FeatureCard
          title="Ask AI"
          description="Interact with our intelligent AI to get insights and solutions."
          animationData={Ai}
          demoVideo={askaivideo}
        />
        <FeatureCard
          title="Collaborate"
          description="Invite friends to join a room or enter a room ID to collaborate together."
          animationData={Collab}
          demoVideo={collabvideo}
        />
        <FeatureCard
          title="Secure"
          description="Secure your account with industry-standard practices—bcrypt, JWT, and OAuth."
          animationData={Secure}
        />
        <div className="card card-side bg-[#ffffff] shadow-sm m-4 max-w-md">
          <div className="card-body">
            <h2 className="card-title text-[#1d4ed8]">More Features Coming Soon</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
