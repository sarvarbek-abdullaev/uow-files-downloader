import { sendMessageToTab } from './chromeHelpers';

export const fetchUserName = (
  setUserName: (userName: string | null) => void
) => {
  sendMessageToTab('getUserName', (response) => {
    setUserName(response.userName);
  });
};
