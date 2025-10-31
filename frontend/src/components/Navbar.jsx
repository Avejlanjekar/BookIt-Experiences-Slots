import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white/70 backdrop-blur-lg border-b border-gray-200 shadow-[0_4px_20px_rgba(0,0,0,0.05)] sticky top-0 z-50 font-poppins">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 text-2xl font-extrabold bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent tracking-tight"
          >
            <span>BookIt</span>
          </Link>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-slate-700 font-medium">
                  Hello, <span className="text-yellow-600 font-semibold">{user.name}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white px-6 py-2 rounded-full font-semibold shadow-md transition-all duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-slate-700 hover:text-yellow-600 font-medium transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white px-6 py-2 rounded-full font-semibold shadow-md transition-all duration-300"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-slate-700 hover:text-yellow-600 transition"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        <div
          className={`md:hidden bg-white border-t border-gray-100 mt-2 rounded-lg shadow-sm transform transition-all duration-300 origin-top ${
            menuOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'
          }`}
        >
          <div className="flex flex-col space-y-3 p-4">
            {['Home', 'Explore', 'About'].map((item, idx) => (
              <Link
                key={idx}
                to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
                className="text-slate-700 hover:text-yellow-600 transition"
              >
                {item}
              </Link>
            ))}

            {isAuthenticated ? (
              <>
                <span className="text-slate-700 font-medium">
                  Hello, <span className="text-yellow-600 font-semibold">{user.name}</span>
                </span>
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-6 py-2 rounded-full font-semibold hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="text-slate-700 hover:text-yellow-600 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-center px-6 py-2 rounded-full font-semibold hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
