import React, { useState } from 'react';
import { Calendar, LogIn, LogOut, Menu, X } from 'lucide-react';

interface HeaderProps {
  currentView: 'home' | 'programs' | 'stories' | 'login' | 'student' | 'coordinator' | 'officer';
  onViewChange: (view: 'home' | 'programs' | 'stories' | 'login' | 'student' | 'coordinator' | 'officer') => void;
  isLoggedIn?: boolean;
  onLogout?: () => void;
  userInfo?: { name: string; type: string };
}

export const Header: React.FC<HeaderProps> = ({ 
  currentView, 
  onViewChange, 
  isLoggedIn = false, 
  onLogout, 
  userInfo 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileNavigation = (view: 'home' | 'programs' | 'login' | 'student' | 'coordinator' | 'officer') => {
    onViewChange(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-lg border-b-4 border-blue-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo and Title Section - Adjusted for mobile */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="rounded-full overflow-hidden w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center bg-white">
                <img src="/mamo-logo.png" alt="College logo" className="w-full h-full object-contain" />
              </div>
              <div className="rounded-full overflow-hidden w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center">
                <img src="/download.png" alt="NSS logo" className="w-full h-full object-cover" />
              </div>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">NSS MAMOC</h1>
              <p className="text-xs sm:text-sm text-gray-600">National Service Scheme</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <button
              onClick={() => onViewChange('home')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                currentView === 'home'
                  ? 'bg-blue-700 text-white shadow-md'
                  : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50'
              }`}
            >
              Home
            </button>
            
            {/* Programs (public) */}
            <button
              onClick={() => onViewChange('programs')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                currentView === 'programs'
                  ? 'bg-blue-700 text-white shadow-md'
                  : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50'
              }`}
            >
              <Calendar size={18} />
              <span>Programs</span>
            </button>

            {/* STORIES (only when logged in) */}
            {isLoggedIn && (
              <button
                onClick={() => onViewChange('stories')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  currentView === 'stories'
                    ? 'bg-blue-700 text-white shadow-md'
                    : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50'
                }`}
              >
                <span>Stories</span>
              </button>
            )}
            
            {/* Show Coordinator Portal button for officer login */}
            {isLoggedIn && userInfo?.type === 'officer' && (
              <button
                onClick={() => onViewChange('coordinator')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  currentView === 'coordinator'
                    ? 'bg-blue-700 text-white shadow-md'
                    : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50'
                }`}
              >
                Coordinator Portal
              </button>
            )}
            
            {!isLoggedIn ? (
              <button
                onClick={() => onViewChange('login')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  currentView === 'login'
                    ? 'bg-blue-700 text-white shadow-md'
                    : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50'
                }`}
              >
                <LogIn size={18} />
                <span>Login</span>
              </button>
            ) : (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => {
                    if (userInfo?.type === 'student') onViewChange('student');
                    else if (userInfo?.type === 'coordinator') onViewChange('coordinator');
                    else if (userInfo?.type === 'officer') onViewChange('officer');
                  }}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    (currentView === 'student' && userInfo?.type === 'student') ||
                    (currentView === 'coordinator' && userInfo?.type === 'coordinator') ||
                    (currentView === 'officer' && userInfo?.type === 'officer')
                      ? 'bg-blue-700 text-white shadow-md'
                      : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50'
                  }`}
                >
                  <div className="text-sm">
                    <span className="text-current">Welcome, </span>
                    <span className="font-medium text-current">{userInfo?.name}</span>
                    <div className="text-xs text-current opacity-75 capitalize">{userInfo?.type} Portal</div>
                  </div>
                </button>
                <button
                  onClick={onLogout}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-gray-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="space-y-3">
              {/* Home Button */}
              <button
                onClick={() => handleMobileNavigation('home')}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  currentView === 'home'
                    ? 'bg-blue-700 text-white shadow-md'
                    : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50'
                }`}
              >
                Home
              </button>

              {/* Programs Button - Only when NOT logged in */}
              {!isLoggedIn && (
                <button
                  onClick={() => handleMobileNavigation('programs')}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-3 ${
                    currentView === 'programs'
                      ? 'bg-blue-700 text-white shadow-md'
                      : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50'
                  }`}
                >
                  <Calendar size={20} />
                  <span>Programs</span>
                </button>
              )}

              {/* Login/Portal Buttons based on authentication status */}
              {!isLoggedIn ? (
                <button
                  onClick={() => handleMobileNavigation('login')}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-3 ${
                    currentView === 'login'
                      ? 'bg-blue-700 text-white shadow-md'
                      : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50'
                  }`}
                >
                  <LogIn size={20} />
                  <span>Login</span>
                </button>
              ) : (
                <>
                  {/* Portal Button based on user type */}
                  {userInfo?.type === 'student' && (
                    <button
                      onClick={() => handleMobileNavigation('student')}
                      className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                        currentView === 'student'
                          ? 'bg-blue-700 text-white shadow-md'
                          : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50'
                      }`}
                    >
                      Student Portal
                    </button>
                  )}

                  {userInfo?.type === 'coordinator' && (
                    <button
                      onClick={() => handleMobileNavigation('coordinator')}
                      className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                        currentView === 'coordinator'
                          ? 'bg-blue-700 text-white shadow-md'
                          : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50'
                      }`}
                    >
                      Coordinator Portal
                    </button>
                  )}

                  {userInfo?.type === 'officer' && (
                    <>
                      <button
                        onClick={() => handleMobileNavigation('officer')}
                        className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                          currentView === 'officer'
                            ? 'bg-blue-700 text-white shadow-md'
                            : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50'
                        }`}
                      >
                        Officer Portal
                      </button>
                      <button
                        onClick={() => handleMobileNavigation('coordinator')}
                        className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                          currentView === 'coordinator'
                            ? 'bg-blue-700 text-white shadow-md'
                            : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50'
                        }`}
                      >
                        Coordinator Portal
                      </button>
                    </>
                  )}

                  {/* Logout Button */}
                  <button
                    onClick={() => {
                      onLogout?.();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 rounded-lg font-medium text-red-600 hover:text-red-800 hover:bg-red-50 transition-all duration-200 flex items-center space-x-3"
                  >
                    <LogOut size={20} />
                    <span>Logout</span>
                  </button>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};