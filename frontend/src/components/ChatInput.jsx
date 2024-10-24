import React, { useState } from 'react';
import Picker from 'emoji-picker-react';
import { IoMdSend } from 'react-icons/io';
import { MdEmojiEmotions } from 'react-icons/md';

export default function ChatInput({ handleSendMesg }) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [message, setMessage] = useState('');
  const [emojiIcon, setEmojiIcon] = useState('');

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (e) => {
    setEmojiIcon(e.emoji);
    let msg = message;
    msg += e.emoji;
    setMessage(msg);
  };

  const sendChat = (e) => {
    e.preventDefault();
    if (message.length > 0) {
      handleSendMesg(message);
      setMessage('');
    }
  };

  return (
    <div className="p-2 sm:p-4 border-t border-[#3080ed] bg-[#22262e]">
      <div className="flex items-center space-x-2 sm:space-x-4">
        <div className="relative">
          <MdEmojiEmotions
            className="text-xl sm:text-2xl text-[#ffffff] cursor-pointer hover:text-[#3080ed] transition duration-300"
            onClick={toggleEmojiPicker}
          />
          {showEmojiPicker && (
            <div className="absolute bottom-12 left-0 sm:left-auto">
              <Picker onEmojiClick={(e) => handleEmojiClick(e)} theme="dark" />
            </div>
          )}
        </div>

        <form onSubmit={(e) => sendChat(e)} className="flex-grow flex items-center space-x-2 sm:space-x-4">
          <input
            type="text"
            placeholder="Type your message..."
            className="w-full p-2 sm:p-3 rounded-lg bg-[#3a3f46] text-white focus:outline-none focus:border-[#fb6cd4] transition-all duration-300"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            type="submit"
            className="p-2 sm:p-3 rounded-full bg-[#3080ed] text-white hover:bg-[#9b6bfb] transition duration-300"
          >
            <IoMdSend className="text-lg sm:text-xl" />
          </button>
        </form>
      </div>
    </div>
  );
}
