console.log('Background running...');

chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  if (message.type === 'CHECK_LOGIN_STATUS') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id!,
        { type: 'REQUEST_LOGIN_STATUS' },
        (response) => {
          sendResponse(response);
        }
      );
    });
    // Need to return true to indicate async response
    return true;
  }
});
