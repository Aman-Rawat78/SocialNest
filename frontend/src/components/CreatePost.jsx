import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { readfileAsDataURL } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { Toast } from "radix-ui";
import { toast } from "sonner";
import axios from "axios";


const CreatePost = ({ open, setOpen }) => {
  const imageRef = useRef();
  const [caption, setCaption] = useState(""); 
  const [file, setFile] = useState();                    // this is the actual file that will be uploaded to the server
  const [imagePreview, setImagePreview] = useState("");  // this is for showing image preview before uploading
  const [loading, setLoading] = useState(false);

  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const dataUrl = await readfileAsDataURL(file);
      setImagePreview(dataUrl);
    }
  };

  const createPostHandler = async (e) => {
    
    const formData = new FormData();
    formData.append("caption", caption);
    if(imagePreview) formData.append("image", file);
    console.log(caption, file);
    try {
      setLoading(true);
      console.log("1")
      const res = await axios.post( "http://localhost:8000/api/v1/post/CreateNewPost", formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
           withCredentials: true 
        }
      );
      console.log("2")
      if(res.data?.success){
        setCaption("");
        setFile(null);
        setImagePreview("");
        setOpen(false);
         toast.success(res.data?.message );
      }
      console.log("3")
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message || "Something went wrong");
    }finally{
      setLoading(false);
    }
  };
  return (
    <Dialog open={open} className="">
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="max-w-5xl! w-full p-6 overflow-hidden"
        showCloseButton={false}
      >
        <DialogHeader className="text-center font-semibold">
          Create New Post
        </DialogHeader>
        <div className="flex gap-3 items-center">
          <Avatar>
            <AvatarImage src="" alt="img" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-xs">username</h1>
            <span className="text-gray-600 text-xs">Bio here...</span>
          </div>
        </div>

        {/* Show image preview if available */}
        {imagePreview && (
          <div className="w-full h-64 flex items-center justify-center bg-gray-100 my-4">
            <img
              src={imagePreview}
              alt="Preview"
              className="object-cover h-full  rounded-md"
            />
          </div>
        )}

       {/* Caption input and file selector*/}
        <Textarea
          className="focus-visible:ring-transparent border-none"
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        <input
          ref={imageRef}
          type="file"
          className="hidden"
          onChange={fileChangeHandler}
        />

        <Button
          onClick={() => imageRef.current?.click()}
          className={
            "w-fit mix-auto bg-[#3b82f6] hover:bg-[#2563eb] text-white"
          }
        >
          Select from computer
        </Button>


      {  /* Show post button only if there's an image selected*/}
        {imagePreview &&
          (loading ? (
            <Button>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait...
            </Button>
          ) : (
            <Button type="submit" onClick={createPostHandler}
              className={
                "w-fit mix-auto bg-[#3b82f6] hover:bg-[#2563eb] text-white"
              }
            >
              Post
            </Button>
          ))}
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
