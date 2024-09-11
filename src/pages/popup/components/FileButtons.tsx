import React from 'react';
import { sendMessageToTab, openNewTab } from '../../../utils/chromeHelpers.ts';

type FileButtonsProps = object;

const FileButtons: React.FC<FileButtonsProps> = () => {
  const handleButtonClick = (fileType: string) => {
    sendMessageToTab(`downloadFile:${fileType}`, (response) => {
      openNewTab('https://student.westminster.ac.uk' + response.url);
    });
  };

  return (
    <div>
      <button onClick={() => handleButtonClick('transcript')}>
        Transcript
      </button>
      <button onClick={() => handleButtonClick('certificate')}>
        Certificate
      </button>
      <button onClick={() => handleButtonClick('letter')}>Letter</button>
    </div>
  );
};

export default FileButtons;
