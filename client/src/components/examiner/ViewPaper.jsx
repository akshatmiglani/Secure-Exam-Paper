// import axios from "axios";
// import React, { useEffect, useState } from "react";

// const ViewPaper = ({ endpoint, handleUpload }) => {
//   const [papers, setPapers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedPaperId, setSelectedPaperId] = useState(null);
//   const [paperVersions, setPaperVersions] = useState({});
//   const [fetchingVersions, setFetchingVersions] = useState(false);

//   useEffect(() => {
//     const fetchPapers = async () => {
//       try {
//         const response = await axios.get(`http://localhost:4000/api/papers/`);
//         setPapers(response.data);
//       } catch (error) {
//         console.error(`Error fetching ${endpoint} papers:`, error);
//         setError(`Failed to fetch ${endpoint} papers`);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPapers();
//   }, [endpoint]);

//   const handleViewVersions = async (paperId) => {
//     setFetchingVersions(true);
//     try {
//       const response = await axios.get(
//         `http://localhost:4000/api/papers/${paperId}/versions`
//       );
//       setPaperVersions({ ...paperVersions, [paperId]: response.data });
//       setSelectedPaperId(paperId);
//     } catch (error) {
//       console.error("Error fetching paper versions:", error);
//     } finally {
//       setFetchingVersions(false);
//     }
//   };

//   const renderVersions = (paperId) => {
//     if (selectedPaperId === paperId && paperVersions[paperId]) {
//       return (
//         <tr key={`${paperId}-versions`} className="bg-gray-100">
//           <td colSpan="3" className="py-3 px-6">
//             <h2 className="text-lg font-bold mt-2 mb-1">Versions:</h2>
//             <table className="min-w-full bg-white">
//               <thead>
//                 <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
//                   <th className="py-3 px-6 text-left">Version ID</th>
//                   <th className="py-3 px-6 text-left">Created At</th>
//                   <th className="py-3 px-6 text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="text-gray-600 text-sm font-light">
//                 {paperVersions[paperId].versions.map((version) => (
//                   <tr key={version.versionId}>
//                     <td className="py-3 px-6 text-left whitespace-nowrap">
//                       {version.versionId}
//                     </td>
//                     <td className="py-3 px-6 text-left">
//                       {new Date(version.createdAt).toLocaleString()}
//                     </td>
//                     <td className="py-3 px-6 text-center">
//                       <a
//                         href={version.downloadUrl}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-blue-500 hover:underline"
//                       >
//                         Download
//                       </a>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </td>
//         </tr>
//       );
//     }
//     return null;
//   };

//   if (loading) {
//     return <p>Loading...</p>;
//   }

//   if (error) {
//     return <p>Error: {error}</p>;
//   }

//   return (
//     <div className="max-w-4xl mx-auto bg-white shadow-md rounded my-8">
//       <h1 className="text-2xl font-bold bg-blue-500 text-white p-4">
//         Paper's List
//       </h1>
//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white">
//           <thead>
//             <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
//               <th className="py-3 px-6 text-left">Title</th>
//               <th className="py-3 px-6 text-left">Scheduled For</th>
//               <th className="py-3 px-6 text-center">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="text-gray-600 text-sm font-light">
//             {papers.map((paper) => (
//               <React.Fragment key={paper._id}>
//                 <tr className="border-b border-gray-200 hover:bg-gray-100">
//                   <td className="py-3 px-6 text-left whitespace-nowrap">
//                     {paper.title}
//                   </td>
//                   <td className="py-3 px-6 text-left">
//                     {new Date(paper.scheduledFor).toLocaleString()}
//                   </td>
//                   <td className="py-3 px-6 text-center">
//                     <button
//                       onClick={() => handleViewVersions(paper._id)}
//                       className="bg-green-700 text-white rounded py-1 px-4 hover:bg-black mr-2"
//                     >
//                       View Versions
//                     </button>
//                     <button
//                       onClick={() => handleUpload(paper._id)}
//                       className="bg-blue-500 text-white rounded py-1 px-4 hover:bg-black"
//                     >
//                       Update
//                     </button>
//                   </td>
//                 </tr>
//                 {renderVersions(paper._id)}
//               </React.Fragment>
//             ))}
//           </tbody>
//         </table>
//         {fetchingVersions && (
//           <div className="py-3 px-6 text-center">
//             <p>Loading versions...</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ViewPaper;
import axios from "axios";
import React, { useEffect, useState } from "react";

const VersionsRow = ({ versions }) => (
  <tr className="bg-gray-100">
    <td colSpan="3" className="py-3 px-6">
      <h2 className="text-lg font-bold mt-2 mb-1">Versions:</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Version ID</th>
            <th className="py-3 px-6 text-left">Created At</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {versions.map((version) => (
            <tr key={version.versionId}>
              <td className="py-3 px-6 text-left whitespace-nowrap">
                {version.versionId}
              </td>
              <td className="py-3 px-6 text-left">
                {new Date(version.createdAt).toLocaleString()}
              </td>
              <td className="py-3 px-6 text-center">
                <a
                  href={version.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Download
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </td>
  </tr>
);

const ViewPaper = ({ endpoint, handleUpload }) => {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPaperId, setSelectedPaperId] = useState(null);
  const [paperVersions, setPaperVersions] = useState({});
  const [fetchingVersions, setFetchingVersions] = useState(false);

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

  const handleViewVersions = async (paperId) => {
    setFetchingVersions(true);
    try {
      const response = await axios.get(
        `http://localhost:4000/api/papers/${paperId}/versions`
      );
      if (selectedPaperId === paperId) {
        setSelectedPaperId(null); // Close versions if already open
      } else {
        setPaperVersions({ ...paperVersions, [paperId]: response.data });
        setSelectedPaperId(paperId);
      }
    } catch (error) {
      console.error("Error fetching paper versions:", error);
    } finally {
      setFetchingVersions(false);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-md rounded my-8">
      <h1 className="text-2xl font-bold bg-blue-500 text-white p-4">
        Paper's List
      </h1>
      <div className="overflow-x-auto max-h-96">
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
              <React.Fragment key={paper._id}>
                <tr className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    {paper.title}
                  </td>
                  <td className="py-3 px-6 text-left">
                    {new Date(paper.scheduledFor).toLocaleString()}
                  </td>
                  <td className="py-3 px-6 text-center">
                    <button
                      onClick={() => handleViewVersions(paper._id)}
                      className="bg-green-700 text-white rounded py-1 px-4 hover:bg-black mr-2"
                    >
                      {selectedPaperId === paper._id ? "Close Versions" : "View Versions"}
                    </button>
                    <button
                      onClick={() => handleUpload(paper._id)}
                      className="bg-blue-500 text-white rounded py-1 px-4 hover:bg-black"
                    >
                      Update
                    </button>
                  </td>
                </tr>
                {selectedPaperId === paper._id && (
                  <VersionsRow key={`${paper._id}-versions`} versions={paperVersions[paper._id]?.versions || []} />
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        {fetchingVersions && (
          <div className="py-3 px-6 text-center">
            <p>Loading versions...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewPaper;
