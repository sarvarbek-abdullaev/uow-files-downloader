export const openNewTab = (url: string) => {
  chrome.tabs.create({ url, active: false });
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
