import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, ShieldCheck, MapPin, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/users', icon: <Users size={20} />, label: 'Users' },
    { to: '/roles', icon: <ShieldCheck size={20} />, label: 'Roles' },
    { to: '/sites', icon: <MapPin size={20} />, label: 'Sites' },
  ];

  return (
    <nav className="bg-surface border-b border-border sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-8">
            <span className="text-xl font-black premium-gradient bg-clip-text text-transparent uppercase tracking-tighter">
              Tenant Hub
            </span>
            
            <div className="hidden md:flex items-center gap-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-text-muted hover:bg-background hover:text-text-main'
                    }`
                  }
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end mr-4">
              <span className="text-sm font-bold text-text-main">{user?.name}</span>
              <span className="text-xs text-text-muted capitalize">{user?.role?.name}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-text-muted hover:text-error hover:bg-error/5 rounded-full transition-all"
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
