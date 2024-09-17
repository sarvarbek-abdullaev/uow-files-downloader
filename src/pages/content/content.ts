function checkLoginStatus(): string | null {
  const userElement = document.querySelector(
    '.kt-header__topbar-username'
  ) as HTMLElement | null;
  return userElement ? userElement.textContent?.trim() || null : null;
}

chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  if (message.type === 'REQUEST_LOGIN_STATUS') {
    // Call checkLoginStatus and use the return value to send response
    const userName = checkLoginStatus();
    sendResponse({ userName: userName });
  }
});
