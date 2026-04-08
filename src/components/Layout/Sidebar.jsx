import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, ShieldCheck, X, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';

const Sidebar = ({ isOpen, onClose }) => {
  const navItems = [
    { to: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/users', icon: <Users size={20} />, label: 'Users' },
    { to: '/roles', icon: <ShieldCheck size={20} />, label: 'Roles' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-white border-r border-border z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 overflow-y-auto",
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="h-20 flex items-center justify-between px-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <ShieldCheck size={20} />
            </div>
            <span className="text-xl font-black text-text-main tracking-tight">
              Tenant<span className="text-primary">Hub</span>
            </span>
          </div>
          <button onClick={onClose} className="lg:hidden p-2 text-text-muted hover:text-text-main transition-colors">
            <X size={20} />
          </button>
        </div>

        <nav className="mt-6 px-4 space-y-2">
          <p className="px-4 text-[10px] font-bold text-text-muted uppercase tracking-widest mb-4">Main Menu</p>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => onClose()}
              className={({ isActive }) =>
                cn(
                  "group flex items-center justify-between px-4 py-3 text-sm font-semibold rounded-2xl transition-all duration-200",
                  isActive 
                    ? "bg-primary text-white shadow-lg shadow-primary/20" 
                    : "text-text-muted hover:bg-slate-50 hover:text-text-main"
                )
              }
            >
              <div className="flex items-center gap-3">
                {item.icon}
                {item.label}
              </div>
              <ChevronRight size={14} className={cn("transition-transform", "opacity-0 group-hover:opacity-100")} />
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-8 left-0 w-full px-6">
          <div className="p-4 rounded-2xl bg-slate-50 border border-border">
            <p className="text-xs font-bold text-text-main mb-1">Need help?</p>
            <p className="text-[11px] text-text-muted mb-3">Check our documentation for guides and integration tips.</p>
            <button className="w-full py-2 bg-white border border-border rounded-xl text-[11px] font-bold text-text-main hover:bg-gray-50 transition-colors shadow-sm">
              View Docs
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
