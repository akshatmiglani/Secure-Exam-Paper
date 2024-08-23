import React, { useState } from 'react';
import axios from 'axios';

function UploadFile() {
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [scheduledForDate, setScheduledForDate] = useState('');
    const [scheduledForTime, setScheduledForTime] = useState('');
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);

    const handleFileChange = (e) => {
        const uploadedFile = e.target.files[0];
        setFile(uploadedFile);
        setTitle(uploadedFile.name); 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const scheduledFor = new Date(`${scheduledForDate}T${scheduledForTime}`);
        const formData = new FormData();
        formData.append('pdf', file);
        formData.append('title', title); 
        formData.append('scheduledFor', scheduledFor.toISOString());

        setUploading(true);
        try {
            const response = await axios.post(`${process.env.REACT_APP_URL}/api/papers`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(response.data);
        } catch (error) {
            console.error('Error uploading file:', error);
            setUploadError('Failed to upload file');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <h1>Upload a Paper</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                    required
                />
                <div>
                    <label>Date:</label>
                    <input
                        type="date"
                        value={scheduledForDate}
                        onChange={(e) => setScheduledForDate(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Time:</label>
                    <input
                        type="time"
                        value={scheduledForTime}
                        onChange={(e) => setScheduledForTime(e.target.value)}
                        required
                    />
                </div>
                <input type="file" onChange={handleFileChange} required />
                <button type="submit" disabled={uploading}>
                    {uploading ? 'Uploading...' : 'Upload'}
                </button>
                {uploadError && <p>{uploadError}</p>}
            </form>
        </div>
    );
}

export default UploadFile;
