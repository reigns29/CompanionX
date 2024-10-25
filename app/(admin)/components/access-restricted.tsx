"use client";

import React from "react";

const AccessRestrictedComponent = () => {
  return (
    <div className="flex items-center justify-center mt-12">
      <div className="max-w-md w-full bg-gray-800 p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold text-white mb-4">
          Access Restricted
        </h1>
        <p className="text-gray-300">
          You do not have permission to access this section. If you believe this
          is a mistake, please contact the administrator.
        </p>
        <button
          onClick={() => window.history.back()}
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default AccessRestrictedComponent;
