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
import { setSocket } from "./redux/socketSlice";
import { setOnlineUsers } from "./redux/chatSlice";
import { setLikeNotification } from "./redux/RealtimeNotification";

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <Mainlayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/profile/:id",
        element: <Profile />,
      },
      {
        path: "/account/edit",
        element: <EditProfile />,
      },
      {
        path: "/chat",
        element: <ChatPage />,
      },
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
  const { socket } = useSelector((state) => state.socketio);

 
  useEffect(() => {
    if (user) {
      const socketio = io("http://localhost:8000", {
        query: {
          userId: user?._id,
        },
        transports: ["websocket"],
      });

//  socketio.on("connect", () => {
//   console.log(socketio)
//       console.log("Socket connected:", socketio.connected); // will be true
//     });


      dispatch(setSocket(socketio));

      // Listen all the events related to socket connection
      socketio.on("getOnlineUsers", (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });
     
       socketio.on("notification", (notification) => {
         dispatch(setLikeNotification(notification));
       });

      return () => {
        socketio.close();
        dispatch(setSocket(null));
      };
    } else if (socket) {
      socket?.close();
      dispatch(setSocket(null));
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
