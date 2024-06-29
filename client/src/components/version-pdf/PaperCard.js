import React from 'react';

const PaperCard = ({ paper, onUpdate }) => {
    const { title, scheduledFor, versions } = paper;

    // Format scheduledFor date
    const formattedScheduledFor = new Date(scheduledFor).toLocaleString();

    // Generate download URL if versions exist
    const downloadUrl = versions && versions.length > 0
        ? `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${versions[0].s3Key}`
        : '';

    const handleUpdate = () => {
        // Pass the paper ID to the parent component for updating
        onUpdate(paper._id);
    };

    return (
        <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-2">{title}</h2>
            <p className="text-sm mb-2"><strong>Scheduled For:</strong> {formattedScheduledFor}</p>
            <div className="flex justify-between">
                <button
                    onClick={handleUpdate}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                >
                    Update
                </button>
                {downloadUrl && (
                    <a
                        href={downloadUrl}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
                        download
                    >
                        Download
                    </a>
                )}
            </div>
        </div>
    );
};

export default PaperCard;
