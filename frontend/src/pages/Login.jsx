import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { loginRoute } from '../utils/APIRoutes';
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: "",
    password: "",
  });

  const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    pauseOnHover: true,
    theme: "dark",
  };

  useEffect(() => {
    if(localStorage.getItem('chat-app-user')){
      navigate('/');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (handleValidation()) {
      const { username, password } = values;
      try {
        const { data } = await axios.post(loginRoute, { username, password });

        if (data.status === false) {
          toast.error(data.msg, toastOptions);
        }
        if (data.status === true) {
          localStorage.setItem('chat-app-user', JSON.stringify(data.user));
          navigate("/");
        }
      } catch (error) {
        toast.error("Login failed. Please try again.", toastOptions);
        console.error("Error:", error);
      }
    }
  };

  const handleValidation = () => {
    const { username, password } = values;

    if (username === "" || password === "") {
      toast.error("User Name and Password Required", toastOptions);
      return false;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.", toastOptions);
      return false;
    }

    return true;
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-[#3a3f46]">
        <div className="w-full max-w-md p-6 bg-[#22262e] shadow-lg rounded-lg"> 
          <div>
            <p className="text-3xl font-bold text-center text-[#ffffff] pb-5">Login</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input 
              type="text" 
              name="username" 
              placeholder="Username" 
              onChange={handleChange} 
              className="w-full p-3 border border-[#5d6571] bg-[#3a3f46] text-white rounded-md"
            />
            <input 
              type="password" 
              name="password" 
              placeholder="Password" 
              onChange={handleChange} 
              className="w-full p-3 border border-[#5d6571] bg-[#3a3f46] text-white rounded-md"
            />
            <button 
              type="submit" 
              className="w-full bg-[#3080ed] text-white p-3 rounded-lg shadow-md hover:bg-[#9b6bfb] transition-all duration-300"
            >
              Login
            </button>
            <p className="text-center text-white">
              Don't have an account?{" "}
              <Link to="/register">
                <span className="font-bold text-[#3080ed] hover:underline">Signup</span>
              </Link>
            </p>
          </form>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
