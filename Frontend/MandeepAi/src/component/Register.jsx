import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import axios from 'axios';
import {
    User, Mail, Phone, Lock, Eye, EyeOff,
    Camera, Cpu, ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const navigate = useNavigate();

    const cardRef = useRef(null);
    const itemsRef = useRef([]);
    const orb1Ref = useRef(null);
    const orb2Ref = useRef(null);

    const [showPassword, setShowPassword] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        password: ''
    });

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.to(orb1Ref.current, {
                y: 30, x: 15, duration: 4,
                repeat: -1, yoyo: true,
                ease: 'sine.inOut'
            });

            gsap.to(orb2Ref.current, {
                y: -25, x: -20, duration: 5,
                repeat: -1, yoyo: true,
                ease: 'sine.inOut'
            });

            const tl = gsap.timeline({
                defaults: { ease: 'power3.out' }
            });

            tl.to(cardRef.current, {
                opacity: 1,
                scale: 1,
                duration: 0.8,
                ease: 'back.out(1.2)'
            }).fromTo(
                itemsRef.current,
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.4,
                    stagger: 0.07
                },
                '-=0.4'
            );
        });

        return () => ctx.revert();
    }, []);

    const addToRefs = (el) => {
        if (el && !itemsRef.current.includes(el)) {
            itemsRef.current.push(el);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            setError('Image size must be less than 5MB');
            return;
        }

        setImage(file);
        setError('');

        const reader = new FileReader();

        reader.onloadend = () => {
            setImagePreview(reader.result);

            gsap.fromTo(
                '#avatar-preview',
                { scale: 0.8 },
                {
                    scale: 1,
                    duration: 0.4,
                    ease: 'back.out(2)'
                }
            );
        };

        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError('');
        setSuccess('');

        if (!image) {
            setError('Please select your profile image');
            return;
        }

        try {
            setLoading(true);

            const data = new FormData();

            data.append('name', formData.name);
            data.append('email', formData.email);
            data.append('mobile', formData.mobile);
            data.append('password', formData.password);
            data.append('image', image);

            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/user/register`,
                data,
                { withCredentials: true }
            );

            console.log('Register Response:', response.data);

            setSuccess(
                'Registration successful. OTP sent to your email.'
            );

            setTimeout(() => {
                navigate('/verify-otp', {
                    state: {
                        email: formData.email
                    }
                });
            }, 1000);

        } catch (error) {
            console.log('Register Error:', error);

            setError(
                error.response?.data?.message ||
                'Registration failed. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans antialiased">

            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950 pointer-events-none" />

            <div
                ref={orb1Ref}
                className="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"
            />

            <div
                ref={orb2Ref}
                className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-600/15 rounded-full blur-3xl pointer-events-none"
            />

            <div
                ref={cardRef}
                className="opacity-0 scale-95 w-full max-w-lg bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl shadow-indigo-950/50 relative z-10"
            >

                <div ref={addToRefs} className="text-center mb-6">
                    <div className="inline-flex items-center gap-2.5 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                            <Cpu className="w-5 h-5 text-white" />
                        </div>

                        <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-300 to-violet-400 bg-clip-text text-transparent">
                            mandeepAi
                        </span>
                    </div>

                    <h2 className="text-xl font-semibold text-slate-100">
                        Create an Account
                    </h2>

                    <p className="text-xs text-slate-400 mt-1">
                        Join the next-gen AI platform
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm text-center">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">

                    <div ref={addToRefs} className="flex flex-col items-center justify-center">
                        <label className="block text-xs font-medium text-slate-300 mb-2">
                            Profile Picture
                        </label>

                        <div className="relative group cursor-pointer">
                            <div
                                id="avatar-preview"
                                className="w-20 h-20 rounded-full border-2 border-dashed border-indigo-500/50 group-hover:border-indigo-400 flex items-center justify-center bg-slate-800/60 overflow-hidden transition-all duration-300 shadow-inner"
                            >
                                {imagePreview ? (
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <Camera className="w-6 h-6 text-slate-400 group-hover:scale-110 transition-transform duration-200" />
                                )}
                            </div>

                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                        </div>

                        <span className="text-[10px] text-slate-400 mt-1">
                            Upload Your Profile (Max 5MB)
                        </span>
                    </div>

                    <div ref={addToRefs}>
                        <label htmlFor="name" className="block text-xs font-medium text-slate-300 mb-1">
                            Full Name
                        </label>

                        <div className="relative">
                            <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />

                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Kuldeep Sengar"
                                required
                                className="w-full pl-9 pr-4 py-2.5 bg-slate-800/50 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                            />
                        </div>
                    </div>

                    <div ref={addToRefs}>
                        <label htmlFor="email" className="block text-xs font-medium text-slate-300 mb-1">
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
                                className="w-full pl-9 pr-4 py-2.5 bg-slate-800/50 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                            />
                        </div>
                    </div>

                    <div ref={addToRefs}>
                        <label htmlFor="mobile" className="block text-xs font-medium text-slate-300 mb-1">
                            Mobile Number
                        </label>

                        <div className="relative">
                            <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />

                            <input
                                type="tel"
                                id="mobile"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleChange}
                                placeholder="+91 XXXXXXXXXX"
                                required
                                className="w-full pl-9 pr-4 py-2.5 bg-slate-800/50 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                            />
                        </div>
                    </div>

                    <div ref={addToRefs}>
                        <label htmlFor="password" className="block text-xs font-medium text-slate-300 mb-1">
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
                                className="w-full pl-9 pr-10 py-2.5 bg-slate-800/50 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                            >
                                {showPassword ? (
                                    <EyeOff className="w-4 h-4" />
                                ) : (
                                    <Eye className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div ref={addToRefs} className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-sm shadow-lg shadow-indigo-600/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Creating Account...
                                </>
                            ) : (
                                <>
                                    <span>Get Started</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </div>

                </form>

                <div ref={addToRefs} className="text-center mt-6 text-xs text-slate-400">
                    Already have an account?{' '}

                    <button
                        type="button"
                        onClick={() => navigate('/login')}
                        className="text-indigo-400 hover:underline font-medium"
                    >
                        Log in
                    </button>
                </div>

            </div>
        </div>
    );
}