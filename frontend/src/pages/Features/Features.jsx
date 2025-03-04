import Card from "../../components/featurecard/Card";

const Features = () => {
  return (
    <div className="flex flex-wrap justify-center gap-6 mt-6">
      <Card
        image="https://res.cloudinary.com/dgeshbpps/image/upload/v1740853188/v9sevu2kgyn6wxnaa9hq.jpg"
        title="Authentication"
        description="Regular authentication and Google authentication."
        
        details={[
          "USED:-",
          "Bycrpt",
          "Passport.js",
          "Stored the user data in MongoDB using Mongoose"

        ]}
      />

      <Card
        image="https://res.cloudinary.com/dgeshbpps/image/upload/v1740853188/lulukjexjpsacczo2hzl.jpg"
        title="Add Friend"
        description="User can send,accept and can see friend requests."
        
        details={[
          "Used Socket.io for real time requests"
        ]}
      />
       <Card
        image="https://res.cloudinary.com/dgeshbpps/image/upload/v1740853188/fp2ktabaushgo14ui8pc.jpg"
        title="Collabaration"
        description=""
        
        details={[
          ""
        ]}
      />
         <Card
        image="https://res.cloudinary.com/dgeshbpps/image/upload/v1740853188/v4dkhaax5ot2wdghodrc.jpg"
        title="Ask AI"
        description=""
        
        details={[
          ""
        ]}
      />
         <Card
        image="https://res.cloudinary.com/dgeshbpps/image/upload/v1740853188/f9ta6eoswl6yqtrhuvkc.jpg"
        title="Message"
        description=""
        
        details={[
          ""
        ]}
      />
       
    </div>
  );
};

export default Features;
