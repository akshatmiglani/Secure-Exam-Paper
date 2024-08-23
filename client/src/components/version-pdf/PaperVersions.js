import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PaperCard from './PaperCard';

const PaperVersions = () => {
    const [papers, setPapers] = useState([]);
    const [error, setError] = useState(null);
    const [paperVersions, setPaperVersions] = useState({}); // State to store paper versions
    const [showPDF, setShowPDF] = useState(null); // State to show PDF in parent component

    useEffect(() => {
        const fetchPapers = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_URL}/api/papers`);
                setPapers(response.data);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to fetch papers');
            }
        };

        fetchPapers();
    }, []);

    const handleShowVersions = async (id) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_URL}/api/papers/${id}/versions`);
            // Store versions in state using paper ID as key
            setPaperVersions({
                ...paperVersions,
                [id]: response.data.versions
            });
        } catch (error) {
            console.error('Error fetching paper versions:', error);
            setError('Failed to fetch paper versions');
        }
    };

    const togglePDFViewer = (url) => {
        setShowPDF(url);
    };

    const handleDownloadPDF = async (url) => {
        try {
            const response = await axios.get(url, {
                responseType: 'blob', // Important: responseType as blob
            });
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'download.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading PDF:', error);
            // Handle error
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
                <PaperCard
                    key={paper._id}
                    paper={paper}
                    onShowVersions={handleShowVersions}
                    onTogglePDFViewer={togglePDFViewer} // Pass down toggle function
                    onDownloadPDF={handleDownloadPDF} // Pass down download function
                />
            ))}
        </div>
    );
};

export default PaperVersions;
