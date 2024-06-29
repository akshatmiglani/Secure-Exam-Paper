import React, { useState } from 'react';

const PaperCard = ({ paper, onShowVersions }) => {
    const { title } = paper;
    const [showVersions, setShowVersions] = useState(false);

    const handleShowVersions = () => {
        setShowVersions(!showVersions);
        if (!showVersions) {
            onShowVersions(paper._id); // Call parent function to fetch and show versions
        }
    };

    return (
        <div className="bg-white border border-gray-300 rounded-lg p-3 shadow-md w-full">
            <h2 className="text-lg font-bold mb-2">{title}</h2>
            <div className="flex justify-end">
                <button
                    onClick={handleShowVersions}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition duration-300"
                >
                    Show Versions
                </button>
            </div>
            {showVersions && (
                <div className="mt-3">
                    {/* Placeholder for versions dropdown or list */}
                    <p>Dropdown or list to display versions here</p>
                </div>
            )}
        </div>
    );
};

export default PaperCard;
