import React, { useState } from 'react';
import { User, Role } from '../types';
import { mockUsers } from '../data/mockData';

interface LoginScreenProps {
  onLogin: (user: User) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<Role>(Role.CUSTOMER);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Hidden Admin Login
    if (email === 'ahmadshorif00001@gmail.com' && password === 'Ahmadkobir@447869@91910') {
      const adminUser = mockUsers.find(u => u.role === 'admin');
      if (adminUser) {
        onLogin(adminUser);
        return;
      }
    }

    // Regular user login (mocked)
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser) {
      // In a real app, you'd check the password hash
      onLogin(foundUser);
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !phone || !password) {
      setError('All fields are required for sign up.');
      return;
    }
    if (mockUsers.find(u => u.email === email)) {
      setError('An account with this email already exists.');
      return;
    }

    const newUser: User = {
      uid: `user${Date.now()}`,
      name,
      email,
      phone,
      role,
      balance: 0,
      ...(role === Role.VENDOR && { approved: false }),
    };

    mockUsers.push(newUser);
    onLogin(newUser);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-600">Salon Booking</h1>
          <p className="text-gray-600 mt-2">
            {isSignUp ? 'Create your new account' : 'Welcome Back! Please sign in to your account.'}
          </p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <form onSubmit={isSignUp ? handleSignUp : handleLogin}>
            {isSignUp && (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150"
                  />
                </div>
                 <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150"
                  />
                </div>
              </>
            )}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email {isSignUp ? '' : '/ Phone'}
              </label>
              <input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isSignUp ? 'Enter your email' : 'Enter your email or phone'}
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150"
              />
            </div>
             {isSignUp && (
               <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">I am a:</label>
                <div className="flex items-center space-x-4 mt-2">
                  <label className="flex items-center cursor-pointer">
                    <input type="radio" name="role" value={Role.CUSTOMER} checked={role === Role.CUSTOMER} onChange={() => setRole(Role.CUSTOMER)} className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"/>
                    <span className="ml-2 text-gray-700">Customer</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input type="radio" name="role" value={Role.VENDOR} checked={role === Role.VENDOR} onChange={() => setRole(Role.VENDOR)} className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"/>
                    <span className="ml-2 text-gray-700">Salon Owner (Vendor)</span>
                  </label>
                </div>
              </div>
            )}
            {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200"
            >
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </button>
          </form>
          <p className="text-center text-gray-500 text-sm mt-6">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{' '}
            <button 
              onClick={() => { 
                setIsSignUp(!isSignUp); 
                setError(''); 
                // Clear fields when toggling
                setEmail('');
                setPassword('');
                setName('');
                setPhone('');
              }} 
              className="text-indigo-600 hover:text-indigo-800 font-semibold focus:outline-none"
            >
              {isSignUp ? 'Sign In' : 'Sign up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;