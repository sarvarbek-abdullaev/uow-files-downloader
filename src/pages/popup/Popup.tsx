import React, { useCallback, useEffect, useState } from 'react';
import './popup.css';
import { openNewTab } from '../../utils/chromeHelpers.ts';

interface IFile {
  id: string;
  title: string;
  recordTypeName: string;
  recordTypeCode: string;
}

const Popup: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [mounted, setMounted] = useState<boolean>(false);
  const [documents, setDocuments] = useState<IFile[][] | null>(null);

  const fetchLoginStatus = useCallback(() => {
    chrome.runtime.sendMessage({ type: 'CHECK_LOGIN_STATUS' }, (response) => {
      setUserName(response?.userName || null);
      setMounted(true);
    });
  }, []);

  const onFetchDocuments = useCallback(() => {
    chrome.runtime.sendMessage({ type: 'GET_DOCUMENTS' }, (response) => {
      if (response?.documents) {
        setDocuments(response.documents);
      }
    });
  }, []);

  const onDownloadDocument = useCallback(
    (e: React.MouseEvent, id: string) => {
      const el = e.target as HTMLElement;
      el.innerText = 'Downloading...';
      chrome.runtime.sendMessage(
        { type: 'GET_DOCUMENT_BY_ID', id },
        (response) => {
          const documentId = response?.documentId;
          if (documentId) {
            const token = documents && documents[0][1]?.id;
            if (!token) return;

            const fileUrl = `/viewer/download/${token}/${documentId}`;
            openNewTab('https://student.westminster.ac.uk' + fileUrl);
            el.innerText = 'Downloaded!';
            el.setAttribute('disabled', 'true');

            // Reset the text after 2 seconds
            setTimeout(() => {
              el.innerText = 'Download';
              el.removeAttribute('disabled');
            }, 2000);
          }
        }
      );
    },
    [documents]
  );

  useEffect(() => {
    fetchLoginStatus();
  }, [fetchLoginStatus]);

  useEffect(() => {
    if (!userName) return;

    onFetchDocuments();
  }, [userName, onFetchDocuments]);

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
          <div>
            {!documents ? (
              <h2>Loading documents...</h2>
            ) : !documents.flat().length ? (
              <h2>No documents found</h2>
            ) : (
              <>
                <h2>Documents Found:</h2>
                <table className="document-table">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Name</th>
                      <th>Download</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((documentGroup) =>
                      documentGroup.map((doc, index) => (
                        <tr key={doc.id} className="document-row">
                          <td>{index + 1}</td>
                          <td>{doc.title}</td>
                          <td>
                            <button
                              onClick={(e) => onDownloadDocument(e, doc.id)}
                              className="download-button"
                            >
                              Download
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Popup;
