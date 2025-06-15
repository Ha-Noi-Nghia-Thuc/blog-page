import { AnimatePresence, motion } from "framer-motion";

const AnimationWrapper = ({
  children,
  keyValue,
  className = "",
  initial = { opacity: 0, rotateY: -10, z: -20 },
  animate = { opacity: 1, rotateY: 0, z: 0 },
  exit = { opacity: 0, rotateY: 10, z: -20 },
  transition = {
    duration: 0.4,
    ease: [0.25, 0.46, 0.45, 0.94],
  },
  transformOrigin = "left center",
  transformPerspective = 1200,
}) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={keyValue}
        initial={initial}
        animate={animate}
        exit={exit}
        transition={transition}
        className={className}
        style={{
          transformOrigin,
          transformPerspective,
          willChange: "opacity, transform",
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default AnimationWrapper;
