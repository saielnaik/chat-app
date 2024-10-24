import React, { useEffect, useState } from 'react';
import Logout from './Logout'


export default function Contacts({ contacts, currentUser, setCurrentChat }) { 
    const [currentUserName, setCurrentUserName] = useState(undefined);
    const [currentUserImage, setCurrentUserImage] = useState(undefined);
    const [currentSelected, setCurrentSelected] = useState(undefined);

    useEffect(() => {
        if (currentUser) {
            setCurrentUserName(currentUser.username);
            setCurrentUserImage(currentUser.avatarImage);
        }
    }, [currentUser]);

    const changeCurrentChat = (index, contact) => {
        setCurrentSelected(index);
        setCurrentChat(contact);
    };

    return (
        <div className="flex flex-col h-full">
            <div className="p-4">
                <h2 className="text-white text-2xl font-bold">CHIT <span className='text-blue-600'> WIT</span></h2>
            </div>

            <div className="flex-grow overflow-y-auto">
                {Array.isArray(contacts) && contacts.length > 0 ? (
                    contacts.map((contact, index) => {
                        return (
                            <div
                                className={`flex items-center space-x-4 p-4 cursor-pointer ${
                                    index === currentSelected ? 'bg-[#35455c]' : ''
                                }`}
                                key={index}
                                onClick={() => changeCurrentChat(index, contact)} 
                            >
                                <img
                                    src={contact.avatarImage ? `data:image/svg+xml;base64,${contact.avatarImage}` : '/path/to/default/avatar.png'} 
                                    alt="avatar"
                                    className="w-10 h-10 rounded-full"
                                />
                                <div className="text-white">
                                    <h3>{contact.username || 'Unknown User'}</h3>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-[#fbcbfb] p-4">No contacts available.</p>
                )}
            </div>

            <div className="bg-[#22262e] p-4 flex items-center ">
                <img
                    src={currentUserImage ? `data:image/svg+xml;base64,${currentUserImage}` : '/path/to/default/avatar.png'}
                    alt="avatar"
                    className="w-12 h-12 rounded-full"
                />
                <div className="text-white pl-3">
                    <h3>{currentUserName || 'Current User'}</h3>
                </div>
                <div className="ml-auto">
                    <Logout />
                </div>
            </div>

        </div>
    );
}
