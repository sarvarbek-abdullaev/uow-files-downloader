console.log('Background running...');

chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});
