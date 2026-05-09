import Signup from "./components/Signup";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Mainlayout from "./components/Mainlayout";
import Home from "./components/Home";
import Login from "./components/login";
import Profile from "./components/Profile";
import React, { use, useEffect } from "react";
import { useNetworkStatus } from "./lib/useNetworkStatus";
import { Offline, Online } from "./components/ui/internetStatus";
import EditProfile from "./components/EditProfile";
import ChatPage from "./components/ChatPage";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { setOnlineUsers } from "./redux/chatSlice";
import { setLikeNotification } from "./redux/RealtimeNotification";
import { useRef } from "react";
import ProtectedRoutes from "./components/ProtectedRoutes";
import SearchSidebar from "./components/SearchSidebar";

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element:<ProtectedRoutes><Mainlayout /></ProtectedRoutes>,
    children: [
      {
        path: "/",
        element:<ProtectedRoutes><Home /></ProtectedRoutes>,
      },
      {
        path: "/profile/:id",
        element: <ProtectedRoutes><Profile /></ProtectedRoutes>,
      },
      {
        path: "/account/edit",
        element: <ProtectedRoutes><EditProfile /></ProtectedRoutes>,
      },
      {
        path: "/chat",
        element: <ProtectedRoutes><ChatPage /></ProtectedRoutes>,
      },
      {
        path: "/search",
        element: <ProtectedRoutes><SearchSidebar /></ProtectedRoutes>,
      }
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/Signup",
    element: <Signup />,
  },
]);


function App() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { isOnline, showBackOnline } = useNetworkStatus();
  const socketRef = useRef(null);

  useEffect(() => {
    if (user) {
      const socketio = io("http://localhost:8000", {
        query: {
          userId: user?._id,
        },
        transports: ["websocket"],
      });
      
      socketRef.current = socketio;

      // Listen all the events related to socket connection
      socketio.on("getOnlineUsers", (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });
     
      socketio.on("notification", (notification) => {
        dispatch(setLikeNotification(notification));
      });

      return () => {
        socketio.close();
        socketRef.current = null;
      };
    } else if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
  }, [user, dispatch]);

  return (
    <>
      {!isOnline && <Offline />}
      {showBackOnline && <Online />}

      <RouterProvider router={browserRouter} />
    </>
  );
}

export default App;
