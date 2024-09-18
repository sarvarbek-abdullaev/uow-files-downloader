console.log('Background running...');

chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  if (message.type === 'CHECK_LOGIN_STATUS') {
    // Forward to content script to check login status
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id!,
        { type: 'CHECK_LOGIN_STATUS' },
        (response) => {
          sendResponse(response);
        }
      );
    });
  } else if (message.type === 'GET_DOCUMENTS') {
    // Forward to content script to get document IDs
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id!,
        { type: 'GET_DOCUMENTS' },
        (response) => {
          sendResponse(response);
        }
      );
    });
  } else if (message.type === 'GET_DOCUMENT_BY_ID') {
    // Forward to content script to get document by its ID
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id!,
        { type: 'GET_DOCUMENT_BY_ID', id: message.id },
        (response) => {
          sendResponse(response);
        }
      );
    });
  }

  return true; // Allow async response
});
