import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit2, UserX, MapPin } from 'lucide-react';
import { getUsers, createUser, updateUser, deactivateUser } from '../services/userService';
import { getRoles } from '../services/roleService';
import { getSites } from '../services/siteService';
import Table from '../components/UI/Table';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useState({ page: 1, limit: 10, search: '' });
  const [pagination, setPagination] = useState({ pages: 1, current: 1 });
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: '', site: '', status: 'active' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getUsers(params);
      setUsers(data.users);
      setPagination({ pages: data.pages, current: data.page });
      
      const [roleData, siteData] = await Promise.all([getRoles(), getSites()]);
      setRoles(roleData);
      setSites(siteData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [params]);

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        password: '', // Don't show password
        role: user.role?._id || '',
        site: user.site?._id || '',
        status: user.status
      });
    } else {
      setEditUser(null);
      setFormData({ name: '', email: '', password: '', role: '', site: '', status: 'active' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editUser) {
        await updateUser(editUser._id, formData);
      } else {
        await createUser(formData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save user');
    }
  };

  const handleDeactivate = async (id) => {
    if (window.confirm('Are you sure you want to deactivate this user?')) {
      try {
        await deactivateUser(id);
        fetchData();
      } catch (err) {
        alert('Failed to deactivate user');
      }
    }
  };

  const columns = [
    { header: 'User Info', key: 'name', render: (row) => (
      <div className="flex flex-col">
        <span className="font-bold text-text-main">{row.name}</span>
        <span className="text-xs text-text-muted mt-0.5">{row.email}</span>
      </div>
    )},
    { header: 'Role', render: (row) => (
      <span className="text-sm font-medium text-text-muted bg-surface border border-border px-2 py-0.5 rounded-md">
        {row.role?.name || 'Unassigned'}
      </span>
    )},
    { header: 'Site', render: (row) => (
      <span className="text-sm text-text-muted flex items-center gap-1.5">
        <MapPin size={14} className="text-accent" />
        {row.site?.name || 'Unassigned'}
      </span>
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
        <button onClick={() => handleDeactivate(row._id)} className="p-2 hover:bg-error/10 text-error border border-transparent hover:border-error/20 rounded-lg transition-all" title="Deactivate">
          <UserX size={16} />
        </button>
      </div>
    )},
  ];

  const InputClass = "w-full p-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-text-main font-medium";

  return (
    <div className="fade-in">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-text-main mb-1 tracking-tight">System Users</h1>
          <p className="text-text-muted text-sm">Manage system access, identities, and permissions.</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus size={18} /> Add New User
        </Button>
      </header>

      <div className="card mb-6 shadow-sm p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm transition-shadow shadow-sm"
            value={params.search}
            onChange={(e) => setParams({ ...params, search: e.target.value, page: 1 })}
          />
        </div>
      </div>

      <div className="card shadow-sm p-0 border-none overflow-hidden bg-surface">
        <Table columns={columns} data={users} loading={loading} />
        
        <div className="flex items-center justify-between p-4 border-t border-border bg-background/30">
          <span className="text-xs text-text-muted font-medium">Page {pagination.current} of {pagination.pages}</span>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="px-3 py-1.5 text-xs bg-surface" 
              disabled={pagination.current === 1}
              onClick={() => setParams({ ...params, page: pagination.current - 1 })}
            >
              Previous
            </Button>
            <Button 
              variant="outline" 
              className="px-3 py-1.5 text-xs bg-surface" 
              disabled={pagination.current === pagination.pages}
              onClick={() => setParams({ ...params, page: pagination.current + 1 })}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editUser ? 'Edit User Profile' : 'Create New User'}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider">Full Name</label>
            <input 
              required
              className={InputClass}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. John Doe"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider">Email Address</label>
            <input 
              type="email"
              required
              className={InputClass}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="e.g. john@example.com"
            />
          </div>
          {!editUser && (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider">Temporary Password</label>
              <input 
                type="password"
                required
                className={InputClass}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Secure password"
              />
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider">Assigned Role</label>
              <select 
                className={InputClass}
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="">Select Role</option>
                {roles.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider">Primary Site</label>
              <select 
                className={InputClass}
                required
                value={formData.site}
                onChange={(e) => setFormData({ ...formData, site: e.target.value })}
              >
                <option value="">Select Site</option>
                {sites.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
            </div>
          </div>
          
          <div className="pt-4 mt-6 border-t border-border">
            <Button type="submit" className="w-full py-3">
              {editUser ? 'Update User' : 'Create User'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Users;
