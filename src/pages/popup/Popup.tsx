import React, { useEffect, useState } from 'react';
import { openUrl, getCurrentTabUrl } from '../../utils/chromeHelpers';
import { fetchUserName } from '../../utils/userHelpers';
import Header from './components/Header';
import FileButtons from './components/FileButtons';
import './popup.css';

const Popup: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [windowUrl, setWindowUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchUserName(setUserName);
  }, []);

  useEffect(() => {
    if (userName) {
      getCurrentTabUrl(setWindowUrl);
    }
  }, [userName]);

  // Handle Document page navigation
  const handleLinkClick = (e: React.MouseEvent, newUrl: string) => {
    e.preventDefault();
    openUrl(newUrl);
  };

  // Render login message if no username is found
  if (!userName) {
    return (
      <div>
        <h1>Please log in to use the extension</h1>
      </div>
    );
  }

  // Render prompt to navigate to Documents page if not already there
  if (windowUrl !== 'https://student.westminster.ac.uk/Documents') {
    return (
      <div>
        Open or click on the{' '}
        <button
          onClick={(e) =>
            handleLinkClick(e, 'https://student.westminster.ac.uk/Documents')
          }
        >
          Documents
        </button>{' '}
        page to use the extension
      </div>
    );
  }

  return (
    <div>
      <Header userName={userName} />
      <p>Click the button to download the file you want. </p>
      <FileButtons />
    </div>
  );
};

export default Popup;
