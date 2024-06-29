import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PaperCard from './PaperCard';

const PaperVersions = () => {
    const [papers, setPapers] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPapers = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/papers');
                setPapers(response.data);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to fetch papers');
            }
        };

        fetchPapers();
    }, []);

    const handleUpdatePaper = async (id) => {
        try {
            // Replace with your update logic using the provided API
            const response = await axios.put(`http://localhost:4000/api/papers/${id}`, {
                title: 'Updated Title', // Example updated title
                scheduledFor: new Date().toISOString() // Example updated scheduledFor
            });
            console.log('Updated paper:', response.data);
            // Optionally update state or perform other actions upon successful update
        } catch (error) {
            console.error('Error updating paper:', error);
            setError('Failed to update paper');
        }
    };

    if (error) {
        return <div className="text-red-500 text-center mt-4">{error}</div>;
    }

    if (papers.length === 0) {
        return <div className="text-center mt-4">Loading...</div>;
    }

    return (
        <div className="flex flex-col items-center mt-4 space-y-4">
            {papers.map((paper) => (
                <PaperCard key={paper._id} paper={paper} onUpdate={handleUpdatePaper} />
            ))}
        </div>
    );
};

export default PaperVersions;
