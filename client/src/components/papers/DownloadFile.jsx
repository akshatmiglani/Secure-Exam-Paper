import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const DownloadFile = () => {
    const { id, versionId } = useParams();
    const [fileUrl, setFileUrl] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFileUrl = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_URL}/api/papers/${id}/version/${versionId}`, {
                    responseType: 'blob' 
                });
                // const blob = new Blob([response.data], { type: 'application/pdf' }); 
                // const url = URL.createObjectURL(blob);
                // setFileUrl(url);
            } catch (err) {
                console.error('Error fetching file:', err);
                setError('Failed to fetch file');
            }
        };

        fetchFileUrl();
    }, [id, versionId]);

    return (
        <div>
            {fileUrl ? (
                <div>
                    <p>Click below to download:</p>
                    <a href={fileUrl} download>
                        Download File
                    </a>
                </div>
            ) : (
                <p>Loading...</p>
            )}
            {error && <p>{error}</p>}
        </div>
    );
};

export default DownloadFile;
