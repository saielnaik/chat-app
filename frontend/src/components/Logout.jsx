import React from 'react'
import { IoIosLogOut } from "react-icons/io";
import { useNavigate } from 'react-router-dom';


export default function Logout() {

    const navigate = useNavigate()

    const handleClick = () => {
        localStorage.clear()
        navigate('/login');
    }
  return (
    <div className='flex items-center'>
        <button 
            onClick={handleClick} 
            className="bg-transparent text-white text-2xl p-3 hover:text-[#fb6cd4] transition-colors duration-300"
        >
            <IoIosLogOut className="w-6 h-6" />
        </button>
    </div>

  )
}
