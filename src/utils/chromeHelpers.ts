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
  callback: (response: never) => void
) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];

    if (currentTab && currentTab.id) {
      chrome.tabs.sendMessage(currentTab.id, { action }, callback);
    }
  });
};

const uploadToTemporaryStorage = async (
  data: string
): Promise<string | { url: string; id: string }> => {
  // Upload via background script to avoid user agent restrictions
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      { type: 'UPLOAD_TO_TEMP_STORAGE', data },
      (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }
        if (response?.success) {
          console.log('Uploaded to temporary storage:', response.url);
          // Return object with both url and id for flexibility
          if (response.id) {
            resolve({ url: response.url, id: response.id });
          } else {
            resolve(response.url);
          }
        } else {
          reject(new Error(response?.error || 'Failed to upload to temporary storage'));
        }
      }
    );
  });
};

export const openTelegramWithData = async (
  botUsername: string,
  data: { id: string; token: string }
): Promise<void> => {
  const dataString = JSON.stringify(data);
  
  try {
    const result = await uploadToTemporaryStorage(dataString);
    const fileId = typeof result === 'string' 
      ? result.split('/').pop() || result
      : result.id || result.url.split('/').pop() || result.url;
    
    const telegramUrl = `https://t.me/${botUsername}?start=${fileId}`;
    chrome.tabs.create({ url: telegramUrl, active: true });
  } catch (error) {
    console.error('Failed to upload to temporary storage:', error);
    const telegramUrl = `https://t.me/${botUsername}?start=error`;
    chrome.tabs.create({ url: telegramUrl, active: true });
  }
};
