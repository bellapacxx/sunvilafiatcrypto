"use client";

import { FC, ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "accent" | "ghost";
};

const variantClasses = {
  primary: "bg-secondary text-white hover:bg-secondary/80",
  secondary: "bg-primary text-white hover:bg-primary/80",
  accent: "bg-accent text-white hover:bg-accent/80",
  ghost: "bg-transparent text-primary hover:text-accent",
};

const Button: FC<ButtonProps> = ({ variant = "primary", className = "", ...props }) => {
  return (
    <button
      className={`px-5 py-2 rounded-lg font-medium transition ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
};

export default Button;
