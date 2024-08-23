import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const UpdateFile = () => {
    const { id } = useParams(); 
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [scheduledForDate, setScheduledForDate] = useState('');
    const [scheduledForTime, setScheduledForTime] = useState('');
    const [updating, setUpdating] = useState(false);
    const [updateError, setUpdateError] = useState(null);

    useEffect(() => {
        const fetchFileDetails = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_URL}/api/papers/${id}`);
                const { title, scheduledFor } = response.data; // Adjust as per your API response structure
                setTitle(title);
                const scheduledDate = new Date(scheduledFor);
                setScheduledForDate(scheduledDate.toISOString().split('T')[0]);
                setScheduledForTime(scheduledDate.toTimeString().split(' ')[0]);
            } catch (error) {
                console.error('Error fetching file details:', error);
            }
        };

        fetchFileDetails();
    }, [id]);

    const handleFileChange = (e) => {
        const uploadedFile = e.target.files[0];
        setFile(uploadedFile);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const scheduledFor = new Date(`${scheduledForDate}T${scheduledForTime}`);
        const formData = new FormData();
        formData.append('pdf', file);
        formData.append('title', title);
        formData.append('scheduledFor', scheduledFor.toISOString());

        setUpdating(true);
        setUpdateError(null); // Clear previous error

        try {
            const response = await axios.put(`${process.env.REACT_APP_URL}/api/papers/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('File updated successfully:', response.data);
        } catch (error) {
            console.error('Error updating file:', error);
            setUpdateError('Failed to update file');
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div>
            <h1>Update File</h1>
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
                <input type="file" onChange={handleFileChange} />
                <button type="submit" disabled={updating}>
                    {updating ? 'Updating...' : 'Update'}
                </button>
                {updateError && <p>{updateError}</p>}
            </form>
        </div>
    );
};

export default UpdateFile;
