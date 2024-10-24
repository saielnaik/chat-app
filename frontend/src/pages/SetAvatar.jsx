import React, { useEffect, useState } from 'react';
import loader from '../loader.gif';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { setAvatarRoute } from '../utils/APIRoutes';

export default function SetAvatar() {
    const [avatars, setAvatars] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAvatar, setSelectedAvatar] = useState(null);

    const toastOptions = {
        position: "bottom-right",
        autoClose: 5000,
        pauseOnHover: true,
        theme: "dark",
    };

    useEffect(() => {
        if(!localStorage.getItem('chat-app-user')){
          navigate('/login');
        }
      }, []);

    const setProfile = async () => {
        if (selectedAvatar === null) {
            toast.error("Please select an Avatar.", toastOptions);
            return;
        }

        const user = JSON.parse(localStorage.getItem('chat-app-user'));

        if (!user || !user._id) {
            toast.error("User not found. Please log in again.", toastOptions);
            return;
        }

        try {
            const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
                image: avatars[selectedAvatar],
            });

            if (data.isSet) {
                user.isAvatarImageSet = true;
                user.avatarImage = data.image;
                localStorage.setItem('chat-app-user', JSON.stringify(user));
                navigate('/');
            } else {
                toast.error("Error setting Avatar. Please try again.", toastOptions);
            }
        } catch (error) {
            toast.error("Failed to set Avatar. Please try again.", toastOptions);
            console.error("Error setting avatar:", error);
        }
    };

    const api = `https://api.multiavatar.com/4645646`;

    const fetchAvatars = async (retryCount = 0) => {
        const data = [];
        const maxRetries = 3;
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

        try {
            const promises = Array.from({ length: 4 }, () =>
                axios.get(`${api}/${Math.round(Math.random() * 1000)}`)
            );
            const responses = await Promise.all(promises);

            responses.forEach((response) => {
                const avatarData = btoa(response.data);
                data.push(avatarData);
            });

            setAvatars(data);
            setIsLoading(false);
        } catch (error) {
            if (error.response && error.response.status === 429 && retryCount < maxRetries) {
                const waitTime = Math.pow(2, retryCount) * 1000;
                toast.warning(`Too many requests, retrying in ${waitTime / 1000} seconds...`, toastOptions);
                await delay(waitTime);
                fetchAvatars(retryCount + 1);
            } else {
                toast.error("Failed to fetch avatars. Please try again later.", toastOptions);
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchAvatars();
    }, [api]);

    const navigate = useNavigate();

    return (
        <>
            <div className="bg-[#3a3f46] min-h-screen flex flex-col justify-center items-center">
                {isLoading ? (
                    <img src={loader} alt="Loading..." className="w-16 h-16" />
                ) : (
                    <div className="flex flex-col items-center">
                        <h2 className="text-[#ffffff] text-xl font-semibold mb-6">
                            Pick an avatar as your profile picture
                        </h2>
                        <div className="grid grid-cols-4 gap-6">
                            {avatars.map((avatar, index) => (
                                <div
                                    key={index}
                                    className={`w-24 h-24 rounded-full cursor-pointer transition-all duration-300 flex justify-center items-center ${selectedAvatar === index ? "border-4 border-[#9b6bfb]" : "border-4 border-transparent"}`}
                                    onClick={() => setSelectedAvatar(index)}
                                >
                                    <img
                                        src={`data:image/svg+xml;base64,${avatar}`}
                                        alt="avatar"
                                        className="w-full h-full rounded-full"
                                    />
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={setProfile}
                            className="mt-8 px-6 py-2 bg-[#3080ed] text-white rounded-lg shadow-md hover:bg-[#9b6bfb] transition-all duration-300"
                        >
                            Set Profile
                        </button>
                    </div>
                )}
                <ToastContainer />
            </div>
        </>
    );
}
