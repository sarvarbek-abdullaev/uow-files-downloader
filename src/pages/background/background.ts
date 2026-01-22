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
  } else if (message.type === 'UPLOAD_TO_TEMP_STORAGE') {
    (async () => {
      try {
        const formData = new FormData();
        formData.append('content', message.data);
        formData.append('title', 'uow_data');
        formData.append('syntax', 'json');
        formData.append('expiry_days', '1');

        const response = await fetch('https://dpaste.com/api/v2/', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`dpaste failed: ${response.status}`);
        }

        const url = await response.text();
        const pasteId = url.trim().split('/').pop() || url.trim();
        console.log('Paste ID:', pasteId);
        sendResponse({ success: true, url: url.trim(), id: pasteId });
        return;
      } catch (error) {
        console.log('dpaste failed, trying 0x0.st:', error);
      }
    })();
    return true; // Allow async response
  }

  return true; // Allow async response
});
