"use client"

import { useState, useRef } from 'react';
import { Send, Image } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onSendImage: (file: File, caption?: string) => void;
  disabled?: boolean;
}

const ChatInput = ({ onSendMessage, onSendImage, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onSendImage(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white border-t border-gray-100 px-4 py-3 pb-safe">
      <div className="flex items-center gap-3">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="w-9 h-9 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full flex items-center justify-center transition-colors disabled:opacity-50 flex-shrink-0"
        >
          <Image size={16} />
        </button>
        
        <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="메시지를 입력하세요"
            disabled={disabled}
            className="flex-1 bg-transparent border-none resize-none focus:outline-none disabled:opacity-50 min-h-[20px] max-h-[80px] placeholder-gray-500 text-sm"
            rows={1}
            style={{ 
              lineHeight: '20px',
              height: '20px'
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = '20px';
              target.style.height = Math.min(target.scrollHeight, 80) + 'px';
            }}
          />
          <button
            onClick={handleSend}
            disabled={!message.trim() || disabled}
            className="w-7 h-7 bg-[#FF582A] text-white rounded-full flex items-center justify-center hover:bg-[#E54517] transition-colors disabled:opacity-50 disabled:bg-gray-300 flex-shrink-0"
          >
            <Send size={14} strokeWidth={2} />
          </button>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default ChatInput;