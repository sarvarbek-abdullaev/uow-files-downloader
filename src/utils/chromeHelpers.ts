export const openUrl = (url: string) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];

    if (currentTab && currentTab.id) {
      chrome.tabs.update(currentTab.id, { url });
    }
  });
};

export const openNewTab = (url: string) => {
  chrome.tabs.create({ url });
};

export const sendMessageToTab = (
  action: string,
  callback: (response: any) => void
) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];

    if (currentTab && currentTab.id) {
      chrome.tabs.sendMessage(currentTab.id, { action }, callback);
    }
  });
};

export const getCurrentTabUrl = (callback: (url: string) => void) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];

    if (currentTab && currentTab.url) {
      callback(currentTab.url);
    }
  });
};
