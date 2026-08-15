import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import axios from 'axios';
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    Cpu,
    ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();

    const cardRef = useRef(null);
    const orb1Ref = useRef(null);
    const orb2Ref = useRef(null);

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    // GSAP Animation
    useEffect(() => {
        const ctx = gsap.context(() => {

            gsap.to(orb1Ref.current, {
                y: 30,
                x: 15,
                duration: 4,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });

            gsap.to(orb2Ref.current, {
                y: -25,
                x: -20,
                duration: 5,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });

            gsap.fromTo(
                cardRef.current,
                {
                    opacity: 0,
                    scale: 0.9,
                    y: 30
                },
                {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    duration: 0.8,
                    ease: 'back.out(1.2)'
                }
            );

        });

        return () => ctx.revert();
    }, []);

    // Input Change
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

        setError('');
    };

    // Login
    const handleSubmit = async (e) => {
        e.preventDefault();

        setError('');
        setSuccess('');

        try {
            setLoading(true);
            const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/user/login`,
    {
        email: formData.email,
        password: formData.password
    },
    {
        withCredentials: true
    }
);

console.log('Login Response:', response.data);

setSuccess('Login Successfully');

// Login status
localStorage.setItem('isLoggedIn', 'true');

setTimeout(() => {
    navigate('/');
}, 1000);
               

        } catch (error) {
            console.log('Login Error:', error);

            setError(
                error.response?.data?.message ||
                'Login failed. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">

            {/* Background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950 pointer-events-none" />

            {/* Orb 1 */}
            <div
                ref={orb1Ref}
                className="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"
            />

            {/* Orb 2 */}
            <div
                ref={orb2Ref}
                className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-600/15 rounded-full blur-3xl pointer-events-none"
            />

            {/* Login Card */}
            <div
                ref={cardRef}
                className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl shadow-indigo-950/50 relative z-10"
            >

                {/* Header */}
                <div className="text-center mb-8">

                    <div className="inline-flex items-center gap-2.5 mb-4">

                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                            <Cpu className="w-5 h-5 text-white" />
                        </div>

                        <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-300 to-violet-400 bg-clip-text text-transparent">
                            KS AI
                        </span>

                    </div>

                    <h2 className="text-xl font-semibold">
                        Welcome Back
                    </h2>

                    <p className="text-xs text-slate-400 mt-1">
                        Login to continue to KS AI
                    </p>

                </div>

                {/* Error */}
                {error && (
                    <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
                        {error}
                    </div>
                )}

                {/* Success */}
                {success && (
                    <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm text-center">
                        {success}
                    </div>
                )}

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    {/* Email */}
                    <div>

                        <label
                            htmlFor="email"
                            className="block text-xs font-medium text-slate-300 mb-1"
                        >
                            Email Address
                        </label>

                        <div className="relative">

                            <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />

                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="mandeep@ai.com"
                                required
                                className="w-full pl-9 pr-4 py-3 bg-slate-800/50 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                            />

                        </div>

                    </div>

                    {/* Password */}
                    <div>

                        <label
                            htmlFor="password"
                            className="block text-xs font-medium text-slate-300 mb-1"
                        >
                            Password
                        </label>

                        <div className="relative">

                            <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />

                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                                className="w-full pl-9 pr-10 py-3 bg-slate-800/50 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                            >
                                {showPassword ? (
                                    <EyeOff className="w-4 h-4" />
                                ) : (
                                    <Eye className="w-4 h-4" />
                                )}
                            </button>

                        </div>

                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        
                        className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-sm shadow-lg shadow-indigo-600/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
                    >

                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Logging in...
                            </>
                        ) : (
                            <>
                                <span>Login</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}

                    </button>

                </form>

                {/* Register */}
                <div className="text-center mt-6 text-xs text-slate-400">

                    Don't have an account?{' '}

                    <button
                        type="button"
                        onClick={() => navigate('/register')}
                        className="text-indigo-400 hover:underline font-medium"
                    >
                        Register
                    </button>

                </div>

            </div>
        </div>
    );
}
