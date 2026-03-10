import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp, Video } from "lucide-react";
import React from "react";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"




const sidebarItems = [
  {
    icon: <Home/>,
    text: "Home",
  },
  {
    icon: <Search/>,
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
    text: "MessagesCircle",
  },
  {
    icon: <Heart />,
    text: "Notifications",
  },
  {
    icon: <PlusSquare/>,
    text: "Create",
  },
  {
    icon: (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
      <AvatarBadge className="bg-green-600 dark:bg-green-800" />
    </Avatar>
    ),
    text: "Profile"
  },
  {
    icon: <LogOut/>,
    text: "logout"
  }
];
// className="flex items-center z-10 left-0  px-4 gap-4 p-2 rounded-md border-r border-gray-300  hover:bg-gray-200 cursor-pointer"

const LeftSidebar = () => {
  return(
     <div classname="fixed top-0 z-10 left-0 px-4 gap-4 py-4 border-r border-gray-300 w-[16%] h-screen">
     <div>
        <div>
            {
         sidebarItems.map((item,index)=>{
            return(
                <div key={index} >
                    {item.icon}
                <span>{item.text}</span>
                </div>
            )
         })
    }
        </div>
     </div>

  </div>
  )
};

export default LeftSidebar;
