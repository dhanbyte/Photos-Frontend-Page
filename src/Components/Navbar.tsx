import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const location = useLocation();
  const { isAuthenticated, admin, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-800">
              Gallery
            </Link>
          </div>

          {/* Center Nav Links */}
          <div className="flex pl-5 space-x-4">
            <Link
              to="/"
              className={`${
                location.pathname === "/"
                  ? "border-blue-500 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
            >
              Home
            </Link>

            <Link
              to="/admin"
              className={`${
                location.pathname === "/admin"
                  ? "border-blue-500 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
            >
              Admin
            </Link>

            {!isAuthenticated && (
              <Link
                to="/login"
                className={`${
                  location.pathname === "/login"
                    ? "border-blue-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Login
              </Link>
            )}
          </div>

          {/* Right User Info */}
          {isAuthenticated && admin && (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 hidden sm:inline">
                Welcome, <span className="font-medium">{admin.username}</span>
              </span>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
