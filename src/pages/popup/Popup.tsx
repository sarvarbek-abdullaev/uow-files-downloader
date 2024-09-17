import React, { useCallback, useEffect, useState } from 'react';
import './popup.css';

const Popup: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [mounted, setMounted] = useState<boolean>(false);

  const fetchLoginStatus = useCallback(() => {
    chrome.runtime.sendMessage({ type: 'CHECK_LOGIN_STATUS' }, (response) => {
      setUserName(response?.userName || null);
      setMounted(true);
    });
  }, []);

  const onDownloadFile = useCallback(() => {
    if (!userName) return;
    chrome.runtime.sendMessage({ type: 'GET_DOCUMENTS' }, (response) => {
      console.log('Download file response:', response);
    });
  }, [userName]);

  // UseEffect to fetch login status when the popup loads
  useEffect(() => {
    fetchLoginStatus();
  }, []);

  if (!mounted) {
    return (
      <div className="popup">
        <h1>Loading your login status...</h1>
      </div>
    );
  }

  return (
    <div className="popup">
      {!userName ? (
        <div className="login-message">
          <h1>Please log in to use the extension</h1>
        </div>
      ) : (
        <div className="logged-in-content">
          <h1>Welcome, {userName}!</h1>
          <p>Click the button to download the file you want.</p>
          <button onClick={onDownloadFile} className="file-button">
            Download File
          </button>
        </div>
      )}
    </div>
  );
};

export default Popup;
