import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, MapPin } from 'lucide-react';
import { getSites, createSite, updateSite, deleteSite } from '../services/siteService';
import Table from '../components/UI/Table';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';

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
      console.error(err);
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
      } else {
        await createSite(formData);
      }
      setIsModalOpen(false);
      fetchSites();
    } catch (err) {
      alert('Failed to save site');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this site?')) {
      try {
        await deleteSite(id);
        fetchSites();
      } catch (err) {
        alert('Failed to delete site');
      }
    }
  };

  const columns = [
    { header: 'Site Info', key: 'name', render: (row) => (
      <div className="flex items-center gap-3 font-bold text-text-main tracking-tight">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          <MapPin size={18} />
        </div>
        <div>
          <p className="font-bold text-text-main">{row.name}</p>
          <p className="text-[11px] text-text-muted mt-0.5 font-normal">{row.location}</p>
        </div>
      </div>
    )},
    { header: 'Status', render: (row) => (
      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm ${
        row.status === 'active' ? 'bg-success/10 text-success border border-success/20' : 'bg-error/10 text-error border border-error/20'
      }`}>
        {row.status}
      </span>
    )},
    { header: 'Actions', render: (row) => (
      <div className="flex gap-2">
        <button onClick={() => handleOpenModal(row)} className="p-2 hover:bg-primary/10 text-primary border border-transparent hover:border-primary/20 rounded-lg transition-all" title="Edit">
          <Edit2 size={16} />
        </button>
        <button onClick={() => handleDelete(row._id)} className="p-2 hover:bg-error/10 text-error border border-transparent hover:border-error/20 rounded-lg transition-all" title="Delete">
          <Trash2 size={16} />
        </button>
      </div>
    )},
  ];

  const InputClass = "w-full p-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-text-main font-medium";

  return (
    <div className="fade-in">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-text-main mb-1 tracking-tight">Facility Sites</h1>
          <p className="text-text-muted text-sm">Manage physical locations and infrastructure endpoints.</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus size={18} /> Add New Site
        </Button>
      </header>

      <div className="card shadow-sm p-0 border-none justify-between overflow-hidden bg-surface">
        <Table columns={columns} data={sites} loading={loading} />
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editSite ? 'Edit Site Settings' : 'Register New Site'}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider">Site Name</label>
            <input 
              required
              className={InputClass}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. London Tech Hub"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider">Physical Address</label>
            <input 
              required
              className={InputClass}
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="123 Developer Way, London"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider">Operational Status</label>
            <select 
              className={InputClass}
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="active">Active - Online</option>
              <option value="inactive">Inactive - Offline</option>
            </select>
          </div>
          
          <div className="pt-4 mt-6 border-t border-border">
            <Button type="submit" className="w-full py-3">
              {editSite ? 'Update Site' : 'Register Site'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Sites;
