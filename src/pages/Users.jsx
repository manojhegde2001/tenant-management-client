import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit2, UserX, UserCheck, Mail, Shield, User as UserIcon } from 'lucide-react';
import { getUsers, createUser, updateUser, deactivateUser as toggleUserStatus } from '../services/userService';
import { getRoles } from '../services/roleService';
import Table from '../components/UI/Table';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import Input, { Select } from '../components/UI/Input';
import Badge from '../components/UI/Badge';
import Card from '../components/UI/Card';
import { toast } from 'react-hot-toast';
import usePermission from '../hooks/usePermission';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useState({ page: 1, limit: 10, search: '' });
  const [pagination, setPagination] = useState({ pages: 1, current: 1, limit: 10, total: 0 });
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: '', status: 'active' });
  
  const { hasPermission } = usePermission();
  const canWrite = hasPermission('WRITE_USERS');

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getUsers(params);
      setUsers(data.users);
      setPagination({ 
        pages: data.pages, 
        current: data.page,
        limit: data.limit,
        total: data.total
      });
      
      const roleData = await getRoles();
      setRoles(roleData);
    } catch (err) {
      toast.error('Failed to sync user data');
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
        password: '',
        role: user.role?._id || '',
        status: user.status
      });
    } else {
      setEditUser(null);
      setFormData({ name: '', email: '', password: '', role: '', status: 'active' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editUser) {
        await updateUser(editUser._id, formData);
        toast.success('User updated successfully');
      } else {
        await createUser(formData);
        toast.success('New user created');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save record');
    }
  };

  const handleToggleStatus = async (user) => {
    const isActivating = user.status === 'inactive';
    const confirmMessage = isActivating 
      ? 'Activate this user account?' 
      : 'Deactivate this user? They will lose all system access immediately.';

    if (window.confirm(confirmMessage)) {
      try {
        await toggleUserStatus(user._id);
        toast.success(`User ${isActivating ? 'activated' : 'deactivated'}`);
        fetchData();
      } catch (err) {
        toast.error('Operation failed');
      }
    }
  };

  const columns = [
    {
      header: '#',
      render: (_, idx) => (
        <span className="text-[10px] font-bold text-text-muted/50 font-mono">
          {((pagination.current - 1) * params.limit + idx + 1).toString().padStart(2, '0')}
        </span>
      )
    },
    { 
      header: 'Identity', 
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-text-muted font-bold border border-border">
            {row.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-text-main">{row.name}</span>
            <span className="text-xs text-text-muted flex items-center gap-1">
              <Mail size={12} /> {row.email}
            </span>
          </div>
        </div>
      )
    },
    { 
      header: 'Role & Access', 
      render: (row) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-text-main">
            <Shield size={14} className="text-primary" />
            {row.role?.name || 'Unassigned'}
          </div>
          <Badge variant="primary" className="w-fit text-[9px] px-1.5">System Policy</Badge>
        </div>
      )
    },
    { 
      header: 'Status', 
      render: (row) => (
        <Badge variant={row.status === 'active' ? 'success' : 'error'}>
          {row.status}
        </Badge>
      )
    },
    { 
      header: 'Actions', 
      render: (row) => (
        <div className="flex gap-1 justify-end">
          {canWrite && (
            <>
              <Button variant="ghost" size="icon" onClick={() => handleOpenModal(row)} title="Edit Profile">
                <Edit2 size={16} />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className={row.status === 'active' ? 'hover:text-error' : 'hover:text-success'} 
                onClick={() => handleToggleStatus(row)} 
                title={row.status === 'active' ? 'Deactivate' : 'Activate'}
              >
                {row.status === 'active' ? <UserX size={16} /> : <UserCheck size={16} />}
              </Button>
            </>
          )}
          {!canWrite && (
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest px-2">Read Only</span>
          )}
        </div>
      )
    },
  ];

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-text-main tracking-tight">System Identities</h2>
          <p className="text-sm text-text-muted mt-1 font-medium">Manage corporate identities and role-based access control policies.</p>
        </div>
        {canWrite && (
          <Button onClick={() => handleOpenModal()} className="shadow-lg shadow-primary/10">
            <Plus size={18} /> Add New Identity
          </Button>
        )}
      </header>

      <Card className="p-4 border-none shadow-sm ring-1 ring-border bg-white">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, email, or role..." 
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
            value={params.search}
            onChange={(e) => setParams({ ...params, search: e.target.value, page: 1 })}
          />
        </div>
      </Card>

      <Card className="p-0 border-none shadow-sm ring-1 ring-border overflow-hidden bg-white">
        <Table columns={columns} data={users} loading={loading} emptyMessage="No system users found matching your criteria." />
        
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50/50 border-t border-border">
          <div className="flex items-center gap-6 text-text-muted">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
                Per Page
              </span>
              <select 
                className="bg-white border-2 border-slate-100 rounded-lg px-2 py-1 text-[11px] font-black text-text-main focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all cursor-pointer"
                value={params.limit}
                onChange={(e) => setParams({ ...params, limit: parseInt(e.target.value), page: 1 })}
              >
                {[5, 10, 25, 50].map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
            <div className="h-4 w-[2px] bg-slate-200 hidden sm:block"></div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest leading-none">
                {pagination.current} / {pagination.pages} PAGES • {pagination.total} TOTAL
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="secondary" 
              size="sm"
              className="px-4 h-8 text-[11px] font-bold uppercase tracking-widest"
              disabled={pagination.current === 1}
              onClick={() => setParams({ ...params, page: pagination.current - 1 })}
            >
              Prev
            </Button>
            <Button 
              variant="secondary" 
              size="sm"
              className="px-4 h-8 text-[11px] font-bold uppercase tracking-widest"
              disabled={pagination.current === pagination.pages}
              onClick={() => setParams({ ...params, page: pagination.current + 1 })}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editUser ? 'Modify Identity Profile' : 'Provision New Identity'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input 
              label="Full Legal Name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Alexander Pierce"
            />
            <Input 
              label="Corporate Email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="pierce@company.com"
            />
          </div>

          {!editUser && (
            <Input 
              label="Initialization Password"
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Set a secure temporary password"
            />
          )}

          <Select 
            label="Access Role"
            required
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          >
            <option value="">Choose a security role</option>
            {roles.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
          </Select>
          
          <div className="pt-6 border-t border-border flex justify-end gap-3">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="px-8 shadow-md">
              {editUser ? 'Commit Changes' : 'Provision Account'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Users;
