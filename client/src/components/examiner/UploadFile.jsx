import axios from "axios";
import { PDFDocument, degrees, rgb } from "pdf-lib"; // Import degrees
import React, { useState } from "react";

const addWatermark = async (file) => {
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onload = async () => {
      try {
        const pdfDoc = await PDFDocument.load(new Uint8Array(reader.result));
        const watermarkText = "Confidential";

        // Iterate over each page
        const pages = pdfDoc.getPages();
        pages.forEach((page) => {
          const { width, height } = page.getSize();
          page.drawText(watermarkText, {
            x: width / 2 - 50,
            y: height / 2,
            size: 50,
            color: rgb(0.95, 0.1, 0.1),
            opacity: 0.5,
            rotate: degrees(-45), // Use degrees for rotation
          });
        });

        const pdfBytes = await pdfDoc.save();
        const watermarkedFile = new File([pdfBytes], file.name, {
          type: file.type,
        });
        resolve(watermarkedFile);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

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

    const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
    const scheduledFor = new Date(`${scheduledForDate}T${scheduledForTime}`);
    const formData = new FormData();

    setUploading(true);

    try {
      const watermarkedFile = await addWatermark(file);

      formData.append("pdf", watermarkedFile);
      formData.append("title", title);
      formData.append("scheduledFor", scheduledFor.toISOString());

      const response = await axios.post(
        "http://localhost:4000/api/papers",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
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
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <h1 className="text-2xl font-bold mb-6 text-center p-4 bg-blue-500 text-white">
        Upload a Paper
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
          disabled={uploading}
          className={`w-full py-2 px-4 text-white rounded-md ${
            uploading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-700"
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
