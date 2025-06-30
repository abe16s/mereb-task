"use client";

import React, { useState } from "react";
import axios from "axios";
import { UploadResponse } from "../types";

const FileUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
      setDownloadUrl(null);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      console.log("Uploading file:", file.name);
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
      const response = await axios.post<UploadResponse>(
        `${backendUrl}/upload`,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percent = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setProgress(percent);
            }
          },
        }
      );

      if (response.data.success) {
        setDownloadUrl(response.data.downloadUrl);
      } else {
        setError(response.data.message || "Upload failed");
      }
    } catch (err) {
      setError(
        "Error uploading file: " +
          (err instanceof Error ? err.message : String(err))
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg border border-gray-100 transform transition-all hover:shadow-xl">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 text-center tracking-tight">
        Sales Data Uploader
      </h2>
      <div className="relative mb-4">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-600 file:font-semibold file:cursor-pointer hover:file:bg-indigo-100 transition duration-200"
        />
      </div>
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-indigo-700 transition duration-200 transform hover:-translate-y-0.5"
      >
        {uploading ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin h-5 w-5 mr-2 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8h8a8 8 0 11-16 0z"
              ></path>
            </svg>
            Uploading...
          </span>
        ) : (
          "Upload CSV"
        )}
      </button>
      {uploading && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-indigo-500 h-2.5 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2 text-center font-medium">
            {progress}% Complete
          </p>
        </div>
      )}
      {error && (
        <p className="text-red-500 text-sm mt-3 text-center font-medium bg-red-50 py-2 rounded-lg">
          {error}
        </p>
      )}
      {downloadUrl && (
        <a
          href={`${
            process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"
          }${downloadUrl}`}
          download
          className="mt-4 inline-block w-full text-center bg-green-600 text-white py-2.5 rounded-lg font-semibold hover:bg-green-700 transition duration-200 transform hover:-translate-y-0.5"
        >
          Download Results
        </a>
      )}
    </div>
  );
};

export default FileUploader;
