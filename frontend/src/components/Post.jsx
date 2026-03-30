import React, { useState } from "react";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "./ui/button";

import { FaHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";

const Post = () => {
  const [text,setText] = useState("");
  const [open, setOpen] = useState(false);

  const ChangeEventHandler = (e)=>{
    const inputText = e.target.value
    if(inputText.trim()){
      setText(inputText);
    }else{
      setText("")
    }
  }
  return (
    <div className="my-8 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
            <AvatarBadge className="bg-green-600 dark:bg-green-800" />
          </Avatar>
          <h1>username</h1>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center test-sm text-center">
            <Button
              variant="ghost"
              className="cursor-pointer w-fit text-[#ED4956] font-bold"
              type="button"
            >
              Unfollow
            </Button>
            <Button
              variant="ghost"
              className="cursor-pointer w-fit font-bold"
              type="button"
            >
              Add to favorites
            </Button>
            <Button
              variant="ghost"
              className="cursor-pointer w-fit "
              type="button"
            >
              Delete
            </Button>
          </DialogContent>
        </Dialog>
      </div>
      <img
        className="rounded-sm my-2 w-full aspect-square object-cover"
        src="https://plus.unsplash.com/premium_photo-1773277369068-8488542c42ee?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMXx8fGVufDB8fHx8fA%3D%3D"
        alt="post_img"
      />

      <div className="flex items-center justify-between my-2 ">
        <div className="flex items-center gap-3">
          <FaHeart size={"22px"} />
          <MessageCircle onClick={()=>setOpen(true)} className="cursor-pointer hover:text-gray-600" />
          <Send className="cursor-pointer hover:text-gray-600" />
        </div>
        <Bookmark />
      </div>
      <span className="font-medium block mb-2">1k likes</span>
      <p>
        <span className="font-medium mr-2">username</span>
        caption
      </p>
      <span onClick={()=>setOpen(true)} className="cursor-pointer text-sm text-gray-400">view all 10 comments</span>

      <CommentDialog open={open} setOpen={setOpen}/>

      <div className="flex items-center justify-between">
        <input
          type="text"
          placeholder="Add a comment..."
          value={text}
          onChange={ChangeEventHandler}
          className="outline-none text-sm w-full"
        />
        {
          text &&   <span className="text-[#3BADF8]">Post</span>
        }
      
      </div>
    </div>
  );
};

export default Post;
