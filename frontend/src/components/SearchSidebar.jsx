import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { IoIosCloseCircle } from "react-icons/io";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { IoIosClose } from "react-icons/io";
import { Link } from "react-router-dom";

const SearchSidebar = ({ onClose }) => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  useEffect(() => {
    if (search.trim()) {

      const timeout = setTimeout(() => {
        api.get(`/user/search?query=${search}`)
          .then(res => { setResults(res.data.users || []) });
      }, 300);
      return () => clearTimeout(timeout);

    } else {
      setResults([]);
    }
  }, [search]);
  

  return (
    <div className="px-4  border-r border-gray-300 w-[25%] h-screen">
      <div className=" flex items-center justify-between p-4 ">
        <div className="m-7 font-semibold text-2xl" >Search</div>
        <IoIosClose onClick={onClose} className="h-10 w-10" />
      </div>
      <div className="relative">
        <Input
          type="text"
          placeholder="Search users"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className=" flex-1 h-12 text-md  rounded-2xl focus:outline-none focus:ring-0 focus:border-transparent bg-[#F3F5F7] text:black placeholder:text-[#6A717A]"
          autoFocus

        />
        <IoIosCloseCircle onClick={() => setSearch("")} className=" absolute right-3 top-4 text-gray-500 hover:text-gray-700" />
      </div>

      <div>
        <ul>
          {
            results.map(user => (
              <Link to={`/profile/${user._id}`} key={user._id} onClick={onClose} >
              <div  key={user._id} className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.profilePicture} alt="post_img" />
                  <AvatarFallback>{user?.username?.charAt(0)?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <li className="px-4 py-2 flex-col hover:bg-gray-100 cursor-pointer">
                  <div className="flex-flex-col">
                    <div className="font-semibold text-sm">{user.username}</div>
                    <div className="text-gray-500  text-sm">{user.name}</div>
                  </div>
                </li>
              </div>
              </Link>
            ))
          }
        </ul>
      </div>
    </div>
  );
};

export default SearchSidebar;


