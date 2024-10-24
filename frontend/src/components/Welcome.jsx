import React, { useEffect, useState } from 'react';
import robot from '../robot.gif';

export default function Welcome({ currentUser }) {
    const [currentUserName, setCurrentUserName] = useState('');

    useEffect(() => {
        if (currentUser) { 
            setCurrentUserName(currentUser.username);
        }
    }, [currentUser]); 

    return (
        <div className="flex h-full items-center justify-center bg-[#3a3f46]"> 
            <div className="text-center">
                <img
                    src={robot} 
                    alt="Robot"
                    className="mx-auto mb-2 w-400 h-400"
                />
                <h1 className="text-4xl font-bold text-white">
                    Welcome, <span className="text-[#3080ed]">{currentUserName || 'User'}!</span> 
                </h1>
                <p className="text-[#b9d6ff] mt-2">Please select a chat to start messaging.</p>
            </div>
        </div>
    );
}
