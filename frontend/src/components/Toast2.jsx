import React, {useEffect} from "react";
import {motion} from "framer-motion";

const Toast = ({message, onClose, isSuccess = true}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); // Hide after 5 seconds
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return isSuccess ? (
    <motion.div
      initial={{y: -50, opacity: 0}}
      animate={{y: 0, opacity: 1}}
      exit={{y: -50, opacity: 0}}
      className="toast-message"
    >
      {message}
    </motion.div>
  ) : (
    <motion.div
      initial={{y: -50, opacity: 0}}
      animate={{y: 0, opacity: 1}}
      exit={{y: -50, opacity: 0}}
      className="toast-message2"
    >
      {message}
    </motion.div>
  );
};

export default Toast;
