import React from 'react';
import { v4 as uuidv4 } from "uuid";

export default function Messages({ messages, scrollRef }) {
  return (
    <div className="flex-grow overflow-y-auto p-2 sm:p-4 scrollbar-hide">
      <div className="flex flex-col space-y-2 sm:space-y-4">
        {messages.map((message, index) => (
          <div ref={scrollRef} key={uuidv4()}>
            <div key={index} className={`flex ${message.fromSelf ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`text-white p-2 sm:p-3 rounded-lg max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg ${message.fromSelf ? 'bg-[#1643826e]' : 'bg-[#1e7cff6e]'}`}
              >
                <p className="text-sm sm:text-base md:text-lg">{message.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
