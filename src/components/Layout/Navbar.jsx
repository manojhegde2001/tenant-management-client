import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-surface border-b border-border sticky top-0 z-30 shadow-sm h-16">
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Mobile Menu Toggle */}
        <div className="flex items-center">
          <button 
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-2 text-text-muted hover:text-text-main focus:outline-none"
            aria-label="Toggle menu"
          >
            <Menu size={24} />
          </button>
          
          {/* Optional: Add page title or breadcrumbs here in the future */}
          <span className="hidden lg:block text-sm font-medium text-text-muted capitalize">
            {location.pathname === '/' ? 'Dashboard' : location.pathname.substring(1)}
          </span>
        </div>

        {/* User Profile & Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end mr-2">
            <span className="text-sm font-bold text-text-main">{user?.name || 'Admin User'}</span>
            <span className="text-xs text-text-muted font-medium capitalize">{user?.role?.name || 'Administrator'}</span>
          </div>
          
          <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold border border-primary/20">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>

          <button 
            onClick={handleLogout}
            className="p-2 ml-2 text-text-muted hover:text-error hover:bg-error/5 rounded-lg transition-colors border border-transparent hover:border-error/20"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
