import React from 'react';

export const HospitalIcon = ({ className = "h-6 w-6" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2L2 7v10h20V7L12 2zm0 2.5l7.5 3.5V17h-15V7.5L12 4.5zM9 10h2v4H9v-4zm4 0h2v4h-2v-4z"/>
  </svg>
);

export const LoadingSpinner = ({ size = "h-8 w-8" }) => (
  <div className="flex justify-center items-center">
    <div className={`${size} animate-spin rounded-full border-4 border-solid border-current border-r-transparent`}></div>
  </div>
);