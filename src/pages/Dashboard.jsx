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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
          {[1, 2, 3, 4].map(idx => (
            <div key={idx} className="h-32 bg-surface rounded-2xl border border-border"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, idx) => (
            <div key={idx} className="card flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-muted mb-1">{card.label}</p>
                <h3 className="text-2xl font-black text-text-main">{card.value}</h3>
              </div>
              <div className={`p-3 rounded-xl ${card.color}`}>
                {card.icon}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Placeholder for charts/recent activity */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card h-64 flex items-center justify-center text-text-muted border-dashed">
          Chart Placeholder: User Growth
        </div>
        <div className="card h-64 flex items-center justify-center text-text-muted border-dashed">
          Chart Placeholder: Site Distribution
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
