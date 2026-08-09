
import React from 'react';
import { User } from '../types';

interface HeaderProps {
  user: User;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 5a1 1 0 000 2h1a1 1 0 000-2H7zM4 9a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm1 3a1 1 0 100 2h1a1 1 0 100-2H5zm3 2a1 1 0 11-2 0 1 1 0 012 0zM9 5a1 1 0 100 2h1a1 1 0 100-2H9zm3 0a1 1 0 100 2h1a1 1 0 100-2h-1z" clipRule="evenodd" />
            </svg>
            <h1 className="text-xl font-bold text-gray-800">Salon Booking</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="font-medium text-gray-700">{user.name}</p>
              <p className="text-sm text-gray-500 capitalize">{user.role} Dashboard</p>
            </div>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 ease-in-out"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
