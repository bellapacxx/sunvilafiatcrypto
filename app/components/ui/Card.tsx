"use client";

import { FC, ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
  shadow?: boolean;
  hoverEffect?: boolean;
  neon?: boolean; // optional futuristic accent
};

const Card: FC<CardProps> = ({
  children,
  className = "",
  shadow = true,
  hoverEffect = true,
  neon = false,
}) => {
  return (
    <div
      className={`
        bg-white/10 dark:bg-gray-900/40
        backdrop-blur-md
        border border-gray-700/30
        rounded-2xl
        p-5 sm:p-6
        ${shadow ? "shadow-lg dark:shadow-xl" : ""}
        ${hoverEffect ? "hover:shadow-2xl hover:scale-[1.02] transition-all duration-300" : ""}
        ${neon ? "border-purple-400/50 hover:border-purple-400/80" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
