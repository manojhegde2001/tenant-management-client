import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, ShieldCheck, X, ChevronRight, Github } from 'lucide-react';
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

        <div className="absolute bottom-6 left-0 w-full px-6">
          <div className="p-5 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-2xl overflow-hidden relative group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/30 transition-colors" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
                  <Github size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-white/90">Repositories</p>
                  <p className="text-[9px] text-white/50 leading-none">Source Control</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <a 
                  href="https://github.com/manojhegde2001/tenant-management-client" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-semibold transition-all group/btn"
                >
                  <span>Frontend Client</span>
                  <ChevronRight size={12} className="text-white/40 group-hover/btn:translate-x-0.5 transition-transform" />
                </a>
                
                <a 
                  href="https://github.com/manojhegde2001/tenant-management-api" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-semibold transition-all group/btn"
                >
                  <span>Backend API</span>
                  <ChevronRight size={12} className="text-white/40 group-hover/btn:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
