// Define message action types
interface GetUserNameRequest {
  action: 'getUserName';
}

interface DownloadFileRequest {
  action: 'downloadFile';
}

type MessageRequest = GetUserNameRequest | DownloadFileRequest;

// Define message response types
interface GetUserNameResponse {
  userName: string | null;
}

interface DownloadFileResponse {
  url: string;
}

chrome.runtime.onMessage.addListener(
  (request: MessageRequest, _, sendResponse) => {
    if (request.action === 'getUserName') {
      // Type guard for the 'getUserName' action
      handleGetUserName(sendResponse);
    } else if (request.action.includes('downloadFile')) {
      const [, fileType] = request.action.split(':');
      handleDownloadFile(sendResponse, fileType);
      return true; // Indicates we are sending the response asynchronously
    }
  }
);

// Handle retrieving the username
const handleGetUserName = (
  sendResponse: (response: GetUserNameResponse) => void
) => {
  const loggedIn = document.querySelector(
    '.kt-header__topbar-username'
  ) as HTMLElement | null;
  const userName = loggedIn ? loggedIn.innerText : null;
  sendResponse({ userName });
};

// Handle downloading the file
const handleDownloadFile = async (
  sendResponse: (response: DownloadFileResponse) => void,
  fileType: string
) => {
  const btn = document.querySelector('[data-record-id]') as HTMLElement | null;
  btn?.click(); // Trigger the file button click if it exists

  try {
    const url = await waitForFileUrl(fileType); // Wait for the URL to be ready
    sendResponse({ url });
  } catch (error) {
    console.error('Error fetching file URL:', error);
    sendResponse({ url: '' }); // Fallback in case of error
  }
};

// Function to wait for the file URL to be ready
const waitForFileUrl = async (fileType: string): Promise<string> => {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      const select = document.querySelector(
        '#documentSelector'
      ) as HTMLSelectElement;

      if (!select) {
        return;
      }

      const options = select.options;
      const activeOption = select.options[select.selectedIndex];
      const lowerCasedFileType = fileType.toLowerCase();

      if (!activeOption.text.toLowerCase().includes(lowerCasedFileType)) {
        for (let i = 0; i < options.length; i++) {
          const lowerCasedText = options[i].text.toLowerCase();
          if (lowerCasedText.includes(lowerCasedFileType)) {
            select.selectedIndex = i;

            // Trigger the change event
            const event = new Event('change');
            select.dispatchEvent(event);
            break;
          }
        }
      }

      const certificateIframe = document.querySelector(
        '#documentViewerContainer iframe'
      ) as HTMLIFrameElement | null;

      if (certificateIframe) {
        const urlParts = certificateIframe.src.split('/');
        const documentId = urlParts.length
          ? urlParts[urlParts.length - 2]
          : null;

        if (documentId && select?.options[1]?.value) {
          clearInterval(interval); // Stop checking once URL is ready
          const token = select.options[1].value;
          resolve(`/viewer/download/${token}/${documentId}`); // Construct and resolve the URL
        }
      }
    }, 300); // Check every 300ms
  });
};
