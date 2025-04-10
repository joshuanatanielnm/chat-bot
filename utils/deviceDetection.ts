/**
 * Utility functions for device detection
 */

import { useState, useEffect } from "react";

/**
 * Checks if the current device is a mobile device
 * This uses a combination of screen width and user agent detection
 *
 * @returns {boolean} true if the device is mobile, false otherwise
 */
export const isMobileDevice = (): boolean => {
  if (typeof window === "undefined") {
    return false; // Return false during server-side rendering
  }

  // Check screen width - common threshold for mobile devices
  const isMobileWidth = window.innerWidth <= 768;

  // Check user agent string for mobile devices
  const userAgent = navigator.userAgent;
  const isMobileUserAgent =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      userAgent
    );

  return isMobileWidth || isMobileUserAgent;
};

/**
 * Hook to get the current mobile status and update on window resize
 * For components that need to react to mobile status changes
 */
export const useMobileDetection = (): boolean => {
  // Default state value - will be updated on client side after mount
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Only run on client-side
    if (typeof window !== "undefined") {
      // Set initial value
      setIsMobile(isMobileDevice());

      const handleResize = () => {
        setIsMobile(isMobileDevice());
      };

      // Add event listener for window resize
      window.addEventListener("resize", handleResize);

      // Clean up event listener on component unmount
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  return isMobile;
};
