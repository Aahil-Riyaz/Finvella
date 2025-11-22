import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { sendMessageToGroq } from '../../services/groqService';
import { ChatMessage } from '../../types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function AIChat() {
  const { chatHistory, addChatMessage } = useApp();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isTyping, streamingContent]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSendWithStream = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isTyping) return;

    const userText = input.trim();
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userText,
      timestamp: Date.now(),
    };

    // 1. Add User Message
    addChatMessage(userMsg);
    setInput('');
    setIsTyping(true);

    let accumulatedResponse = "";
    
    // 2. Stream response from API
    await sendMessageToGroq(
      [...chatHistory, userMsg],
      (chunk) => {
        accumulatedResponse += chunk;
        setStreamingContent(accumulatedResponse);
      },
      (error) => {
        setIsTyping(false);
        setStreamingContent("");
        addChatMessage({
          id: Date.now().toString(),
          role: 'assistant',
          content: "Sorry, I encountered an error connecting to the Finvella AI server.",
          timestamp: Date.now()
        });
      }
    );

    // 3. Save AI Message to Context/DB
    if (accumulatedResponse) {
       addChatMessage({
         id: (Date.now() + 100).toString(),
         role: 'assistant',
         content: accumulatedResponse,
         timestamp: Date.now()
       });
    }
    
    setStreamingContent("");
    setIsTyping(false);
  };

  const suggestions = [
    "How can I save $500 this month?",
    "Explain compound interest",
    "Budget for a student",
    "What is an ETF?"
  ];

  return (
    <div className="flex flex-col h-full relative bg-gray-50 dark:bg-dark">
      {/* Header */}
      <div className="flex-none p-4 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-dark-card/80 backdrop-blur-md z-10 sticky top-0">
        <div className="flex items-center gap-3 justify-center">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-purple-500/20">
              ✨
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
          </div>
          <div className="text-center">
            <h2 className="font-bold text-gray-900 dark:text-white text-sm">Finvella AI</h2>
            <p className="text-xs text-indigo-500 font-medium">Finance Assistant</p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth">
        
        {chatHistory.length === 0 && !isTyping && (
           <div className="flex flex-col items-center justify-center h-full opacity-50 space-y-4 mt-10">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center text-3xl">
                👋
              </div>
              <p className="text-sm font-medium">Ask me anything about finance!</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full max-w-md px-4">
                {suggestions.map(s => (
                  <button 
                    key={s}
                    onClick={() => { setInput(s); inputRef.current?.focus(); }}
                    className="p-3 bg-white dark:bg-gray-800 rounded-xl text-xs text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
                  >
                    {s}
                  </button>
                ))}
              </div>
           </div>
        )}

        {chatHistory.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-5 py-3 shadow-sm text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-sm' 
                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-tl-sm border border-gray-100 dark:border-gray-700'
              }`}
            >
              {msg.role === 'assistant' ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]} className="prose dark:prose-invert prose-sm max-w-none">
                  {msg.content}
                </ReactMarkdown>
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}

        {/* Streaming Message */}
        {isTyping && streamingContent && (
           <div className="flex justify-start">
             <div className="max-w-[85%] md:max-w-[70%] rounded-2xl px-5 py-3 shadow-sm text-sm leading-relaxed bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-tl-sm border border-gray-100 dark:border-gray-700">
                <ReactMarkdown remarkPlugins={[remarkGfm]} className="prose dark:prose-invert prose-sm max-w-none">
                  {streamingContent}
                </ReactMarkdown>
             </div>
           </div>
        )}

        {isTyping && !streamingContent && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3 border border-gray-100 dark:border-gray-700 flex items-center gap-1">
               <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
               <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
               <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex-none p-4 bg-white dark:bg-dark-card border-t border-gray-200 dark:border-gray-800">
        <form onSubmit={handleSendWithStream} className="relative max-w-4xl mx-auto flex items-center gap-2">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Finvella..."
            className="w-full bg-gray-100 dark:bg-black/50 border-0 rounded-full pl-5 pr-12 py-3.5 text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white shadow-inner"
            disabled={isTyping}
          />
          <button 
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute right-2 p-2 bg-indigo-600 rounded-full text-white hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors"
          >
            <svg className="w-4 h-4 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
            </svg>
          </button>
        </form>
        <p className="text-[10px] text-center text-gray-400 mt-2">
          Finvella AI can make mistakes. Consider checking important financial information.
        </p>
      </div>
    </div>
  );
}