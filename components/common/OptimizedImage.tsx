"use client";

import Image from "next/image";
import { useState } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  quality?: number;
  fallback?: string;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
  sizes?: string;
}

/**
 * OptimizedImage Component
 *
 * A wrapper around Next.js Image component with fallback support and error handling.
 * Automatically handles loading states and provides a default placeholder.
 *
 * @example
 * <OptimizedImage
 *   src="/images/logo/maestros-logo-dark.svg"
 *   alt="Maestros Logo"
 *   width={200}
 *   height={60}
 *   priority
 * />
 */
export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className = "",
  priority = false,
  quality = 90,
  fallback = "/images/placeholder.png",
  objectFit = "cover",
  sizes,
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallback);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  // If fill is true, width and height are not needed
  const imageProps = fill
    ? {
        fill: true,
        sizes: sizes || "100vw",
      }
    : {
        width: width || 0,
        height: height || 0,
      };

  return (
    <div className={`relative ${className}`}>
      {isLoading && !hasError && (
        <div className="absolute inset-0 bg-black-charcoal animate-pulse rounded" />
      )}
      <Image
        {...imageProps}
        src={imgSrc}
        alt={alt}
        className={`transition-opacity duration-300 ${
          isLoading ? "opacity-0" : "opacity-100"
        } ${fill ? "object-cover" : ""}`}
        style={!fill ? { objectFit } : undefined}
        priority={priority}
        quality={quality}
        onError={handleError}
        onLoad={handleLoad}
      />
    </div>
  );
}
