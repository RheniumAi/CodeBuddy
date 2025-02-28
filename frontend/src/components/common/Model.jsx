import React from "react";
import { motion } from "framer-motion";
import { FiX } from "react-icons/fi";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-gray-900 p-6 rounded-lg shadow-lg max-w-md w-full"
      >
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-200">
          <FiX size={20} />
        </button>
        {children}
      </motion.div>
    </div>
  );
};

export default Modal;
