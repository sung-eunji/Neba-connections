// ONLY CAN MODIFY STYLE AND LANGUAGE, MUST NOT CHANGE LOGIC!

/**
 * LoginStatus Component
 *
 * A React component that displays the current authentication status of the user.
 * Shows a login button when user is not authenticated, or user email and logout button when authenticated.
 *
 * @example
 * // Basic usage in a Header component
 * export const Header = () => (
 *   <header className="flex justify-between items-center p-4 bg-gray-100">
 *     <h1 className="text-xl font-bold">My App</h1>
 *     <AuthStatus />
 *   </header>
 * );
 */

import { useAuth } from '../hooks/useAuth';

export const AuthStatus = () => {
  const { user, signIn, signOut } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center">
        <button
          onClick={signIn}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg text-sm font-medium transition-colors duration-200 shadow-sm"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <span className="text-sm text-gray-700 font-medium">{user.email}</span>
      <button
        onClick={signOut}
        className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors duration-200 shadow-sm"
      >
        Logout
      </button>
    </div>
  );
};
