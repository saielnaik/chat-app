import React, { useEffect, useRef, useState } from 'react';
import ChatInput from './ChatInput';
import Messages from './Messages';
import axios from 'axios';
import { addMessage, getMessage } from '../utils/APIRoutes';


export default function ChatContainer({ currentUser, currentChat, socket }) {
    const [messages, setMessages] = useState([]);
    const [arrivalMessages, setArrivalMessages] = useState(null);
    const scrollRef = useRef();

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await axios.post(getMessage, {
                    from: currentUser._id,
                    to: currentChat._id,
                });
                setMessages(res.data);
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        if (currentChat) {
            fetchMessages();
        }
    }, [currentChat, currentUser._id]);

    useEffect(() => {
        if (socket.current) {
            socket.current.on("msg-revieved", (message) => {
                console.log("Received message:", message);
                setArrivalMessages({ fromSelf: false, message: message });
            });
        }
    }, [socket]);

    useEffect(() => {
        if (arrivalMessages) {
            setMessages((prev) => [...prev, arrivalMessages]);
        }
    }, [arrivalMessages]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMesg = async (message) => {
        try {
            await axios.post(addMessage, {
                from: currentUser._id,
                to: currentChat._id,
                message: message,
            });
            socket.current.emit("send-msg", {
                to: currentChat._id,
                from: currentUser._id,
                message: message,
            });

            const msgs = [...messages, { fromSelf: true, message: message }];
            setMessages(msgs);
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center p-4 border-b border-[#3080ed] bg-[#22262e]">
                <div className="flex items-center space-x-3">
                    <div className="avatar">
                        <img
                            src={
                                currentChat.avatarImage
                                    ? `data:image/svg+xml;base64,${currentChat.avatarImage}`
                                    : '/path/to/default/avatar.png'
                            }
                            alt="avatar"
                            className="w-12 h-12 rounded-full border-2 border-[#3080ed]"
                        />
                    </div>
                    <div className="username">
                        <h3 className="text-white text-lg font-semibold">
                            {currentChat.username}
                        </h3>
                    </div>
                </div>
            </div>
            <Messages messages={messages} scrollRef={scrollRef} />
            <ChatInput handleSendMesg={handleSendMesg} />
            <div ref={scrollRef} />
        </div>
    );
}
