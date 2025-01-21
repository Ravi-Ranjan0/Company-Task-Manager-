// components/ErrorBoundary.js
import React from "react";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";

const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div>
      <h1 className="text-2xl font-bold text-gray-800">
        Something went wrong. Please try again later.
      </h1>
      <p className="text-red-600 mt-2">{error.message}</p>
      <button
        onClick={resetErrorBoundary}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Try Again
      </button>
    </div>
  </div>
);

const ErrorBoundary = ({ children }) => (
  <ReactErrorBoundary
    FallbackComponent={ErrorFallback}
    onError={(error, errorInfo) => {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }}
  >
    {children}
  </ReactErrorBoundary>
);

export default ErrorBoundary;
