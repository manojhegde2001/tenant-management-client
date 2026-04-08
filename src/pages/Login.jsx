import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/UI/Button';
import { LogIn } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const result = await login(email, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 flex-col gap-8">
      <div className="text-center">
        <h1 className="text-4xl font-black premium-gradient bg-clip-text text-transparent uppercase tracking-tighter mb-2">
          Tenant Hub
        </h1>
        <p className="text-text-muted">Enterprise Resource Management</p>
      </div>

      <div className="card w-full max-w-md p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Login to your account</h2>
        
        {error && (
          <div className="mb-6 p-3 bg-error/10 border border-error/20 text-error text-sm rounded-lg text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-text-muted mb-1.5">Email Address</label>
            <input 
              type="email" 
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-text-muted mb-1.5">Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full mt-6 py-3" 
            disabled={loading}
          >
            <LogIn size={20} />
            {loading ? 'Authenticating...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-xs text-text-muted">
            Internal Management System. Unauthorized access is prohibited.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
