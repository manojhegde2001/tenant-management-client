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
    { header: 'Site Name', key: 'name', render: (row) => (
      <div className="flex items-center gap-2 font-bold">
        <MapPin size={16} className="text-accent" />
        {row.name}
      </div>
    )},
    { header: 'Location', key: 'location' },
    { header: 'Status', render: (row) => (
      <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
        row.status === 'active' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
      }`}>
        {row.status}
      </span>
    )},
    { header: 'Actions', render: (row) => (
      <div className="flex gap-2">
        <button onClick={() => handleOpenModal(row)} className="p-1.5 hover:bg-primary/10 text-primary rounded">
          <Edit2 size={16} />
        </button>
        <button onClick={() => handleDelete(row._id)} className="p-1.5 hover:bg-error/10 text-error rounded">
          <Trash2 size={16} />
        </button>
      </div>
    )},
  ];

  return (
    <div className="fade-in">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text-main">Sites</h1>
          <p className="text-text-muted">Manage physical locations and facility status.</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus size={20} /> Add New Site
        </Button>
      </header>

      <div className="card shadow-lg p-0 border-none overflow-hidden">
        <Table columns={columns} data={sites} loading={loading} />
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editSite ? 'Edit Site' : 'Add New Site'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-text-muted uppercase mb-1">Site Name</label>
            <input 
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. London Office"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-text-muted uppercase mb-1">Location / Address</label>
            <input 
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. 123 Tech Square"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-text-muted uppercase mb-1">Status</label>
            <select 
              className="w-full p-3 border border-border rounded-xl bg-surface"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          
          <Button type="submit" className="w-full py-3 mt-4">
            {editSite ? 'Update Site' : 'Create Site'}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default Sites;
