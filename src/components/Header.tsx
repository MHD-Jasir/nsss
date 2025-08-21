import React from 'react';
import { Calendar, LogIn, LogOut } from 'lucide-react';

interface HeaderProps {
  currentView: 'home' | 'programs' | 'login' | 'student' | 'coordinator' | 'officer';
  onViewChange: (view: 'home' | 'programs' | 'login' | 'student' | 'coordinator' | 'officer') => void;
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
  return (
    <header className="bg-white shadow-lg border-b-4 border-blue-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="rounded-full overflow-hidden w-16 h-16 flex items-center justify-center bg-white">
                <img src="/mamo-logo.png" alt="College logo" className="w-full h-full object-contain" />
              </div>
              <div className="rounded-full overflow-hidden w-12 h-12 flex items-center justify-center">
                <img src="/download.png" alt="NSS logo" className="w-full h-full object-cover" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">NSS MAMOC</h1>
              <p className="text-sm text-gray-600">National Service Scheme</p>
            </div>
          </div>

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
            
            {/* Show Programs button only when NOT logged in */}
            {!isLoggedIn && (
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

          <div className="md:hidden flex items-center space-x-2">
            <select
              value={currentView}
              onChange={(e) => onViewChange(e.target.value as 'home' | 'programs' | 'login' | 'student' | 'coordinator' | 'officer')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="home">Home</option>
              {/* Show Programs option only when NOT logged in */}
              {!isLoggedIn && <option value="programs">Programs</option>}
              {!isLoggedIn && <option value="login">Login</option>}
              {isLoggedIn && userInfo?.type === 'student' && <option value="student">Student Portal</option>}
              {isLoggedIn && userInfo?.type === 'coordinator' && <option value="coordinator">Coordinator Portal</option>}
              {isLoggedIn && userInfo?.type === 'officer' && <option value="officer">Officer Portal</option>}
              {/* Show Coordinator Portal option for officer login */}
              {isLoggedIn && userInfo?.type === 'officer' && <option value="coordinator">Coordinator Portal</option>}
            </select>
            {isLoggedIn && (
              <button
                onClick={onLogout}
                className="px-3 py-2 text-sm text-red-600 hover:text-red-800 border border-red-300 rounded-lg"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};