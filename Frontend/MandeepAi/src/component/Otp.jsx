import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { Mail, ShieldCheck, ArrowRight, RefreshCw, Cpu } from 'lucide-react';

export default function Otp() {
    const navigate = useNavigate();
    const location = useLocation();
    const cardRef = useRef(null), orb1Ref = useRef(null), orb2Ref = useRef(null);
    const email = location.state?.email;
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [timer, setTimer] = useState(300);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.to(orb1Ref.current, { y: 30, x: 15, duration: 4, repeat: -1, yoyo: true, ease: 'sine.inOut' });
            gsap.to(orb2Ref.current, { y: -25, x: -20, duration: 5, repeat: -1, yoyo: true, ease: 'sine.inOut' });
            gsap.fromTo(cardRef.current, { opacity: 0, scale: 0.9, y: 30 }, { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'back.out(1.2)' });
        });
        return () => ctx.revert();
    }, []);

    useEffect(() => {
        if (timer <= 0) return;
        const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
        return () => clearInterval(interval);
    }, [timer]);

    const formatTime = () => {
        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleOtpChange = (e) => {
        const value = e.target.value;
        if (!/^\d*$/.test(value) || value.length > 6) return;
        setOtp(value);
        setError('');
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!email) {
            setError('Email not found. Please register again.');
            return;
        }

        if (otp.length !== 6) {
            setError('Please enter a valid 6 digit OTP.');
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/user/verify-otp`,
                { email, otp },
                { withCredentials: true }
            );
            console.log('OTP Response:', response.data);
            setSuccess('OTP verified successfully!');
            setTimeout(() => navigate('/'), 1000);
        } catch (error) {
            console.log('OTP Error:', error);
            setError(error.response?.data?.message || 'Invalid or expired OTP.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setError('');
        setSuccess('');

        if (!email) {
            setError('Email not found. Please register again.');
            return;
        }

        try {
            setResendLoading(true);
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/user/resend-otp`,
                { email },
                { withCredentials: true }
            );
            console.log('Resend OTP:', response.data);
            setSuccess('New OTP has been sent to your email.');
            setTimer(300);
            setOtp('');
        } catch (error) {
            console.log('Resend OTP Error:', error);
            setError(error.response?.data?.message || 'Unable to resend OTP.');
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950 pointer-events-none" />
            <div ref={orb1Ref} className="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
            <div ref={orb2Ref} className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

            <div ref={cardRef} className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl shadow-indigo-950/50 relative z-10">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2.5 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                            <Cpu className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-300 to-violet-400 bg-clip-text text-transparent">mandeepAi</span>
                    </div>
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
                            <ShieldCheck className="w-8 h-8 text-indigo-400" />
                        </div>
                    </div>
                    <h2 className="text-xl font-semibold">Verify Your Email</h2>
                    <p className="text-sm text-slate-400 mt-2">Enter the 6-digit OTP sent to</p>
                    <p className="text-sm text-indigo-400 mt-1 break-all">{email || 'your email'}</p>
                </div>

                {error && <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">{error}</div>}
                {success && <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm text-center">{success}</div>}

                <form onSubmit={handleVerifyOtp} className="space-y-5">
                    <div>
                        <label className="block text-xs font-medium text-slate-300 mb-2">Enter OTP</label>
                        <div className="relative">
                            <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input type="text" inputMode="numeric" autoComplete="one-time-code" value={otp} onChange={handleOtpChange} placeholder="000000" maxLength={6} className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700/80 rounded-xl text-center tracking-[0.5em] text-lg font-semibold text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
                        </div>
                    </div>

                    <div className="text-center">
                        {timer > 0 ? (
                            <p className="text-xs text-slate-400">OTP expires in <span className="text-indigo-400 font-semibold">{formatTime()}</span></p>
                        ) : (
                            <p className="text-xs text-red-400">OTP has expired.</p>
                        )}
                    </div>

                    <button type="submit" disabled={loading || otp.length !== 6} className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-sm shadow-lg shadow-indigo-600/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group">
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Verifying...
                            </>
                        ) : (
                            <>
                                <span>Verify OTP</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="text-center mt-6">
                    <p className="text-xs text-slate-400 mb-3">Didn't receive the OTP?</p>
                    <button type="button" onClick={handleResendOtp} disabled={resendLoading || timer > 0} className="inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 disabled:text-slate-600 disabled:cursor-not-allowed transition-colors">
                        <RefreshCw className={`w-4 h-4 ${resendLoading ? 'animate-spin' : ''}`} />
                        {resendLoading ? 'Sending...' : 'Resend OTP'}
                    </button>
                </div>

                <div className="text-center mt-5">
                    <button type="button" onClick={() => navigate('/register')} className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
                        ← Back to registration
                    </button>
                </div>
            </div>
        </div>
    );
}