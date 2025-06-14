import React from "react";
import { AnimatePresence, motion } from "framer-motion";

const AnimationWrapper = ({
  children,
  keyValue,
  className,
  // Bắt đầu từ trạng thái ẩn, hơi xoay nhẹ và lùi về sau một chút
  initial = { opacity: 0, rotateY: -10, z: -20 }, // Xoay -10 độ, lùi 20px
  // Khi hiện ra, xoay về vị trí ban đầu và rõ nét
  animate = { opacity: 1, rotateY: 0, z: 0 },
  // Khi thoát, mờ dần, xoay nhẹ về phía ngược lại và lùi về sau
  exit = { opacity: 0, rotateY: 10, z: -20 }, // Xoay 10 độ, lùi 20px
  transition = {
    duration: 0.4, // Rất chậm, tạo cảm giác lật trang một cách tinh tế, không vội vã
    ease: [0.25, 0.46, 0.45, 0.94], // Hàm easing: easeOutCubic - rất mượt mà, tự nhiên
  },
  transformOrigin = "left center", // Quan trọng: làm cho nó lật từ cạnh trái
  transformPerspective = 1200, // Cần thiết cho hiệu ứng 3D và tạo độ sâu
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
          transformOrigin: transformOrigin, // Áp dụng điểm xoay
          transformPerspective: transformPerspective, // Áp dụng phối cảnh 3D
          willChange: "opacity, transform", // Tối ưu hiệu năng
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default AnimationWrapper;
