import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Menu, Bell, Search, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/cn';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getPageTitle = () => {
    const path = location.pathname.substring(1);
    if (!path) return 'Dashboard';
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <nav className="sticky top-0 z-30 w-full h-20 bg-white/80 backdrop-blur-md border-b border-border transition-all duration-300">
      <div className="flex h-full items-center justify-between px-6 sm:px-8">
        
        {/* Left: Mobile Toggle & Title */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-2 text-text-muted hover:text-text-main hover:bg-slate-100 rounded-xl transition-all"
            aria-label="Toggle menu"
          >
            <Menu size={24} />
          </button>
          
          <div>
            <h1 className="text-xl font-bold text-text-main tracking-tight leading-none">
              {getPageTitle()}
            </h1>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1 hidden sm:block">
              Overview & Analytics
            </p>
          </div>
        </div>

        {/* Center: Search Bar Placeholder */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input 
              type="text" 
              placeholder="Search data, users, or sites..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
            />
          </div>
        </div>

        {/* Right: User Profile & Actions */}
        <div className="flex items-center gap-2">
          <button className="p-2 text-text-muted hover:text-text-main hover:bg-slate-100 rounded-xl transition-all relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-white"></span>
          </button>
          
          <div className="w-px h-6 bg-border mx-2"></div>
          
          <div className="flex items-center gap-3 pl-2">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-bold text-text-main whitespace-nowrap">{user?.name || 'Admin User'}</span>
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{user?.role?.name || 'Administrator'}</span>
            </div>
            
            <div className="h-10 w-10 rounded-xl bg-slate-100 text-text-main flex items-center justify-center font-bold border border-border shadow-sm overflow-hidden group cursor-pointer hover:border-primary/50 transition-all">
              {user?.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User size={20} className="text-text-muted group-hover:text-primary transition-colors" />
              )}
            </div>

            <button 
              onClick={handleLogout}
              className="p-2 text-text-muted hover:text-error hover:bg-error/5 rounded-xl transition-all border border-transparent hover:border-error/20"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
