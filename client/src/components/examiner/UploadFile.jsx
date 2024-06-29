import axios from "axios";
import React, { useState } from "react";

function UploadFile() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [scheduledForDate, setScheduledForDate] = useState("");
  const [scheduledForTime, setScheduledForTime] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
    setTitle(uploadedFile.name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // console.log(file);
    // console.log(title);

    const scheduledFor = new Date(`${scheduledForDate}T${scheduledForTime}`);
    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("title", title);
    formData.append("scheduledFor", scheduledFor.toISOString());

    // Use get method to retrieve values from FormData
    console.log(formData.get("pdf"));
    console.log(formData.get("title"));
    console.log(formData.get("scheduledFor"));

    setUploading(true);
    try {
      const response = await axios.post(
        "http://localhost:4000/api/papers",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadError("Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-8 mt-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Upload a Paper</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="mt-1 p-2 w-full border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Date</label>
          <input
            type="date"
            value={scheduledForDate}
            onChange={(e) => setScheduledForDate(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Time</label>
          <input
            type="time"
            value={scheduledForTime}
            onChange={(e) => setScheduledForTime(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">File</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="mt-1 p-2 w-full border rounded-md"
            required
          />
        </div>
        <button
          type="submit"
          disabled={uploading}
          className={`w-full py-2 px-4 text-white rounded-md ${
            uploading ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-700"
          }`}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
        {uploadError && (
          <p className="mt-4 text-red-500 text-center">{uploadError}</p>
        )}
      </form>
    </div>
  );
}

export default UploadFile;
