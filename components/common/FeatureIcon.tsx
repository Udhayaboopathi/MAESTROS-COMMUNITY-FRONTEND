"use client";

import OptimizedImage from "./OptimizedImage";

interface FeatureIconProps {
  icon: string;
  alt: string;
  size?: number;
  className?: string;
  variant?: "gold" | "cyber" | "purple" | "cyan";
}

const variantStyles = {
  gold: "text-gold hover:text-gold-light",
  cyber: "text-cyber-blue hover:text-neon-cyan",
  purple: "text-electric-purple hover:text-purple-400",
  cyan: "text-neon-cyan hover:text-cyan-300",
};

const variantGlows = {
  gold: "hover:drop-shadow-[0_0_15px_rgba(230,179,37,0.5)]",
  cyber: "hover:drop-shadow-[0_0_15px_rgba(0,212,255,0.5)]",
  purple: "hover:drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]",
  cyan: "hover:drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]",
};

/**
 * FeatureIcon Component
 *
 * Displays SVG icons from the features directory with consistent styling.
 * Supports color variants and hover effects.
 *
 * @example
 * <FeatureIcon
 *   icon="server"
 *   alt="Server hosting"
 *   variant="cyber"
 *   size={64}
 * />
 */
export default function FeatureIcon({
  icon,
  alt,
  size = 64,
  className = "",
  variant = "gold",
}: FeatureIconProps) {
  const iconPath = icon.endsWith(".svg")
    ? `/images/icons/features/${icon}`
    : `/images/icons/features/${icon}.svg`;

  return (
    <div
      className={`transition-all duration-300 ${variantStyles[variant]} ${variantGlows[variant]} ${className}`}
      style={{ width: size, height: size }}
    >
      <OptimizedImage
        src={iconPath}
        alt={alt}
        width={size}
        height={size}
        className="w-full h-full"
        fallback="/images/icons/features/default.svg"
      />
    </div>
  );
}
