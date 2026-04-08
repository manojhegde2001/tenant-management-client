import React, { useEffect, useState } from 'react';
import { Users, ShieldCheck, MapPin, UserCheck, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
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
    { 
      label: 'Total Sites', 
      value: stats?.totalSites || 0, 
      icon: <MapPin size={22} />, 
      color: 'bg-orange-50 text-orange-600',
      trend: '+2%',
      trendUp: true 
    },
  ];

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(idx => (
            <div key={idx} className="h-40 bg-white rounded-3xl border border-border p-6 animate-pulse">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-gray-100 rounded-xl"></div>
                <div className="w-16 h-6 bg-gray-100 rounded-full"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-100 rounded w-24"></div>
                <div className="h-8 bg-gray-100 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 bg-white rounded-3xl border border-border animate-pulse"></div>
          <div className="h-80 bg-white rounded-3xl border border-border animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Activity Chart Area */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="h-full min-h-[400px] flex flex-col border-none shadow-sm ring-1 ring-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Infrastructure Growth</CardTitle>
                <CardDescription>Monthly growth of users and sites across the network.</CardDescription>
              </div>
              <Activity className="text-text-muted" size={20} />
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center p-10 border-t border-border/50">
              <div className="w-full h-full relative border-2 border-dashed border-border rounded-3xl flex flex-col items-center justify-center bg-slate-50/50">
                 <div className="p-4 bg-white rounded-full shadow-lg mb-4">
                   <Activity className="text-primary animate-pulse" size={32} />
                 </div>
                 <p className="text-sm font-bold text-text-main">Real-time Visualization</p>
                 <p className="text-xs text-text-muted mt-1 italic">Data streaming enabled. Waiting for telemetry...</p>
                 
                 {/* Visual dots grid */}
                 <div className="absolute inset-0 grid grid-cols-8 gap-1 opacity-20 pointer-events-none p-4">
                   {[...Array(64)].map((_, i) => (
                     <div key={i} className="w-1 h-1 rounded-full bg-primary/30"></div>
                   ))}
                 </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Side Panel: Recent Updates */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm ring-1 ring-border">
            <CardHeader>
              <CardTitle>System Health</CardTitle>
              <CardDescription>Status of core services and APIs.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: 'Identity API', status: 'Online', variant: 'success' },
                { name: 'Database Cluster', status: 'Healthy', variant: 'success' },
                { name: 'Cache Layer', status: 'Optimal', variant: 'success' },
                { name: 'Gateway', status: 'Degraded', variant: 'warning' },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-border">
                  <span className="text-sm font-semibold text-text-main">{s.name}</span>
                  <Badge variant={s.variant}>{s.status}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm ring-1 ring-border bg-primary text-white">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
              <CardDescription className="text-white/70">Common management tasks.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <button className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl text-[11px] font-bold text-center transition-colors border border-white/20">
                Generate Report
              </button>
              <button className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl text-[11px] font-bold text-center transition-colors border border-white/20">
                Audit Logs
              </button>
              <button className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl text-[11px] font-bold text-center transition-colors border border-white/20">
                Security Scan
              </button>
              <button className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl text-[11px] font-bold text-center transition-colors border border-white/20">
                Backup Data
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
