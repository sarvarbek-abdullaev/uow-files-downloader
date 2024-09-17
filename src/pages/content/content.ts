interface ILoginStatus {
  userName: string | null;
}

interface IGetDocuments {
  documentIds: string[];
}

async function getDocumentIds(): Promise<string[]> {
  const documentsPage = await fetch(
    'https://student.westminster.ac.uk/Documents'
  );
  const documentsPageText = await documentsPage.text();

  const parser = new DOMParser();
  const document = parser.parseFromString(documentsPageText, 'text/html');
  const documentsButtons = document.querySelectorAll(
    '[data-record-id]'
  ) as NodeListOf<HTMLElement>;

  return Array.from(documentsButtons).map(
    (button) => button.getAttribute('data-record-id') || ''
  );
}

async function getFiles(documentIds: string[]): Promise<any[]> {
  const promises = Array.from(documentIds).map((id) =>
    fetch(`https://student.westminster.ac.uk/viewer/data/false/0/${id}`)
  );

  const responses = await Promise.all(promises);
  const data = await Promise.all(responses.map((response) => response.json()));

  return data.map((d) => d.result?.documents);
}

async function getDocumentId(id: string): Promise<any> {
  const response = await fetch(
    `https://student.westminster.ac.uk/viewer/data/false/0/${id}`
  );
  const data = await response.json();
  return data.result?.document;
}

const handleLoginStatus = (sendResponse: (response: ILoginStatus) => void) => {
  const loggedIn = document.querySelector(
    '.kt-header__topbar-username'
  ) as HTMLElement | null;
  const userName = loggedIn ? loggedIn.innerText : null;
  sendResponse({ userName });
};

const handleGetDocuments = async (
  sendResponse: (response: IGetDocuments) => void
) => {
  try {
    const documentIds = await getDocumentIds();
    sendResponse({ documentIds });
  } catch (error) {
    console.error('Error fetching documents:', error);
    sendResponse({ documentIds: [] }); // Send an empty response if there's an error
  }
};

const handleGetDocumentId = async (
  sendResponse: (response: any) => void,
  id: string
) => {
  try {
    const document = await getDocumentId(id);
    sendResponse({ document });
  } catch (error) {
    console.error('Error fetching document:', error);
    sendResponse(null);
  }
};

chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  if (message.type === 'CHECK_LOGIN_STATUS') {
    // Call checkLoginStatus and use the return value to send response
    handleLoginStatus(sendResponse);
  }
});
