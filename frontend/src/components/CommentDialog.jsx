import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { toast } from "sonner";

const CommentDialog = ({ open, setOpen,comments }) => {
  const [text, setText] = useState("");
  const { selectedPost, posts } = useSelector((store) => store.post);
  const dispatch = useDispatch();

  const ChangeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };


  // Handle add comment functionality here
  const handleComment = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/post/comments/${selectedPost?._id}`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );

      if (res.data.success) {
        const updatedPosts = posts.map((p) =>
          p._id === selectedPost._id
            ? { ...p, comments: [res.data.comment , ...p.comments] }
            : p,
        );

        toast.success(res.data.message);
        dispatch(setPosts(updatedPosts));
        setText("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent
        className="max-w-5xl! w-full p-0 overflow-hidden"
        showCloseButton={false}
        onInteractOutside={() => setOpen(false)}
      >
        <DialogTitle> </DialogTitle>
        <div className="flex h-150">
          {/* LEFT IMAGE */}
          <div className="w-1/2 bg-black">
            <img
              className="w-full h-full object-cover"
              src="https://plus.unsplash.com/premium_photo-1773277369068-8488542c42ee?w=600"
              alt="post_img"
            />
          </div>

          {/* RIGHT SIDE */}
          <div className="w-1/2 flex flex-col">
            {/* HEADER */}

            <div className="flex items-center justify-between p-4 border-b w-full">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={selectedPost?.author?.profilePicture} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>

                <div className="flex justify-between">
                  <Link className="font-semibold tex-1t-sm">{selectedPost?.author?.username}</Link>
                  {/* <p className="text-xs text-gray-500">Bio here...</p> */}
                </div>
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

            {/* COMMENTS SECTION */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* comment */}
              {comments.map((comment) => (
                <div className="flex gap-3" key={comment._id}>
                  <Avatar>
                    <AvatarImage src={comment?.author?.profilePicture} />
                    <AvatarFallback>
                      {comment?.author.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="font-bold text-sm">{comment?.author?.username} <span className="font-normal pl-1">{comment?.text}</span></h1>
                  </div>
                </div>
              ))}
            </div>

            {/* COMMENT INPUT */}
            <div className=" flex p-3 border-t">
              <input
                type="text"
                placeholder="Add a comment..."
                className="w-full outline-none text-sm"
                value={text}
                onChange={(e) => ChangeEventHandler(e)}
              />
              <Button
                disabled={!text}
                variant="outline"
                onClick={handleComment}
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
