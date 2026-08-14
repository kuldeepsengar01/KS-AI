import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

import SpeechRecognition, {
    useSpeechRecognition
} from 'react-speech-recognition';

import {
    Menu,
    User,
    Settings,
    Plus,
    Mic,
    Send,
    Sparkles,
    Volume2,
    Copy,
    Check,
    X,
    Mail,
    Phone
} from 'lucide-react';

export default function Home() {

    // ==========================================
    // STATES
    // ==========================================

    const [message, setMessage] = useState('');

    const [messages, setMessages] = useState([]);

    const [loading, setLoading] = useState(false);

    const [sidebar, setSidebar] = useState(false);

    const [profileOpen, setProfileOpen] = useState(false);

    const [profileLoading, setProfileLoading] = useState(true);

    const [chatLimit, setChatLimit] = useState(false);

    const [copiedIndex, setCopiedIndex] = useState(null);

    const [user, setUser] = useState({
        name: 'User',
        email: '',
        mobile: '',
        image: ''
    });

    const inputRef = useRef(null);

    const messagesEndRef = useRef(null);


    // ==========================================
    // SPEECH RECOGNITION
    // ==========================================

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();


    // ==========================================
    // API URL
    // ==========================================

    const API_URL = import.meta.env.VITE_API_URL;


    // ==========================================
    // GET USER PROFILE
    // ==========================================

    useEffect(() => {

        const getProfile = async () => {

            try {

                setProfileLoading(true);

                const response = await axios.get(
                    `${API_URL}/user/profile`,
                    {
                        withCredentials: true
                    }
                );

                console.log(
                    'PROFILE:',
                    response.data
                );

                const data =
                    response.data?.user ||
                    response.data;

                setUser({
                    name: data?.name || 'User',
                    email: data?.email || '',
                    mobile: data?.mobile || '',
                    image: data?.image || ''
                });

            } catch (error) {

                console.error(
                    'PROFILE ERROR:',
                    error.response?.data ||
                    error.message
                );

            } finally {

                setProfileLoading(false);

            }

        };

        getProfile();

    }, [API_URL]);


    // ==========================================
    // SCROLL TO BOTTOM
    // ==========================================

    useEffect(() => {

        messagesEndRef.current?.scrollIntoView({
            behavior: 'smooth'
        });

    }, [messages]);


    // ==========================================
    // VOICE TRANSCRIPT
    // ==========================================

    useEffect(() => {

        if (transcript) {

            setMessage(transcript);

        }

    }, [transcript]);


    // ==========================================
    // TEXT TO SPEECH
    // ==========================================

    const speakResponse = (text) => {

        if (!text) return;

        if (!window.speechSynthesis) {

            console.log(
                'Speech synthesis not supported'
            );

            return;

        }

        window.speechSynthesis.cancel();

        const speech =
            new SpeechSynthesisUtterance(text);

        // Hindi / Hinglish voice
        speech.lang = 'hi-IN';

        speech.rate = 0.95;

        speech.pitch = 1;

        speech.volume = 1;

        window.speechSynthesis.speak(
            speech
        );

    };


    // ==========================================
    // NEW CHAT
    // ==========================================

    const newChat = () => {

        setMessages([]);

        setMessage('');

        setChatLimit(false);

        setCopiedIndex(null);

        resetTranscript();

        window.speechSynthesis?.cancel();

        SpeechRecognition.stopListening();

    };


    // ==========================================
    // SEND MESSAGE
    // ==========================================

    const sendMessage = async (
        text = message
    ) => {

        if (
            !text?.trim() ||
            loading
        ) {

            return;

        }

        const cleanMessage =
            text.trim();


        // ======================================
        // USER MESSAGE
        // ======================================

        setMessages(prev => [

            ...prev,

            {
                role: 'user',
                content: cleanMessage
            }

        ]);

        setMessage('');

        resetTranscript();

        setLoading(true);


        try {

            const response =
                await axios.post(

                    `${API_URL}/user/chat`,

                    {
                        message: cleanMessage
                    },

                    {
                        withCredentials: true
                    }

                );


            console.log(
                'AI RESPONSE:',
                response.data
            );


            // ==================================
            // BACKEND RESPONSE
            // ==================================

            const aiResponse =

                response.data?.reply ||

                response.data?.message ||

                response.data?.response ||

                'Mujhe iska answer nahi mila.';


            // ==================================
            // CHECK CHAT LIMIT
            // ==================================

            const lowerResponse =
                String(
                    aiResponse
                ).toLowerCase();


            if (

                lowerResponse.includes(
                    'limit'
                ) ||

                lowerResponse.includes(
                    'quota'
                ) ||

                lowerResponse.includes(
                    'resource exhausted'
                ) ||

                lowerResponse.includes(
                    'too many requests'
                )

            ) {

                setChatLimit(true);

            }


            // ==================================
            // AI MESSAGE
            // ==================================

            setMessages(prev => [

                ...prev,

                {
                    role: 'assistant',
                    content: aiResponse
                }

            ]);


            // ==================================
            // AI VOICE
            // ==================================

            speakResponse(
                aiResponse
            );


        } catch (error) {

            console.error(
                'AI ERROR:',
                error.response?.data ||
                error.message
            );


            const errorData =
                error.response?.data;


            const errorText =

                errorData?.error ||

                errorData?.message ||

                '';


            const finalError =
                String(errorText);


            // ==================================
            // LIMIT ERROR
            // ==================================

            if (

                finalError
                    .toLowerCase()
                    .includes('limit') ||

                finalError
                    .toLowerCase()
                    .includes('quota') ||

                finalError
                    .toLowerCase()
                    .includes(
                        'resource exhausted'
                    ) ||

                finalError
                    .toLowerCase()
                    .includes('429')

            ) {

                setChatLimit(true);


                const limitMessage =
                    'Aapki AI chat limit complete ho gayi hai. Kripya New Chat par click karke dobara shuru karein.';


                setMessages(prev => [

                    ...prev,

                    {
                        role: 'assistant',
                        content: limitMessage
                    }

                ]);


                speakResponse(
                    limitMessage
                );


            } else {

                const errorMessage =
                    'Sorry, kuch problem aa gayi. Please dobara try karein.';


                setMessages(prev => [

                    ...prev,

                    {
                        role: 'assistant',
                        content: errorMessage
                    }

                ]);


                speakResponse(
                    errorMessage
                );

            }

        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // START VOICE
    // ==========================================

    const startVoice = () => {

        if (
            !browserSupportsSpeechRecognition
        ) {

            alert(
                'Speech recognition is not supported in this browser.'
            );

            return;

        }


        resetTranscript();

        setMessage('');


        SpeechRecognition.startListening({

            continuous: false,

            language: 'hi-IN'

        });

    };


    // ==========================================
    // STOP VOICE
    // ==========================================

    const stopVoice = () => {

        SpeechRecognition.stopListening();

    };


    // ==========================================
    // AUTO SEND VOICE
    // ==========================================

    useEffect(() => {

        if (

            !listening &&

            transcript &&

            !loading

        ) {

            sendMessage(
                transcript
            );

        }

    }, [listening]);


    // ==========================================
    // FORM SUBMIT
    // ==========================================

    const handleSubmit = (e) => {

        e.preventDefault();

        sendMessage();

    };


    // ==========================================
    // COPY MESSAGE
    // ==========================================

    const copyMessage = async (
        text,
        index
    ) => {

        try {

            await navigator.clipboard.writeText(
                text
            );

            setCopiedIndex(index);

            setTimeout(() => {

                setCopiedIndex(null);

            }, 1500);

        } catch (error) {

            console.error(
                'Copy Error:',
                error
            );

        }

    };


    // ==========================================
    // SPEAK MESSAGE
    // ==========================================

    const speakMessage = (text) => {

        speakResponse(text);

    };


    // ==========================================
    // PROFILE IMAGE
    // ==========================================

    const ProfileImage = ({
        size = 'w-10 h-10'
    }) => {

        if (user.image) {

            return (

                <img
                    src={user.image}
                    alt={user.name}
                    className={`${size} rounded-full object-cover border border-white/10`}
                />

            );

        }


        return (

            <div
                className={`${size} rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center`}
            >

                <User size={18} />

            </div>

        );

    };


    // ==========================================
    // UI
    // ==========================================

    return (

        <div className="min-h-screen bg-[#0b0d12] text-white flex overflow-hidden">


            {/* ================================= */}
            {/* SIDEBAR */}
            {/* ================================= */}

            <aside
                className={`fixed md:relative z-50 h-screen w-72 bg-[#11141b] border-r border-white/5 flex flex-col transition-transform duration-300 ${
                    sidebar
                        ? 'translate-x-0'
                        : '-translate-x-full md:translate-x-0'
                }`}
            >


                {/* LOGO */}

                <div className="p-4 flex items-center justify-between">

                    <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">

                            <Sparkles size={21} />

                        </div>


                        <div>

                            <h1 className="font-bold text-lg">
                                KS AI
                            </h1>

                            <p className="text-xs text-gray-500">
                                AI Assistant
                            </p>

                        </div>

                    </div>


                    <button
                        onClick={() =>
                            setSidebar(false)
                        }
                        className="md:hidden text-gray-400"
                    >

                        <X size={20} />

                    </button>

                </div>


                {/* NEW CHAT */}

                <div className="px-4">

                    <button
                        onClick={newChat}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                            chatLimit
                                ? 'bg-indigo-600 hover:bg-indigo-500'
                                : 'bg-white/5 hover:bg-white/10'
                        }`}
                    >

                        <Plus size={18} />

                        {chatLimit
                            ? 'Start New Chat'
                            : 'New Chat'}

                    </button>

                </div>


                {/* AI INFO */}

                <div className="flex-1 px-4 py-6">

                    <p className="text-xs text-gray-500 uppercase mb-4">
                        AI Assistant
                    </p>


                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">

                        <div className="flex items-center gap-3">

                            <Sparkles
                                size={20}
                                className="text-indigo-400"
                            />

                            <div>

                                <p className="text-sm font-medium">
                                    KS AI
                                </p>

                                <p className="text-xs text-gray-500">
                                    Hindi • Hinglish • English
                                </p>

                            </div>

                        </div>

                    </div>

                </div>


                {/* USER */}

                <div className="p-4 border-t border-white/5">

                    <button
                        onClick={() =>
                            setProfileOpen(true)
                        }
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5"
                    >

                        <ProfileImage
                            size="w-9 h-9"
                        />


                        <div className="flex-1 text-left">

                            <p className="text-sm font-medium">
                                {user.name}
                            </p>

                            <p className="text-xs text-gray-500">
                                Personal Account
                            </p>

                        </div>


                        <Settings
                            size={17}
                            className="text-gray-500"
                        />

                    </button>

                </div>

            </aside>


            {/* ================================= */}
            {/* MAIN */}
            {/* ================================= */}

            <main className="flex-1 min-w-0 flex flex-col h-screen">


                {/* HEADER */}

                <header className="h-16 px-4 md:px-8 flex items-center justify-between border-b border-white/5">

                    <div className="flex items-center gap-3">

                        <button
                            onClick={() =>
                                setSidebar(true)
                            }
                            className="md:hidden p-2 rounded-lg hover:bg-white/5"
                        >

                            <Menu size={21} />

                        </button>


                        <div className="flex items-center gap-2">

                            <Sparkles
                                size={19}
                                className="text-indigo-400"
                            />

                            <span className="font-semibold">
                                KS AI
                            </span>

                        </div>

                    </div>


                    {/* RIGHT PROFILE */}

                    <button
                        onClick={() =>
                            setProfileOpen(true)
                        }
                        className="rounded-full hover:ring-2 hover:ring-indigo-500/50 transition"
                    >

                        <ProfileImage />

                    </button>

                </header>


                {/* ================================= */}
                {/* CHAT AREA */}
                {/* ================================= */}

                <div className="flex-1 overflow-y-auto">


                    {messages.length === 0 ? (

                        <div className="min-h-full flex flex-col items-center justify-center px-4 pb-20">


                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center mb-6">

                                <Sparkles
                                    size={30}
                                    className="text-indigo-400"
                                />

                            </div>


                            <h2 className="text-3xl md:text-5xl font-semibold text-center bg-gradient-to-r from-white via-gray-200 to-gray-500 bg-clip-text text-transparent">

                                Hello, {user.name}

                            </h2>


                            <p className="text-gray-500 text-center mt-3 max-w-xl">

                                Main aapka personal AI assistant hoon.
                                Aap Hindi, Hinglish ya English mein mujhse baat kar sakte hain.

                            </p>

                        </div>

                    ) : (


                        <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">


                            {messages.map(
                                (msg, index) => (

                                    <div
                                        key={index}
                                        className={`flex gap-4 ${
                                            msg.role === 'user'
                                                ? 'justify-end'
                                                : 'justify-start'
                                        }`}
                                    >


                                        {/* AI ICON */}

                                        {msg.role ===
                                            'assistant' && (

                                            <div className="w-9 h-9 shrink-0 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">

                                                <Sparkles
                                                    size={17}
                                                />

                                            </div>

                                        )}


                                        {/* MESSAGE */}

                                        <div
                                            className={`max-w-[80%] ${
                                                msg.role === 'user'
                                                    ? 'bg-indigo-600 rounded-2xl rounded-br-sm px-5 py-3'
                                                    : 'bg-white/5 border border-white/5 rounded-2xl rounded-bl-sm px-5 py-4'
                                            }`}
                                        >

                                            <p className="text-sm leading-7 whitespace-pre-wrap">
                                                {msg.content}
                                            </p>


                                            {/* AI ACTIONS */}

                                            {msg.role ===
                                                'assistant' && (

                                                <div className="flex items-center gap-4 mt-4 text-gray-500">


                                                    {/* COPY */}

                                                    <button
                                                        onClick={() =>
                                                            copyMessage(
                                                                msg.content,
                                                                index
                                                            )
                                                        }
                                                        className="hover:text-white transition"
                                                        title="Copy"
                                                    >

                                                        {copiedIndex ===
                                                        index ? (

                                                            <Check
                                                                size={15}
                                                            />

                                                        ) : (

                                                            <Copy
                                                                size={15}
                                                            />

                                                        )}

                                                    </button>


                                                    {/* SPEAK */}

                                                    <button
                                                        onClick={() =>
                                                            speakMessage(
                                                                msg.content
                                                            )
                                                        }
                                                        className="hover:text-white transition"
                                                        title="Speak"
                                                    >

                                                        <Volume2
                                                            size={15}
                                                        />

                                                    </button>

                                                </div>

                                            )}

                                        </div>

                                    </div>

                                )
                            )}


                            {/* LOADING */}

                            {loading && (

                                <div className="flex items-center gap-3">

                                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">

                                        <Sparkles
                                            size={17}
                                        />

                                    </div>


                                    <div className="flex gap-1">

                                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />

                                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:150ms]" />

                                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:300ms]" />

                                    </div>

                                </div>

                            )}


                            <div
                                ref={
                                    messagesEndRef
                                }
                            />

                        </div>

                    )}

                </div>


                {/* ================================= */}
                {/* INPUT */}
                {/* ================================= */}

                <div className="px-3 md:px-8 pb-4">

                    <div className="max-w-4xl mx-auto">


                        <form
                            onSubmit={
                                handleSubmit
                            }
                            className="relative bg-[#171a22] border border-white/10 rounded-3xl shadow-2xl focus-within:border-indigo-500/40 transition"
                        >


                            <textarea
                                ref={inputRef}
                                value={message}
                                onChange={e =>
                                    setMessage(
                                        e.target.value
                                    )
                                }
                                onKeyDown={e => {

                                    if (
                                        e.key ===
                                            'Enter' &&
                                        !e.shiftKey
                                    ) {

                                        e.preventDefault();

                                        sendMessage();

                                    }

                                }}
                                rows="1"
                                placeholder="Hindi ya Hinglish mein message likho..."
                                className="w-full resize-none bg-transparent outline-none px-5 pt-4 pb-14 text-sm text-white placeholder-gray-500"
                            />


                            <div className="absolute bottom-2 left-3 right-3 flex items-center justify-end">

                                <div className="flex items-center gap-2">


                                    {/* VOICE */}

                                    <button
                                        type="button"
                                        onClick={
                                            listening
                                                ? stopVoice
                                                : startVoice
                                        }
                                        className={`p-2.5 rounded-full transition ${
                                            listening
                                                ? 'bg-red-500 text-white animate-pulse'
                                                : 'text-gray-400 hover:text-white hover:bg-white/10'
                                        }`}
                                        title={
                                            listening
                                                ? 'Stop listening'
                                                : 'Voice input'
                                        }
                                    >

                                        <Mic size={19} />

                                    </button>


                                    {/* SEND */}

                                    <button
                                        type="submit"
                                        disabled={
                                            !message.trim() ||
                                            loading
                                        }
                                        className="p-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 transition"
                                        title="Send"
                                    >

                                        <Send size={18} />

                                    </button>

                                </div>

                            </div>

                        </form>


                        <p className="text-[11px] text-center text-gray-600 mt-2">

                            KS AI Hindi, Hinglish aur English samajh sakta hai.

                        </p>

                    </div>

                </div>

            </main>


            {/* ================================= */}
            {/* PROFILE OVERLAY */}
            {/* ================================= */}

            {profileOpen && (

                <div
                    onClick={() =>
                        setProfileOpen(false)
                    }
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[90]"
                />

            )}


            {/* ================================= */}
            {/* PROFILE DRAWER */}
            {/* ================================= */}

            <aside
                className={`fixed top-0 right-0 h-screen w-full sm:w-96 bg-[#11141b] border-l border-white/10 z-[100] shadow-2xl transition-transform duration-300 ${
                    profileOpen
                        ? 'translate-x-0'
                        : 'translate-x-full'
                }`}
            >


                {/* DRAWER HEADER */}

                <div className="h-16 px-5 flex items-center justify-between border-b border-white/5">

                    <div className="flex items-center gap-2">

                        <User
                            size={18}
                            className="text-indigo-400"
                        />

                        <span className="font-semibold">
                            My Profile
                        </span>

                    </div>


                    <button
                        onClick={() =>
                            setProfileOpen(false)
                        }
                        className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white"
                    >

                        <X size={20} />

                    </button>

                </div>


                {/* PROFILE CONTENT */}

                <div className="p-6">

                    {profileLoading ? (

                        <div className="flex flex-col items-center">

                            <div className="w-28 h-28 rounded-full bg-white/10 animate-pulse" />

                            <div className="w-32 h-5 bg-white/10 rounded mt-5 animate-pulse" />

                            <div className="w-48 h-4 bg-white/10 rounded mt-3 animate-pulse" />

                        </div>

                    ) : (

                        <>


                            {/* IMAGE */}

                            <div className="flex flex-col items-center">

                                <ProfileImage
                                    size="w-28 h-28"
                                />


                                <h2 className="text-xl font-semibold mt-5">

                                    {user.name}

                                </h2>


                                <p className="text-sm text-gray-500 mt-1">

                                    Personal Account

                                </p>

                            </div>


                            {/* DETAILS */}

                            <div className="mt-10 space-y-3">


                                {/* NAME */}

                                <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4 flex items-center gap-4">

                                    <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">

                                        <User
                                            size={18}
                                            className="text-indigo-400"
                                        />

                                    </div>


                                    <div>

                                        <p className="text-xs text-gray-500">
                                            Name
                                        </p>

                                        <p className="text-sm text-gray-200 mt-1">
                                            {user.name ||
                                                'Not available'}
                                        </p>

                                    </div>

                                </div>


                                {/* EMAIL */}

                                <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4 flex items-center gap-4">

                                    <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">

                                        <Mail
                                            size={18}
                                            className="text-indigo-400"
                                        />

                                    </div>


                                    <div className="min-w-0">

                                        <p className="text-xs text-gray-500">
                                            Email
                                        </p>

                                        <p className="text-sm text-gray-200 mt-1 break-all">
                                            {user.email ||
                                                'Not available'}
                                        </p>

                                    </div>

                                </div>


                                {/* MOBILE */}

                                <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4 flex items-center gap-4">

                                    <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">

                                        <Phone
                                            size={18}
                                            className="text-indigo-400"
                                        />

                                    </div>


                                    <div>

                                        <p className="text-xs text-gray-500">
                                            Mobile
                                        </p>

                                        <p className="text-sm text-gray-200 mt-1">
                                            {user.mobile ||
                                                'Not available'}
                                        </p>

                                    </div>

                                </div>

                            </div>


                            {/* ACCOUNT */}

                            <div className="mt-8">

                                <p className="text-xs text-gray-500 uppercase mb-3">
                                    Account
                                </p>


                                <button
                                    className="w-full flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.07] hover:bg-white/[0.06] transition text-gray-300"
                                >

                                    <Settings
                                        size={18}
                                    />

                                    <span className="text-sm">
                                        Account Settings
                                    </span>

                                </button>

                            </div>

                        </>

                    )}

                </div>

            </aside>

        </div>

    );
}