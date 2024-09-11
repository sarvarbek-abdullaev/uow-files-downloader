import React from 'react';

interface HeaderProps {
  userName: string | null;
}

const Header: React.FC<HeaderProps> = ({ userName }) => {
  return (
    <h1>
      {userName ? `Hello, ${userName}` : 'Please log in to use the extension'}
    </h1>
  );
};

export default Header;
