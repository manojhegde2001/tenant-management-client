import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, ShieldCheck, Check, Info, Lock } from 'lucide-react';
import { getRoles, createRole, updateRole, deleteRole } from '../services/roleService';
import Table from '../components/UI/Table';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import Input from '../components/UI/Input';
import Badge from '../components/UI/Badge';
import Card from '../components/UI/Card';
import { toast } from 'react-hot-toast';

const PREDEFINED_PERMISSIONS = [
  { id: 'READ_USERS', label: 'View Users', desc: 'Can read all user profiles and directory data.', category: 'Identity' },
  { id: 'WRITE_USERS', label: 'Manage Users', desc: 'Can create, update, and deactivate user accounts.', category: 'Identity' },
  { id: 'READ_ROLES', label: 'View Roles', desc: 'Can read role definitions and system policies.', category: 'Security' },
  { id: 'WRITE_ROLES', label: 'Manage Roles', desc: 'Can create and modify role permissions.', category: 'Security' },
];

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editRole, setEditRole] = useState(null);
  const [formData, setFormData] = useState({ name: '', permissions: [] });

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const data = await getRoles();
      setRoles(data);
    } catch (err) {
      toast.error('Failed to sync security roles');
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
    if (formData.permissions.length === 0) {
      toast.error('Select at least one permission');
      return;
    }
    
    try {
      if (editRole) {
        await updateRole(editRole._id, formData);
        toast.success('Security policy updated');
      } else {
        await createRole(formData);
        toast.success('New role provisioned');
      }
      setIsModalOpen(false);
      fetchRoles();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to sync record');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Revoke this role? This cannot be undone if users are actively assigned.')) {
      try {
        await deleteRole(id);
        toast.success('Role revoked');
        fetchRoles();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Operation failed');
      }
    }
  };

  const columns = [
    { 
      header: 'Security Role', 
      render: (row) => (
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-violet-50 text-violet-600 rounded-xl border border-violet-100 shadow-sm">
            <ShieldCheck size={20} />
          </div>
          <div>
            <span className="text-sm font-bold text-text-main uppercase tracking-tight">{row.name}</span>
            <div className="flex items-center gap-1 mt-0.5">
               <Badge variant="accent" className="text-[8px] py-0 px-1.5">Standard Policy</Badge>
            </div>
          </div>
        </div>
      )
    },
    { 
      header: 'Assigned Privileges', 
      render: (row) => (
        <div className="flex flex-wrap gap-1.5 max-w-md">
          {row.permissions?.map((p, i) => (
            <Badge key={i} variant="primary" className="bg-slate-50 border-slate-200 text-slate-600 lowercase font-mono">
              {p}
            </Badge>
          ))}
          {(!row.permissions || row.permissions.length === 0) && (
            <span className="text-xs text-text-muted italic">No privileges defined</span>
          )}
        </div>
      )
    },
    { 
      header: 'Actions', 
      render: (row) => (
        <div className="flex gap-1 justify-end">
          <Button variant="ghost" size="icon" onClick={() => handleOpenModal(row)} title="Edit Policy">
            <Edit2 size={16} />
          </Button>
          <Button variant="ghost" size="icon" className="hover:text-error" onClick={() => handleDelete(row._id)} title="Revoke Role">
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
          <h2 className="text-3xl font-black text-text-main tracking-tight">Access Policies</h2>
          <p className="text-sm text-text-muted mt-1 font-medium">Define and manage granular security permissions for system personas.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="shadow-lg shadow-primary/10">
          <Plus size={18} /> Add New Role
        </Button>
      </header>

      <Card className="p-0 border-none shadow-sm ring-1 ring-border overflow-hidden bg-white">
        <Table columns={columns} data={roles} loading={loading} emptyMessage="No security roles defined in the system." />
        <div className="px-6 py-3 bg-slate-50/50 border-t border-border flex items-center gap-2">
           <Info size={14} className="text-text-muted" />
           <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
             Roles are global and apply to all affiliated identities.
           </span>
        </div>
      </Card>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editRole ? 'Modify Access Policy' : 'Provision Security Role'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          <Input 
            label="Policy Designation"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Regional Manager"
            className="text-lg font-bold"
          />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
               <div>
                 <label className="block text-xs font-bold text-text-muted uppercase tracking-wider">
                   Permission Matrix
                 </label>
                 <p className="text-xs text-text-muted mt-0.5">Select the specific privileges this role should inherit.</p>
               </div>
               <Badge variant="accent">Checkbox Multi-Select</Badge>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {PREDEFINED_PERMISSIONS.map(perm => {
                const isSelected = formData.permissions.includes(perm.id);
                return (
                  <label 
                    key={perm.id}
                    className={`group relative flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                      isSelected 
                        ? 'border-primary bg-primary/5 ring-4 ring-primary/5' 
                        : 'border-slate-100 bg-white hover:border-border hover:shadow-md'
                    }`}
                  >
                    <input 
                      type="checkbox"
                      className="sr-only"
                      checked={isSelected}
                      onChange={() => handleTogglePermission(perm.id)}
                    />
                    <div className={`mt-0.5 flex items-center justify-center w-6 h-6 rounded-lg border-2 flex-shrink-0 transition-all ${
                      isSelected 
                        ? 'bg-primary border-primary shadow-lg shadow-primary/20' 
                        : 'bg-slate-50 border-border group-hover:border-slate-400'
                    }`}>
                      {isSelected && <Check size={14} className="text-white stroke-[3px]" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-bold ${isSelected ? 'text-primary' : 'text-text-main'}`}>
                          {perm.label}
                        </p>
                        <span className="text-[9px] font-black uppercase text-text-muted/50 tracking-tighter">
                          {perm.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-text-muted leading-relaxed mt-1">{perm.desc}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
          
          <div className="pt-6 border-t border-border flex items-center justify-between">
            <div className="flex items-center gap-2 text-text-muted">
               <Lock size={14} />
               <span className="text-[11px] font-medium">Encrypted on save</span>
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="px-10 shadow-lg shadow-primary/10">
                {editRole ? 'Commit Updates' : 'Confirm Provisioning'}
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Roles;
