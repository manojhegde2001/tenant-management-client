import React, { useEffect, useState } from 'react';
import { Users, ShieldCheck, UserCheck, ArrowUpRight, ArrowDownRight, Activity, Shield } from 'lucide-react';
import { getDashboardStats } from '../services/dashboardService';
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from '../components/UI/Card';
import Badge from '../components/UI/Badge';

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
    { 
      label: 'Total Users', 
      value: stats?.totalUsers || 0, 
      icon: <Users size={22} />, 
      color: 'bg-blue-50 text-blue-600',
      trend: '+12%',
      trendUp: true 
    },
    { 
      label: 'Active Users', 
      value: stats?.activeUsers || 0, 
      icon: <UserCheck size={22} />, 
      color: 'bg-emerald-50 text-emerald-600',
      trend: '+5%',
      trendUp: true 
    },
    { 
      label: 'Total Roles', 
      value: stats?.totalRoles || 0, 
      icon: <ShieldCheck size={22} />, 
      color: 'bg-violet-50 text-violet-600',
      trend: '0%',
      trendUp: true 
    },
  ];

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(idx => (
            <div key={idx} className="h-40 bg-white rounded-3xl border border-border"></div>
          ))}
        </div>
        <div className="h-96 bg-white rounded-3xl border border-border"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-black text-text-main tracking-tight">System Overview</h2>
        <p className="text-sm text-text-muted mt-1 font-medium">Real-time metrics and identity distribution across your tenant.</p>
      </header>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, idx) => (
          <Card key={idx} className="p-6 hover:shadow-xl hover:shadow-primary/5 group cursor-default border-none shadow-sm ring-1 ring-border">
            <div className="flex justify-between items-start mb-6">
              <div className={`p-3 rounded-2xl ${card.color} transition-transform group-hover:scale-110 shadow-sm`}>
                {card.icon}
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${card.trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                {card.trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {card.trend}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1">{card.label}</p>
              <h3 className="text-3xl font-black text-text-main group-hover:text-primary transition-colors">{card.value}</h3>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-sm ring-1 ring-border min-h-[300px] flex flex-col justify-center items-center text-center p-12">
          <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-primary mb-4">
             <Activity size={32} />
          </div>
          <h4 className="text-lg font-bold text-text-main">Identity Activity Telemetry</h4>
          <p className="text-sm text-text-muted max-w-sm mt-2">
            Automated monitoring of identity provisioning and role assignments is currently active.
          </p>
        </Card>

        <Card className="border-none shadow-sm ring-1 ring-border min-h-[300px] flex flex-col justify-center items-center text-center p-12">
          <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-violet-600 mb-4">
             <Shield size={32} />
          </div>
          <h4 className="text-lg font-bold text-text-main">Security Posture</h4>
          <p className="text-sm text-text-muted max-w-sm mt-2">
            Role-based access control policies are being enforced across all corporate sessions.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
