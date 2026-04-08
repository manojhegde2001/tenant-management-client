import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, ShieldCheck } from 'lucide-react';
import { getRoles, createRole, updateRole, deleteRole } from '../services/roleService';
import Table from '../components/UI/Table';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editRole, setEditRole] = useState(null);
  const [formData, setFormData] = useState({ name: '', permissions: '' });

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const data = await getRoles();
      setRoles(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleOpenModal = (role = null) => {
    if (role) {
      setEditRole(role);
      setFormData({ name: role.name, permissions: role.permissions.join(', ') });
    } else {
      setEditRole(null);
      setFormData({ name: '', permissions: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      permissions: formData.permissions.split(',').map(p => p.trim()).filter(p => p)
    };
    
    try {
      if (editRole) {
        await updateRole(editRole._id, payload);
      } else {
        await createRole(payload);
      }
      setIsModalOpen(false);
      fetchRoles();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save role');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this role? This will fail if users are assigned.')) {
      try {
        await deleteRole(id);
        fetchRoles();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete role');
      }
    }
  };

  const columns = [
    { header: 'Role Name', key: 'name', render: (row) => (
      <div className="flex items-center gap-2 font-bold uppercase tracking-tight">
        <ShieldCheck size={16} className="text-primary" />
        {row.name}
      </div>
    )},
    { header: 'Permissions', render: (row) => (
      <div className="flex flex-wrap gap-1">
        {row.permissions.map((p, i) => (
          <span key={i} className="px-2 py-0.5 bg-background border border-border rounded text-[10px] font-mono">
            {p}
          </span>
        ))}
      </div>
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
          <h1 className="text-3xl font-bold text-text-main">Roles</h1>
          <p className="text-text-muted">Configure access policies and system permissions.</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus size={20} /> Add New Role
        </Button>
      </header>

      <div className="card shadow-lg p-0 border-none overflow-hidden">
        <Table columns={columns} data={roles} loading={loading} />
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editRole ? 'Edit Role' : 'Add New Role'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-text-muted uppercase mb-1">Role Name</label>
            <input 
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Moderator"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-text-muted uppercase mb-1">Permissions (Comma Separated)</label>
            <textarea 
              className="w-full p-3 border border-border rounded-xl bg-surface min-h-[100px]"
              value={formData.permissions}
              onChange={(e) => setFormData({ ...formData, permissions: e.target.value })}
              placeholder="READ_USERS, WRITE_USERS, DELETE_SITES"
            />
          </div>
          
          <Button type="submit" className="w-full py-3 mt-4">
            {editRole ? 'Update Role' : 'Create Role'}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default Roles;
