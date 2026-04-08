import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit2, UserX } from 'lucide-react';
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
    { header: 'Name', key: 'name', render: (row) => (
      <div className="flex flex-col">
        <span className="font-bold">{row.name}</span>
        <span className="text-xs text-text-muted">{row.email}</span>
      </div>
    )},
    { header: 'Role', render: (row) => row.role?.name },
    { header: 'Site', render: (row) => row.site?.name },
    { header: 'Status', render: (row) => (
      <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
        row.status === 'active' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
      }`}>
        {row.status}
      </span>
    )},
    { header: 'Actions', render: (row) => (
      <div className="flex gap-2">
        <button onClick={() => handleOpenModal(row)} className="p-1.5 hover:bg-primary/10 text-primary rounded transition-colors">
          <Edit2 size={16} />
        </button>
        <button onClick={() => handleDeactivate(row._id)} className="p-1.5 hover:bg-error/10 text-error rounded transition-colors">
          <UserX size={16} />
        </button>
      </div>
    )},
  ];

  return (
    <div className="fade-in">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text-main">Users</h1>
          <p className="text-text-muted">Manage system access and permissions.</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus size={20} /> Add New User
        </Button>
      </header>

      <div className="card mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            className="pl-10 h-11"
            value={params.search}
            onChange={(e) => setParams({ ...params, search: e.target.value, page: 1 })}
          />
        </div>
      </div>

      <div className="card shadow-lg p-0 border-none overflow-hidden">
        <Table columns={columns} data={users} loading={loading} />
        
        <div className="flex items-center justify-between p-4 border-t border-border bg-background/30">
          <span className="text-xs text-text-muted">Page {pagination.current} of {pagination.pages}</span>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="px-3 py-1.5 text-xs" 
              disabled={pagination.current === 1}
              onClick={() => setParams({ ...params, page: pagination.current - 1 })}
            >
              Previous
            </Button>
            <Button 
              variant="outline" 
              className="px-3 py-1.5 text-xs" 
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
        title={editUser ? 'Edit User' : 'Add New User'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-text-muted uppercase mb-1">Full Name</label>
            <input 
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-text-muted uppercase mb-1">Email Address</label>
            <input 
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          {!editUser && (
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase mb-1">Password</label>
              <input 
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase mb-1">Role</label>
              <select 
                className="w-full p-3 border border-border rounded-xl bg-surface"
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="">Select Role</option>
                {roles.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase mb-1">Site</label>
              <select 
                className="w-full p-3 border border-border rounded-xl bg-surface"
                required
                value={formData.site}
                onChange={(e) => setFormData({ ...formData, site: e.target.value })}
              >
                <option value="">Select Site</option>
                {sites.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
            </div>
          </div>
          
          <Button type="submit" className="w-full py-3 mt-4">
            {editUser ? 'Update User' : 'Create User'}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default Users;
