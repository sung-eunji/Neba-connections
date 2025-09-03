'use client';

import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 여기에 실제 이메일 전송 로직을 추가할 수 있습니다
    console.log('Email:', email);
    console.log('Message:', message);
    setIsSubmitted(true);
    setEmail('');
    setMessage('');

    // 3초 후 제출 상태 초기화
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4">
              <span className="font-['Anton']">Neba</span>
              <span className="font-['Arial']">.</span>
            </h3>
            <p className="text-gray-300 mb-4">
              Connecting Fashion Possibilities to Markets Worldwide
            </p>
            <div className="space-y-2 text-gray-300">
              <p>📍 Address: Your Company Address</p>
              <p>📞 Phone: +1 (555) 123-4567</p>
              <p>🌐 Website: www.neba.com</p>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h4 className="text-xl font-semibold mb-4">Contact Us</h4>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your message here..."
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
              >
                Send Message
              </button>
            </form>

            {isSubmitted && (
              <div className="mt-4 p-3 bg-green-600 text-white rounded-md">
                Thank you! Your message has been sent successfully.
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Neba. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
