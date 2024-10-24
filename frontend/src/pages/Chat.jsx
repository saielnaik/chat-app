import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { allUsers, host } from '../utils/APIRoutes';
import Contacts from '../components/Contacts';
import Welcome from '../components/Welcome';
import ChatContainer from '../components/ChatContainer';
import { io } from "socket.io-client";

export default function Chat() {
    const socket = useRef();
    const navigate = useNavigate();
    const [contacts, setContacts] = useState([]);
    const [currentUser, setCurrentUser] = useState(undefined);
    const [currentChat, setCurrentChat] = useState(undefined);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        const getCurrentUser = async () => {
            const storedUser = localStorage.getItem('chat-app-user');
            if (!storedUser) {
                navigate('/login');
            } else {
                setCurrentUser(JSON.parse(storedUser));
            }
        };
        getCurrentUser();
    }, [navigate]);

    useEffect(() => {
        if (currentUser) {
            socket.current = io(host);
            socket.current.emit("add-user", currentUser._id);
            console.log("Socket connected:", socket.current);
        }
    }, [currentUser]);

    useEffect(() => {
        const fetchContacts = async () => {
            if (currentUser) {
                if (currentUser.isAvatarImageSet) {
                    const data = await axios.get(`${allUsers}/${currentUser._id}`);
                    setContacts(data.data);
                } else {
                    navigate("/setAvatar");
                }
            }
        };
        fetchContacts();
    }, [currentUser, navigate]);

    return (
        <div className="flex h-screen bg-[#22262e]">
            <button 
                className="sm:hidden p-2 bg-blue-600 text-white fixed z-10 top-4 left-4" 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
                {isSidebarOpen ? 'Hide Contacts' : 'Show Contacts'}
            </button>

            <div
                className={`${
                    isSidebarOpen ? 'block' : 'hidden'
                } sm:block sm:w-1/4 bg-[#1e1f24] flex flex-col justify-between transition-all duration-300 ease-in-out`}
            >
                {currentUser && (
                    <Contacts 
                        contacts={contacts} 
                        currentUser={currentUser} 
                        setCurrentChat={setCurrentChat}
                    />
                )}
            </div>

            <div className="flex-grow sm:w-3/4 bg-[#2c2f33] flex flex-col">
                {currentChat === undefined ? (
                    <Welcome currentUser={currentUser} />
                ) : (
                    <ChatContainer 
                        currentUser={currentUser} 
                        currentChat={currentChat} 
                        socket={socket} 
                    />
                )}
            </div>
        </div>
    );
}
