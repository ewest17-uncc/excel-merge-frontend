// FileUploader.js
import React, { useState, useEffect } from 'react';
import Switch from '@mui/material/Switch';
import axios from 'axios';
import './App.css'

const FileUploader = ({ onMerge }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [merge, setMerge] = useState(true);
  const [error, setError] = useState(false);
  const [selectedIndicator, setSelectedIndicator] = useState('');
  const [VPR, setVPR] = useState('');

  useEffect(() => {
    console.log('FILES ARE: ', files)
  }, [files])

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const toggleMerge = () => {
    setMerge(!merge);
  };

  const handleMerge = async () => {
    setLoading(true);
    setError(false);
    const formData = new FormData();
    // for (let i = 0; i < files.length; i++) {
    //     console.log('IN THE FOR LOOP: ', files[i])
    //     formData.append('files', files[i]);
    //     console.log('NEW FORM DATA: ', formData)
    // }
    for (let i = 0; i < files.length; i++) {
        formData.append(`files[${i}]`, files[i]); // Append each file with a unique key
    }

    formData.append('selectedIndicator', selectedIndicator);
    formData.append('VPR', VPR);

    console.log('FORM DATA: ')
    for(var pair of formData.entries()) {
        console.log(pair[0]+ ', '+ pair[1]); 
     }

    console.log('ENV VAR: ', process.env.REACT_APP_API_URL)
    const link = merge ? `${process.env.REACT_APP_API_URL}/merge_excel` : `${process.env.REACT_APP_API_URL}/process_excel`
    console.log('LINK: ', link)
    try {
      const response = await axios.post(link, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Access-Control-Allow-Origin': '*'
        },
        responseType: 'blob', // Important for receiving binary data
      });

      console.log('RESPONSE: ', response.data);
      console.log('RESPONSE Status: ', response.status);

      // Create a blob from the response data
      const blob = merge 
      ? 
        new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }) 
      :
        new Blob([response.data], { type: 'application/zip' });

        const contentDisposition = response.headers['content-disposition'];
        const fileNameMatch = contentDisposition && contentDisposition.match(/filename=([^;]+)/);
        const fileName = fileNameMatch ? fileNameMatch[1] : 'output.xlsx';



      // Create a download link and trigger the download
      const downloadLink = document.createElement('a');
      downloadLink.href = window.URL.createObjectURL(blob);
      downloadLink.download = fileName;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      setLoading(false);
    } catch (error) {
      console.error('Error merging files:', error);
      setError(true);
      setLoading(false);
    }
  };

  return (
    // <div className="file-uploader">
    //   <input type="file" multiple onChange={handleFileChange}  />
    //   <button onClick={handleMerge} className="merge-button">Merge and Translate</button>
    // </div>

    <div className="file-uploader">
        <div className="file-input-container">
            <label htmlFor="file-input" className="file-label">Choose Files</label>
            <input type="file" id="file-input" multiple onChange={handleFileChange} className="file-input" />
        </div>
        <span className="file-display">
            {files.length > 0 ? `${files.length} file${files.length > 1 ? 's' : ''} selected` : 'No files selected'}
        </span>
        <br></br>
        <div className="indicator-selector">
            <label htmlFor="indicator-select">Select Indicator:</label>
            <select id="indicator-select" onChange={(e) => setSelectedIndicator(e.target.value)}>
            <option value="">-- Select --</option>
            <option value="маловероятно, что ввезем">маловероятно, что ввезем</option>
            <option value="запрет на ввоз">запрет на ввоз</option>
            <option value="МПТ Прекурсор">МПТ Прекурсор</option>
            <option value="Яд, маловероятно">Яд, маловероятно</option>
            </select>
        </div>
        <br></br>
        <div className="vpr-selector">
            <label htmlFor="vpr-select">Write ВПР:</label>
            <input id="vpr-select" onChange={(e) => setVPR(e.target.value)}>
            </input>
        </div>
        <label className="slider-label">Merge?</label>
        <Switch
            checked={merge}
            onChange={toggleMerge}
            inputProps={{ 'aria-label': 'controlled' }}
        />
        {console.log('MERGE STATE: ', merge)}
        <br></br>
        {loading ? (
        <div className="loading-animation">
            <div className="loading-spinner"></div>
            Loading...
        </div>
        ) : (
        <div className="merge-button-container">
            <button onClick={handleMerge} className="merge-button">Merge and Translate</button>
        </div>
      )}
        {error ? (
            <div className="file-display">
                Failed To Merge Files
            </div>
        ) : (
            <div></div>
        )}

    </div>
  );
};

export default FileUploader;
