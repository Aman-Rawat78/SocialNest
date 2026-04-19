import {
  Heart,
  Home,
  Instagram,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
  Video,
} from "lucide-react";
import React, { useState } from "react";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import CreatePost from "./CreatePost";
import { logout } from "@/redux/store";
import { persistStore } from 'redux-persist';
import store from '@/redux/store';


const LeftSidebar = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);


  // Logout
  const handleLogout = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/user/logout", {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(logout()); // resets all redux state
        // Purge redux-persist storage
        persistStore(store).purge();
        toast(res.data.message, { position: "top-center" });
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response.data.message || "Something went wrong");
    }
  };

  console.log(user);

  const sidebarHandler = (textType) => {
    // toast(text)
    if (textType === "logout") {
      handleLogout();
    } else if (textType === "Create") {
     setOpen(true)
    }else if (textType === "Profile") {
      navigate(`/profile/${user?._id}`);
    }else if(textType === "Home"){
      navigate("/");
    }else if(textType === "Messages"){
      navigate("/chat");  
    }
  };

  const sidebarItems = [
    {
      icon: <Home />,
      text: "Home",
    },
    {
      icon: <Search />,
      text: "Search",
    },
    {
      icon: <TrendingUp />,
      text: "Explore",
    },
    {
      icon: <Video />,
      text: "Reels",
    },
    {
      icon: <MessageCircle />,
      text: "Messages",
    },
    {
      icon: <Heart />,
      text: "Notifications",
    },
    {
      icon: <PlusSquare />,
      text: "Create",
    },
    {
      icon: (
        <Avatar>
          <AvatarImage src={user?.profilePicture} alt={user?.username} />
          <AvatarFallback>{user?.username?.charAt(0)}</AvatarFallback>
          <AvatarBadge className="bg-green-600 dark:bg-green-800" />
        </Avatar>
      ),
      text: "Profile",
    },
    {
      icon: <LogOut />,
      text: "logout",
    },
  ];

  return (
    <div className=" px-4  border-r border-gray-300 w-[16%] h-screen">
      <div className="flex flex-col">
        <div className="flex items-center gap-2 my-4">
          <Instagram className="text-2xl " />
          <span className="text-xl font-bold">Instagram</span>
        </div>
        <div>
          {sidebarItems.map((item, index) => {
            return (
              <div
                onClick={() => sidebarHandler(item.text)}
                key={index}
                className="flex items-center gap-4 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3"
              >
                {item.icon}
                <span>{item.text}</span>
              </div>
            );
          })}
        </div>
        
      </div>
      <CreatePost open={open} setOpen={setOpen}/>
    </div>
  );
};

export default LeftSidebar;
