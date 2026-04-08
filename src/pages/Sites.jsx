import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, MapPin, Building2, Globe, Activity } from 'lucide-react';
import { getSites, createSite, updateSite, deleteSite } from '../services/siteService';
import Table from '../components/UI/Table';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import Input, { Select } from '../components/UI/Input';
import Badge from '../components/UI/Badge';
import Card from '../components/UI/Card';
import { toast } from 'react-hot-toast';

const Sites = () => {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editSite, setEditSite] = useState(null);
  const [formData, setFormData] = useState({ name: '', location: '', status: 'active' });

  const fetchSites = async () => {
    setLoading(true);
    try {
      const data = await getSites();
      setSites(data);
    } catch (err) {
      toast.error('Failed to sync facility data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSites();
  }, []);

  const handleOpenModal = (site = null) => {
    if (site) {
      setEditSite(site);
      setFormData({ name: site.name, location: site.location, status: site.status });
    } else {
      setEditSite(null);
      setFormData({ name: '', location: '', status: 'active' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editSite) {
        await updateSite(editSite._id, formData);
        toast.success('Facility updated successfully');
      } else {
        await createSite(formData);
        toast.success('New facility registered');
      }
      setIsModalOpen(false);
      fetchSites();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to sync record');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Decommission this facility? This will remove all associated telemetry endpoints.')) {
      try {
        await deleteSite(id);
        toast.success('Facility decommissioned');
        fetchSites();
      } catch (err) {
        toast.error('Operation failed');
      }
    }
  };

  const columns = [
    { 
      header: 'Facility Site', 
      render: (row) => (
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-orange-50 text-orange-600 rounded-xl border border-orange-100 shadow-sm">
            <Building2 size={20} />
          </div>
          <div>
            <span className="text-sm font-bold text-text-main tracking-tight uppercase">{row.name}</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Globe size={12} className="text-text-muted" />
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{row.location}</span>
            </div>
          </div>
        </div>
      )
    },
    { 
      header: 'Telemetry Status', 
      render: (row) => (
        <div className="flex items-center gap-2">
           <Badge variant={row.status === 'active' ? 'success' : 'error'}>
            {row.status === 'active' ? 'Operational' : 'Maintenance'}
          </Badge>
          <div className="flex items-center gap-1">
            <Activity size={12} className={row.status === 'active' ? 'text-emerald-500 animate-pulse' : 'text-slate-300'} />
            <span className="text-[10px] font-bold text-text-muted">LINK_STABLE</span>
          </div>
        </div>
      )
    },
    { 
      header: 'Actions', 
      render: (row) => (
        <div className="flex gap-1 justify-end">
          <Button variant="ghost" size="icon" onClick={() => handleOpenModal(row)} title="Manage Settings">
            <Edit2 size={16} />
          </Button>
          <Button variant="ghost" size="icon" className="hover:text-error" onClick={() => handleDelete(row._id)} title="Decommission">
            <Trash2 size={16} />
          </Button>
        </div>
      )
    },
  ];

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-text-main tracking-tight">Infrastructure Hubs</h2>
          <p className="text-sm text-text-muted mt-1 font-medium">Provision and monitor physical locations across your tenant network.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="shadow-lg shadow-primary/10">
          <Plus size={18} /> Register New Facility
        </Button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {[
          { label: 'Total Capacity', value: sites.length, icon: <Building2 />, color: 'bg-slate-50 text-slate-600' },
          { label: 'Active Links', value: sites.filter(s => s.status === 'active').length, icon: <Activity />, color: 'bg-emerald-50 text-emerald-600' },
          { label: 'Network Points', value: sites.length * 4, icon: <Globe />, color: 'bg-blue-50 text-blue-600' },
        ].map((stat, i) => (
          <Card key={i} className="p-6 border-none shadow-sm ring-1 ring-border flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-text-main">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-xl ${stat.color}`}>
              {stat.icon}
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-0 border-none shadow-sm ring-1 ring-border overflow-hidden bg-white">
        <Table columns={columns} data={sites} loading={loading} emptyMessage="No physical facilities registered." />
        <div className="px-6 py-4 bg-slate-50/50 border-t border-border">
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
            <MapPin size={12} /> Geographic distribution is currently restricted to your primary region.
          </p>
        </div>
      </Card>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editSite ? 'Configure Facility Settings' : 'Provision New Facility'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input 
            label="Facility Identifier"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Frankfurt North-1"
          />
          <Input 
            label="Geographic Location / Address"
            required
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="City, Country or Full Address"
          />
          <Select 
            label="Operational Link Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <option value="active">Active - Online</option>
            <option value="inactive">Inactive - Maintenance</option>
          </Select>
          
          <div className="pt-6 border-t border-border flex justify-end gap-3">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="px-10 shadow-lg shadow-primary/10">
              {editSite ? 'Apply Configuration' : 'Establish Provisioning'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Sites;
