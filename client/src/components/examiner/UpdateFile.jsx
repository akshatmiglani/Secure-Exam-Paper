import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const UpdateFile = ({ paper }) => {
  const { id } = useParams();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState(paper ? paper.title : "");
  const [scheduledForDate, setScheduledForDate] = useState(paper ? new Date(paper.scheduledFor).toISOString().split("T")[0] : "");
  const [scheduledForTime, setScheduledForTime] = useState(paper ? new Date(paper.scheduledFor).toTimeString().split(" ")[0] : "");
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
    setTitle(uploadedFile.name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const scheduledFor = new Date(`${scheduledForDate}T${scheduledForTime}`);
    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("title", title);
    formData.append("scheduledFor", scheduledFor.toISOString());

    setUpdating(true);
    setUpdateError(null); // Clear previous error

    try {
      const response = await axios.put(
        `http://localhost:4000/api/papers/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("File updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating file:", error);
      setUpdateError("Failed to update file");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <h1 className="text-2xl font-bold mb-6 text-center p-4 bg-green-700 text-white">
        Update File
      </h1>
      <form className="p-4" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Title</label>
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
          <label className="block text-gray-700 mb-2">Date</label>
          <input
            type="date"
            value={scheduledForDate}
            onChange={(e) => setScheduledForDate(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Time</label>
          <input
            type="time"
            value={scheduledForTime}
            onChange={(e) => setScheduledForTime(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">File</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="mt-1 p-2 w-full border rounded-md"
            required
          />
        </div>
        <button
          type="submit"
          disabled={updating}
          className={`w-full py-2 px-4 text-white rounded-md ${
            updating
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-green-700 hover:bg-green-900"
          }`}
        >
          {updating ? "Updating..." : "Update"}
        </button>
        {updateError && (
          <p className="mt-4 text-red-500 text-center">{updateError}</p>
        )}
      </form>
    </div>
  );
};

export default UpdateFile;
