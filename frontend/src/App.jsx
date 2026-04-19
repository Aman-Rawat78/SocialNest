import Signup from "./components/Signup";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Mainlayout from "./components/Mainlayout";
import Home from "./components/Home";
import Login from "./components/login";
import Profile from "./components/Profile";
import React from "react";
import { useNetworkStatus } from "./lib/useNetworkStatus";
import { Offline, Online } from "./components/ui/internetStatus";
import EditProfile from "./components/EditProfile";
import ChatPage from "./components/ChatPage";

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
  const { isOnline, showBackOnline } = useNetworkStatus();

  return (
    <>
      {!isOnline && <Offline />}
      {showBackOnline && <Online />}
      
      <RouterProvider router={browserRouter} />
    </>
  );
}

export default App;
