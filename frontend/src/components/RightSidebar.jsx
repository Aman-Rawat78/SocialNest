import React from "react";
import {Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SuggestedUsers from "./SuggestedUsers";

const RightSidebar = () => {
  const {user} = useSelector((store) => store.auth);
 
  return (
    <div className="w-96 my-10 pr-32">
      <div className="flex items-center gap-2">
        <Link to={`/profile/${user?._id}`}>
          <Avatar className="h-12 w-12" >
          <AvatarImage src={user?.profilePicture} alt="post_img" />
          <AvatarFallback>{user?.username.charAt(0).toUpperCase()}</AvatarFallback>
          <AvatarBadge className="bg-green-600 dark:bg-green-800" />
        </Avatar>
        </Link>
        
        <div>
          <h1 className="font-semibold text-sm"> <Link to={`/profile/${user?._id}`}>{user?.username}</Link> </h1>
          <span className="text-sm text-muted-foreground">
            {user?.bio || "Bio here..."}
          </span>
        </div>     
      </div>

      <SuggestedUsers />
    </div>
  );
};

export default RightSidebar;
