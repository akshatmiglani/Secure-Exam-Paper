import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PapersList = ({ endpoint }) => {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_URL}/api/papers/`); 
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
    <div>
      <h1>{endpoint === 'latest' ? 'Latest Papers List' : 'All Versions Papers List'}</h1>
      <ul>
        {papers.map((paper) => (
          <li key={paper._id}>
            <h2>{paper.title}</h2>
            <p>Scheduled For: {new Date(paper.scheduledFor).toLocaleString()}</p>
            <a href={paper.downloadUrl} target="_blank" rel="noopener noreferrer">Download</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PapersList;
