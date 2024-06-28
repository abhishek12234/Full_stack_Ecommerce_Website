import React, { useEffect, useState } from 'react';
import "../components/css/ImageConverter.css";

const ImageConverter = ({ imageData }) => {
  const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
    const convertToDataUrl = async () => {
      if (imageData) {
        // Remove "\\x" prefix
        const cleanedHexData = imageData.replace(/\\x/g, '');

        // Convert hexadecimal string to ArrayBuffer
        const arrayBuffer = new Uint8Array(
          cleanedHexData.match(/.{1,2}/g).map(byte => parseInt(byte, 16))
        ).buffer;

        // Convert ArrayBuffer to Blob
        const blob = new Blob([arrayBuffer], { type: 'image/png' }); // Change the type based on your image format

        // Create data URL from Blob
        const dataUrl = URL.createObjectURL(blob);
        setImageSrc(dataUrl);
      }
    };

    convertToDataUrl();

    return () => {
      if (imageSrc) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [imageData]);

  // Return the imageSrc
  return imageSrc;
};

export default ImageConverter;
