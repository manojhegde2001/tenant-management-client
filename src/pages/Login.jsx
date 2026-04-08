import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import { LogIn, ShieldCheck, Mail, Lock } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = await login(email, password);
    if (result.success) {
      toast.success('Login successful!');
      navigate('/');
    } else {
      toast.error(result.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-bl-[100%] z-0" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-primary/5 rounded-tr-[100%] z-0" />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl shadow-xl shadow-primary/20 mb-4 text-white">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-3xl font-black text-text-main tracking-tight">
            Tenant<span className="text-primary">Hub</span>
          </h1>
          <p className="text-sm text-text-muted mt-2 font-medium">Enterprise Access Management System</p>
        </div>

        <div className="bg-white border border-border rounded-[2rem] shadow-2xl p-8 sm:p-10">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-text-main">Welcome Back</h2>
            <p className="text-sm text-text-muted mt-1">Please enter your credentials to login</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Mail className="absolute left-4 top-[38px] text-text-muted" size={18} />
              <Input 
                label="Email Address"
                placeholder="yours@example.com"
                type="email"
                className="pl-12"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="relative">
              <Lock className="absolute left-4 top-[38px] text-text-muted" size={18} />
              <Input 
                label="Password"
                placeholder="••••••••"
                type="password"
                className="pl-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 transition-all cursor-pointer" />
                <span className="text-xs font-semibold text-text-muted group-hover:text-text-main transition-colors">Remember me</span>
              </label>
              <button type="button" className="text-xs font-bold text-primary hover:text-primary-dark transition-colors">
                Forgot password?
              </button>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-base shadow-lg shadow-primary/10" 
              isLoading={loading}
            >
              <LogIn size={20} />
              Sign in to Dashboard
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-[11px] font-bold text-text-muted uppercase tracking-widest leading-relaxed">
              Proprietary System • Authorized Access Only
            </p>
          </div>
        </div>

        <p className="text-center mt-8 text-xs text-text-muted font-medium">
          © {new Date().getFullYear()} Ada Lovelace Technologies. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
