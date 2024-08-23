import axios from "axios";
import { PDFDocument, degrees, rgb } from "pdf-lib"; // Import degrees
import React, { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const addWatermark = async (file) => {
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onload = async () => {
      try {
        const pdfDoc = await PDFDocument.load(new Uint8Array(reader.result));
        const watermarkText = "Confidential";

        // Define watermark properties
        const fontSize = 40;
        const opacity = 0.3;
        const angle = degrees(-45);
        const color = rgb(0.5, 0.5, 0.5);

        // Iterate over each page
        const pages = pdfDoc.getPages();
        pages.forEach((page) => {
          const { width, height } = page.getSize();
          
          // Add multiple watermarks across the page
          for (let x = -width; x < width * 2; x += 200) {
            for (let y = -height; y < height * 2; y += 150) {
              page.drawText(watermarkText, {
                x,
                y,
                size: fontSize,
                color: color,
                opacity,
                rotate: angle,
              });
            }
          }
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
    toast.success('Paper Uploaded Successfully!!', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    const scheduledFor = new Date(`${scheduledForDate}T${scheduledForTime}`);
    const formData = new FormData();

    setUploading(true);

    try {
      const watermarkedFile = await addWatermark(file);

      formData.append("pdf", watermarkedFile);
      formData.append("title", title);
      formData.append("scheduledFor", scheduledFor.toISOString());

      const response = await axios.post(
        `${process.env.REACT_APP_URL}/api/papers`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);
      setFile(null);
      setTitle("");
      setScheduledForDate("");
      setScheduledForTime("");
      } catch (error) {
      console.error("Error uploading file:", error);
      setUploadError("Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
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
