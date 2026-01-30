import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { endpoints } from '../../services/api';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // For MVP, using simple check. In real app, receive token.
            await endpoints.login({ username, password });
            localStorage.setItem('admin_token', 'fake-token');
            navigate('/admin/dashboard');
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="min-h-screen bg-luxury-black flex items-center justify-center text-white">
            <div className="bg-white/5 p-8 rounded-2xl border border-white/10 w-full max-w-md backdrop-blur-md flex flex-col items-center">
                <img src="/src/assets/logo-v2.png" alt="Linear Academy" className="w-24 h-24 mb-6 object-contain" />
                <h2 className="text-3xl font-serif text-center mb-6 text-luxury-gold">Admin Login</h2>
                {error && <p className="text-red-400 text-center mb-4">{error}</p>}
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-400 mb-2">Username</label>
                        <input
                            type="text"
                            className="w-full bg-black/50 border border-gray-700 rounded-lg py-3 px-4 text-white focus:border-luxury-gold focus:outline-none"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-400 mb-2">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="w-full bg-black/50 border border-gray-700 rounded-lg py-3 px-4 text-white focus:border-luxury-gold focus:outline-none pr-12"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                )}
                            </button>
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-luxury-gold text-black font-bold py-3 rounded-lg hover:bg-white transition-colors">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
