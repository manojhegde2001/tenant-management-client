import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, ShieldCheck, MapPin, X } from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const navItems = [
    { to: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/users', icon: <Users size={20} />, label: 'Users' },
    { to: '/roles', icon: <ShieldCheck size={20} />, label: 'Roles' },
    { to: '/sites', icon: <MapPin size={20} />, label: 'Sites' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-0 left-0 h-full w-64 bg-surface border-r border-border z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-border">
          <span className="text-xl font-black premium-gradient bg-clip-text text-transparent uppercase tracking-tighter">
            Tenant Hub
          </span>
          <button onClick={onClose} className="lg:hidden p-1 text-text-muted hover:text-text-main">
            <X size={20} />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => onClose()}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-primary/10 text-primary-dark font-semibold' 
                    : 'text-text-muted hover:bg-gray-100 hover:text-text-main'
                }`
              }
            >
              <span className={({ isActive }) => isActive ? 'text-primary' : 'text-text-muted'}>
                {item.icon}
              </span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
