import React, { useEffect, useState } from 'react';
import { Users, ShieldCheck, MapPin, UserCheck } from 'lucide-react';
import { getDashboardStats } from '../services/dashboardService';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: <Users size={24} />, color: 'text-primary bg-primary/10' },
    { label: 'Active Users', value: stats?.activeUsers || 0, icon: <UserCheck size={24} />, color: 'text-success bg-success/10' },
    { label: 'Total Roles', value: stats?.totalRoles || 0, icon: <ShieldCheck size={24} />, color: 'text-accent bg-accent/10' },
    { label: 'Total Sites', value: stats?.totalSites || 0, icon: <MapPin size={24} />, color: 'text-warning bg-warning/10' },
  ];

  return (
    <div className="fade-in">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-text-main">Dashboard</h1>
        <p className="text-text-muted">Overview of your tenant infrastructure.</p>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(idx => (
            <div key={idx} className="h-32 bg-surface rounded-xl border border-border shadow-sm flex flex-col justify-center p-6 animate-pulse">
              <div className="h-4 bg-background w-24 mb-4 rounded"></div>
              <div className="h-8 bg-background w-12 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {statCards.map((card, idx) => (
            <div key={idx} className="card p-6 flex items-center justify-between hover:shadow-md transition-shadow group cursor-default">
              <div>
                <p className="text-sm font-semibold text-text-muted mb-2 tracking-wide uppercase">{card.label}</p>
                <h3 className="text-3xl font-black text-text-main group-hover:text-primary transition-colors">{card.value}</h3>
              </div>
              <div className={`p-4 rounded-full ${card.color} transition-transform group-hover:scale-110`}>
                {card.icon}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Placeholder for charts/recent activity */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card h-80 flex flex-col items-center justify-center text-text-muted border-dashed border-2 bg-transparent hover:bg-surface transition-colors">
          <MapPin size={48} className="mb-4 text-border" />
          <p className="font-semibold">Chart Placeholder: User Growth</p>
        </div>
        <div className="card h-80 flex flex-col items-center justify-center text-text-muted border-dashed border-2 bg-transparent hover:bg-surface transition-colors">
          <ShieldCheck size={48} className="mb-4 text-border" />
          <p className="font-semibold">Chart Placeholder: Site Distribution</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
