import { useState } from "react";
import { motion } from "framer-motion";

const Card = ({ image, title, description, details }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleFlip = () => {
    if (!isAnimating) {
      setIsFlipped(!isFlipped);
      setIsAnimating(true);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <motion.div
        className="w-80 h-80 perspective-1000 cursor-pointer"
        onClick={handleFlip}
        onHoverStart={() => !isFlipped && setIsFlipped(true)}
        onHoverEnd={() => isFlipped && setIsFlipped(false)}
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, animationTimingFunction: "ease-in-out" }}
        onAnimationComplete={() => setIsAnimating(false)}
        style={{ transformStyle: "preserve-3d" }}
        role="button"
        aria-pressed={isFlipped}
        tabIndex="0"
      >
        {/* Front Side */}
        <motion.div
          className="absolute w-full h-full backface-hidden bg-base-100 shadow-lg rounded-lg overflow-hidden"
          style={{ transform: "rotateY(0deg)", zIndex: isFlipped ? 0 : 1 }}
        >
          <figure className="h-3/5 w-full flex justify-center items-center p-4">
            <motion.img
              src={image}
              alt={title}
              className="w-full h-full object-contain"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4 }}
            />
          </figure>
          <div className="card-body h-2/5 p-4">
            <h2 className="card-title text-lg font-bold mb-2">{title}</h2>
            <p className="text-sm text-gray-600 line-clamp-3">{description}</p>
          </div>
        </motion.div>

        {/* Back Side */}
        <motion.div
          className="absolute w-full h-full backface-hidden bg-gray-100 p-6 rounded-lg shadow-lg"
          style={{
            transform: "rotateY(180deg)",
            zIndex: isFlipped ? 1 : 0,
          }}
        >
          <div className="flex flex-col h-full">
            <h2 className="text-lg font-bold mb-4">{title} - Details</h2>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 flex-1 overflow-y-auto">
              {details.map((point, index) => (
                <li key={index} className="leading-tight">
                  {point}
                </li>
              ))}
            </ul>
            <div className="mt-4 text-xs text-gray-500 text-center">
              Click to flip back
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Card;