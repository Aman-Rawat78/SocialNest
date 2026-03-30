import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";

const CommentDialog = ({ open, setOpen }) => {
  const [text, setText] = useState("");

  const ChangeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  const sendMessageHandler = async (e) => {
    alert(text);
  };

  return (
    <Dialog open={open}>
      <DialogContent
        className="max-w-5xl! w-full p-0 overflow-hidden"
        showCloseButton={false}
        onInteractOutside={() => setOpen(false)}
      >
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
                  <AvatarImage src="" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>

                <div className="flex justify-between">
                  <Link className="font-semibold tex-1t-sm">username</Link>
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
              <div className="flex gap-3">
                <Avatar>
                  <AvatarFallback>AB</AvatarFallback>
                </Avatar>

                <div>
                  <span className="font-semibold text-sm">alex</span>
                  <p className="text-sm">This is a beautiful picture 🔥</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Avatar>
                  <AvatarFallback>MK</AvatarFallback>
                </Avatar>

                <div>
                  <span className="font-semibold text-sm">mike</span>
                  <p className="text-sm">Amazing shot!</p>
                </div>
              </div>
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
                onClick={sendMessageHandler}
                variant="outline"
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
