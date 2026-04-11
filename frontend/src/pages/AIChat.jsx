import { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import ReactMarkdown from 'react-markdown';
import { IoSend, IoChatbubbleEllipses, IoPerson, IoRefreshOutline } from 'react-icons/io5';
import { toast } from 'react-toastify';
import { API_URL } from '../config';

const AIChat = () => {
    const { user } = useContext(AuthContext);
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: `Hello ${user?.name || 'there'}! I'm your VitallQ Health Assistant. How can I help you today? You can ask me about symptoms, medications, wellness tips, or general health advice.`
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${API_URL}/api/ai/chat`,
                { messages: [...messages, userMessage] },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setMessages(prev => [...prev, { role: 'assistant', content: response.data.response }]);
        } catch (error) {
            console.error('Chat error:', error);
            toast.error('Failed to get a response from the AI assistant.');
            // Remove the user's message if it failed? Or just keep it and show error.
        } finally {
            setIsLoading(false);
        }
    };

    const clearChat = () => {
        setMessages([
            {
                role: 'assistant',
                content: `Chat cleared. How can I help you now, ${user?.name || 'friend'}?`
            }
        ]);
    };

    return (
        <div className="container" style={{ maxWidth: '800px', padding: '2rem 1rem' }}>
            <div className="page-header animate-fade-in">
                <h1 className="page-title gradient-text">Health Assistant</h1>
                <p className="page-subtitle">Your personalized AI guide for health and wellness</p>
            </div>

            <div className="card glass-panel animate-slide-up" style={{ 
                height: '600px', 
                display: 'flex', 
                flexDirection: 'column',
                padding: '1.5rem',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Chat Header */}
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '1.5rem',
                    paddingBottom: '1rem',
                    borderBottom: '1px solid var(--border)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ 
                            background: 'var(--primary)', 
                            color: 'white', 
                            padding: '0.5rem', 
                            borderRadius: '12px',
                            display: 'flex'
                        }}>
                            <IoChatbubbleEllipses size={24} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>VitallQ Bot</h3>
                            <span style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: '600' }}>● Online</span>
                        </div>
                    </div>
                    <button 
                        onClick={clearChat}
                        className="btn-icon" 
                        title="Clear Chat"
                        style={{ color: 'var(--text-light)' }}
                    >
                        <IoRefreshOutline size={20} />
                    </button>
                </div>

                {/* Messages Container */}
                <div className="custom-scrollbar" style={{ 
                    flex: 1, 
                    overflowY: 'auto', 
                    padding: '0.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.5rem',
                    marginBottom: '1rem'
                }}>
                    {messages.map((msg, index) => (
                        <div key={index} style={{ 
                            display: 'flex', 
                            flexDirection: 'column',
                            alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        }}>
                            <div style={{ 
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '0.5rem',
                                maxWidth: '85%',
                                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row'
                            }}>
                                <div style={{ 
                                    width: '32px', 
                                    height: '32px', 
                                    borderRadius: '50%', 
                                    background: msg.role === 'user' ? 'var(--secondary)' : 'var(--primary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    flexShrink: 0,
                                    marginTop: '4px'
                                }}>
                                    {msg.role === 'user' ? <IoPerson size={16} /> : <IoChatbubbleEllipses size={16} />}
                                </div>
                                <div style={{ 
                                    background: msg.role === 'user' ? 'var(--primary)' : 'var(--background)',
                                    color: msg.role === 'user' ? 'white' : 'var(--text-main)',
                                    padding: '0.75rem 1.25rem',
                                    borderRadius: msg.role === 'user' ? '1.25rem 1.25rem 0.25rem 1.25rem' : '1.25rem 1.25rem 1.25rem 0.25rem',
                                    boxShadow: 'var(--shadow-sm)',
                                    fontSize: '0.95rem',
                                    lineHeight: '1.5'
                                }}>
                                    <ReactMarkdown components={{
                                        p: ({node, ...props}) => <p style={{ marginBottom: '0.5rem' }} {...props} />,
                                        ul: ({node, ...props}) => <ul style={{ marginLeft: '1.5rem', marginBottom: '0.5rem' }} {...props} />,
                                        li: ({node, ...props}) => <li style={{ marginBottom: '0.25rem' }} {...props} />
                                    }}>
                                        {msg.content}
                                    </ReactMarkdown>
                                </div>
                            </div>
                            <span style={{ 
                                fontSize: '0.7rem', 
                                color: 'var(--text-light)', 
                                marginTop: '0.25rem',
                                marginHorizontal: '40px'
                            }}>
                                {msg.role === 'assistant' ? 'AI Assistant' : 'You'}
                            </span>
                        </div>
                    ))}
                    {isLoading && (
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <div style={{ 
                                width: '32px', 
                                height: '32px', 
                                borderRadius: '50%', 
                                background: 'var(--primary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white'
                            }}>
                                <IoChatbubbleEllipses size={16} />
                            </div>
                            <div style={{ 
                                background: 'var(--background)',
                                padding: '0.75rem 1.25rem',
                                borderRadius: '1.25rem 1.25rem 1.25rem 0.25rem',
                                display: 'flex',
                                gap: '4px'
                            }}>
                                <div className="typing-dot" style={{ animationDelay: '0s' }}></div>
                                <div className="typing-dot" style={{ animationDelay: '0.2s' }}></div>
                                <div className="typing-dot" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <form onSubmit={handleSend} style={{ 
                    display: 'flex', 
                    gap: '0.75rem', 
                    padding: '1rem 0 0',
                    borderTop: '1px solid var(--border)'
                }}>
                    <input 
                        type="text" 
                        className="form-input"
                        placeholder="Type your health question..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={isLoading}
                        style={{ borderRadius: '1.5rem', paddingLeft: '1.5rem' }}
                    />
                    <button 
                        type="submit" 
                        className="btn btn-primary btn-icon"
                        disabled={isLoading || !input.trim()}
                        style={{ width: '48px', height: '48px', flexShrink: 0 }}
                    >
                        <IoSend size={20} />
                    </button>
                </form>

                {/* CSS for typing dots */}
                <style>{`
                    .typing-dot {
                        width: 6px;
                        height: 6px;
                        background: var(--text-light);
                        border-radius: 50%;
                        animation: bounce 1.4s infinite ease-in-out both;
                    }
                    @keyframes bounce {
                        0%, 80%, 100% { transform: scale(0); }
                        40% { transform: scale(1.0); }
                    }
                `}</style>
            </div>
            
            <p style={{ 
                textAlign: 'center', 
                fontSize: '0.8rem', 
                color: 'var(--text-light)', 
                marginTop: '1.5rem',
                fontStyle: 'italic'
            }}>
                Disclaimer: VitallQ Assistant provides general information only. Always consult a healthcare professional for medical diagnosis and treatment.
            </p>
        </div>
    );
};

export default AIChat;
