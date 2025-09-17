/**
 * @description This file defines a floating chatbot widget that provides AI-powered customer support.
 * It reads configuration from the Features directory and displays a styled chat interface.
 * The widget floats on all pages and integrates with the HeyBoss AI chatbot API for intelligent responses.
 * Includes comprehensive accessibility features with keyboard navigation and screen reader support.
 */
import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from './common/Button';

export const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState(null);

  // Refs for accessibility and focus management
  const chatInputRef = useRef(null);
  const chatButtonRef = useRef(null);
  const messagesEndRef = useRef(null);
  const chatWindowRef = useRef(null);
  const previousFocusRef = useRef(null);

  // Screen reader announcements
  const [srAnnouncement, setSrAnnouncement] = useState('');

  const announceToScreenReader = (message) => {
    setSrAnnouncement(message);
    setTimeout(() => setSrAnnouncement(''), 1000);
  };

  useEffect(() => {
    // Load chatbot configuration
    const loadConfig = async () => {
      try {
        const response = await fetch('./Features/Features.AI Chatbot.1.json');
        if (response.ok) {
          const chatbotConfig = await response.json();
          setConfig(chatbotConfig);
          // Add welcome message
          setMessages([
            {
              id: 1,
              text: "Hello! I'm here to help you with any questions about Neba Global Fashion Distribution. How can I assist you today?",
              isBot: true,
              timestamp: new Date(),
            },
          ]);
        }
      } catch (error) {
        console.error('Error loading chatbot config:', error);
      }
    };

    loadConfig();
  }, []);

  // Focus management when opening/closing chat
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement;
      // Focus input after opening
      setTimeout(() => {
        chatInputRef.current?.focus();
      }, 100);
      announceToScreenReader('Chat window opened');
    } else {
      // Return focus to chat button or previous element
      if (
        previousFocusRef.current &&
        previousFocusRef.current !== chatButtonRef.current
      ) {
        previousFocusRef.current.focus();
      } else {
        chatButtonRef.current?.focus();
      }
      announceToScreenReader('Chat window closed');
    }
  }, [isOpen]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle keyboard events for chat window
  const handleChatKeyDown = (e) => {
    // Close chat with Escape key
    if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
    }
  };

  // Handle button keyboard events
  const handleButtonKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen(!isOpen);
    }
    if (e.key === 'Escape' && isOpen) {
      e.preventDefault();
      setIsOpen(false);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !config) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    announceToScreenReader(`You said: ${currentInput}`);

    try {
      const response = await fetch('https://api.heybossai.com/v1/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          inputs: {
            system_prompt: `${config.instructions}\n\nBusiness Information: ${config.field_2}\n\nTone: ${config.field_3}`,
            user_message: currentInput,
            project_id: import.meta.env.VITE_PROJECT_ID,
          },
        }),
      });

      const data = await response.json();
      const botResponse = {
        id: Date.now() + 1,
        text:
          data.response ||
          "I apologize, but I'm having trouble responding right now. Please try contacting us directly at sungeunji@neba-connections.net or (+33) 7 83 00 79 52.",
        isBot: true,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botResponse]);
      announceToScreenReader(`Neba Assistant replied: ${botResponse.text}`);
    } catch (error) {
      console.error('Chatbot API error:', error);
      const errorResponse = {
        id: Date.now() + 1,
        text: "I apologize, but I'm having trouble responding right now. Please try contacting us directly at sungeunja@neba-connections.net or (+33) 7 83 00 79 52.",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorResponse]);
      announceToScreenReader(`Neba Assistant replied: ${errorResponse.text}`);
    } finally {
      setIsLoading(false);
      // Return focus to input after sending
      setTimeout(() => {
        chatInputRef.current?.focus();
      }, 100);
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSendKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!config) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Screen Reader Announcements */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        role="status"
      >
        {srAnnouncement}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div
          ref={chatWindowRef}
          className="chatbot-window mb-4 w-80 h-96 flex flex-col animate-slide-up motion-reduce:animate-none"
          onKeyDown={handleChatKeyDown}
          role="dialog"
          aria-modal="true"
          aria-labelledby="chat-title"
          aria-describedby="chat-description"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-slate-800 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
              </div>
              <div>
                <h3 id="chat-title" className="font-bold text-lg">
                  Neba Assistant
                </h3>
                <p className="text-xs text-white/80">Always here to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setIsOpen(false);
                }
              }}
              className="text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary rounded-lg p-2"
              aria-label="Close chat window"
              title="Close chat (Escape)"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          <div id="chat-description" className="sr-only">
            AI-powered customer support chatbot for Neba Global Fashion
            Distribution. Use Tab to navigate, Enter to send messages, Escape to
            close.
          </div>

          {/* Messages */}
          <div
            className="flex-1 p-4 overflow-y-auto space-y-3"
            role="log"
            aria-live="polite"
            aria-label="Chat conversation"
          >
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex ${
                  message.isBot ? 'justify-start' : 'justify-end'
                }`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                    message.isBot
                      ? 'bg-gray-100 text-gray-800 border border-gray-300'
                      : 'bg-secondary text-white'
                  }`}
                  role="article"
                  aria-label={`${
                    message.isBot ? 'Neba Assistant' : 'You'
                  } said`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div
                className="flex justify-start animate-fade-in motion-reduce:animate-none"
                aria-live="polite"
              >
                <div
                  className="bg-gray-100 text-gray-800 px-3 py-2 rounded-lg text-sm border border-gray-300 shadow-sm"
                  aria-label="Neba Assistant is typing"
                >
                  <div className="flex space-x-1" aria-hidden="true">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce motion-reduce:animate-pulse"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce motion-reduce:animate-pulse"
                      style={{ animationDelay: '0.1s' }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce motion-reduce:animate-pulse"
                      style={{ animationDelay: '0.2s' }}
                    ></div>
                  </div>
                  <span className="sr-only">Assistant is typing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            className="p-4 border-t border-gray-200"
            role="form"
            aria-label="Send message"
          >
            <div className="flex space-x-2">
              <label htmlFor="chat-input" className="sr-only">
                Type your message
              </label>
              <input
                id="chat-input"
                ref={chatInputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary text-sm"
                disabled={isLoading}
                aria-describedby="input-help"
                maxLength={500}
              />
              <div id="input-help" className="sr-only">
                Press Enter to send message, Shift+Enter for new line
              </div>
              <button
                onClick={sendMessage}
                onKeyDown={handleSendKeyDown}
                disabled={isLoading || !inputMessage.trim()}
                className="bg-secondary text-white px-3 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
                aria-label={`Send message${
                  inputMessage.trim()
                    ? ': ' + inputMessage.trim().substring(0, 50)
                    : ''
                }`}
                title="Send message (Enter)"
              >
                <Send className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Button */}
      <button
        ref={chatButtonRef}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleButtonKeyDown}
        className={`chatbot-button transform transition-all duration-300 ${
          isOpen ? 'rotate-180' : 'hover:scale-110'
        } motion-reduce:transform-none motion-reduce:hover:scale-100`}
        aria-label={
          isOpen
            ? 'Close chat window'
            : 'Open Neba Assistant chat for customer support'
        }
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        title={
          isOpen
            ? 'Close chat'
            : 'Open Neba Assistant - Get help with fashion distribution questions'
        }
      >
        {isOpen ? (
          <X
            className="w-6 h-6 transition-transform duration-200"
            aria-hidden="true"
          />
        ) : (
          <MessageCircle
            className="w-6 h-6 animate-pulse motion-reduce:animate-none transition-transform duration-200"
            aria-hidden="true"
          />
        )}
      </button>
    </div>
  );
};
