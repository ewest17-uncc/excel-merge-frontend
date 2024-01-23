// App.js
import React, { useState } from 'react';
import FileUploader from './FileUploader';
import './App.css'; // Import the CSS file

const App = () => {
  const [outputFilePath, setOutputFilePath] = useState('');

  const handleMerge = (path) => {
    setOutputFilePath(path);
  };

  return (
    <div className="container">
      <h1>Excel Merge App</h1>
      <FileUploader onMerge={handleMerge} />
      {outputFilePath && (
        <div className="file-list">
          <p>Download your merged file:</p>
          <a href={outputFilePath} download className="download-link">
            Download
          </a>
        </div>
      )}
    </div>
  );
};

export default App;
