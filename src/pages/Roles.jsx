import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, ShieldCheck, Check } from 'lucide-react';
import { getRoles, createRole, updateRole, deleteRole } from '../services/roleService';
import Table from '../components/UI/Table';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';

const PREDEFINED_PERMISSIONS = [
  { id: 'READ_USERS', label: 'View Users', desc: 'Read access to all users' },
  { id: 'WRITE_USERS', label: 'Manage Users', desc: 'Create, update, delete users' },
  { id: 'READ_ROLES', label: 'View Roles', desc: 'Read access to roles & policies' },
  { id: 'WRITE_ROLES', label: 'Manage Roles', desc: 'Create, update, delete roles' },
  { id: 'READ_SITES', label: 'View Sites', desc: 'Read access to tenant sites' },
  { id: 'WRITE_SITES', label: 'Manage Sites', desc: 'Create, update, delete sites' },
];

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editRole, setEditRole] = useState(null);
  
  // Notice permissions is now properly initialized as an array
  const [formData, setFormData] = useState({ name: '', permissions: [] });

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
      // Ensure permissions exist and are an array
      setFormData({ name: role.name, permissions: Array.isArray(role.permissions) ? role.permissions : [] });
    } else {
      setEditRole(null);
      setFormData({ name: '', permissions: [] });
    }
    setIsModalOpen(true);
  };

  const handleTogglePermission = (permId) => {
    setFormData(prev => {
      const isSelected = prev.permissions.includes(permId);
      return {
        ...prev,
        permissions: isSelected 
          ? prev.permissions.filter(p => p !== permId)
          : [...prev.permissions, permId]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      permissions: formData.permissions
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
      <div className="flex items-center gap-3 font-bold uppercase tracking-wide text-text-main">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          <ShieldCheck size={18} />
        </div>
        {row.name}
      </div>
    )},
    { header: 'Permissions Assinged', render: (row) => (
      <div className="flex flex-wrap gap-2 max-w-sm">
        {row.permissions?.map((p, i) => (
          <span key={i} className="px-2.5 py-1 bg-surface border border-border shadow-sm rounded-md text-[11px] font-mono font-medium text-text-muted">
            {p}
          </span>
        ))}
        {(!row.permissions || row.permissions.length === 0) && (
          <span className="text-sm text-text-muted italic">No permissions</span>
        )}
      </div>
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

  return (
    <div className="fade-in">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-text-main mb-1 tracking-tight">Access Roles</h1>
          <p className="text-text-muted text-sm">Configure access policies and system permissions across all sites.</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus size={18} /> Add New Role
        </Button>
      </header>

      <div className="card p-0 shadow-sm border-none overflow-hidden bg-surface">
        <Table columns={columns} data={roles} loading={loading} />
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editRole ? 'Edit Role Policy' : 'Create New Role Policy'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider">Role Name</label>
            <input 
              required
              className="w-full p-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-text-main font-medium"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Site Manager"
            />
          </div>
          
          <div className="space-y-3">
            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider">
              Matrix Permissions
            </label>
            <p className="text-xs text-text-muted mb-4">Select the exact permissions this role should inherently have.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PREDEFINED_PERMISSIONS.map(perm => {
                const isSelected = formData.permissions.includes(perm.id);
                return (
                  <div 
                    key={perm.id}
                    onClick={() => handleTogglePermission(perm.id)}
                    className={`relative flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected ? 'border-primary bg-primary/5' : 'border-border bg-surface hover:border-text-muted/30'
                    }`}
                  >
                    <div className={`mt-0.5 flex items-center justify-center w-5 h-5 rounded border flex-shrink-0 transition-colors ${
                      isSelected ? 'bg-primary border-primary' : 'bg-background border-border'
                    }`}>
                      {isSelected && <Check size={14} className="text-white" />}
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${isSelected ? 'text-primary-dark' : 'text-text-main'}`}>{perm.label}</p>
                      <p className="text-[11px] text-text-muted leading-tight mt-0.5">{perm.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="pt-4 mt-6 border-t border-border">
            <Button type="submit" className="w-full py-3">
              {editRole ? 'Update Role' : 'Create Role'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Roles;
