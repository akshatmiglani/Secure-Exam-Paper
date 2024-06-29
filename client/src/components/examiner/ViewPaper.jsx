import axios from "axios";
import React, { useEffect, useState } from "react";

const ViewPaper = ({ endpoint }) => {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/papers/`);
        setPapers(response.data);
      } catch (error) {
        console.error(`Error fetching ${endpoint} papers:`, error);
        setError(`Failed to fetch ${endpoint} papers`);
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();
  }, [endpoint]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-md rounded my-8">
      <h1 className="text-2xl font-bold bg-blue-500 text-white p-4">
        {endpoint === "latest"
          ? "Latest Papers List"
          : "All Versions Papers List"}
      </h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Title</th>
              <th className="py-3 px-6 text-left">Scheduled For</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {papers.map((paper) => (
              <tr
                key={paper._id}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {paper.title}
                </td>
                <td className="py-3 px-6 text-left">
                  {new Date(paper.scheduledFor).toLocaleString()}
                </td>
                <td className="py-3 px-6 text-center">
                  <a
                    href={paper.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-500 text-white rounded py-1 px-4 hover:bg-blue-700"
                  >
                    Download
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewPaper;
