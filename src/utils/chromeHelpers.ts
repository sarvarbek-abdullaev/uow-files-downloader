export const openNewTab = (url: string) => {
  chrome.tabs.create({ url, active: true });
};

export const downloadFile = (url: string) => {
  const a = document.createElement('a');
  a.href = url;
  a.download = ''; // This is important to trigger download
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
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
