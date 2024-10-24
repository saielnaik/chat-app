import React from 'react'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Register from "./pages/Register"
import Chat from './pages/Chat';
import Login from './pages/Login';
import SetAvatar from './pages/SetAvatar';

export default function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Chat />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/avatar",
      element: <SetAvatar />,
    },
  ]);

  return (
    <RouterProvider router={router} />
  )
}
