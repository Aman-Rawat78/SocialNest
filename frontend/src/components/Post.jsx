import React, { useState } from "react";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Bookmark, BookmarkCheck, MessageCircle, MoreHorizontal, Send, Text } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "./ui/button";
import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import api from "@/lib/api";
import { Badge } from "./ui/badge";
import { setAuthUser } from "@/redux/authSlice";
import { Link } from "react-router-dom";
import followUser from "@/lib/useFollowUser";

const Post = ({ post }) => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [Liked, setLiked] = useState(post.likes.includes(user?._id));
  const [likesCount, setLikesCount] = useState(post.likes.length);
  const isBookmarked = user?.bookmarks?.includes(post._id);


  const ChangeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };


  //Handle delete post
  const handleDeletePost = async () => {
    // Implement delete post functionality here
    setLoading(true);
    try {
      const res = await api.delete(`/post/delete/${post._id}`);
      if (res.data.success) {
        const updatedPosts = posts.filter((p) => p._id !== post._id);
        dispatch(setPosts(updatedPosts));
        toast.success(res.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message || 'Failed to delete post')
    } finally {
      setLoading(false);
    }
  }


  // Handle like/unlike post
  const handleLike = async () => {
    try {
      const action = Liked ? 'unlike' : 'like';

      const res = await api.put(`/post/${action}/${post._id}`);

      if (res.data.success) {
        const updatedLikes = Liked ? likesCount - 1 : likesCount + 1;
        setLikesCount(updatedLikes);
        setLiked(!Liked);  // The confusion is because setLiked(!Liked) updates the state for the next render, not immediately.
        //  So, when you call setLiked(!Liked), it schedules an update to the Liked state, but the value of Liked won't change until the next render cycle.
        //  Therefore, when you check the value of Liked immediately after calling setLiked(!Liked), it still holds the old value, 
        // which is why you see the opposite of what you expect in the console.log statement.

        // updated the post likes in the redux store
        const updatedPosts = posts.map((p) =>
          p._id === post._id ? {
            ...p,
            likes: Liked ? p.likes.filter(id => id !== user._id) : [...p.likes, user._id]
          } : p
        );
        dispatch(setPosts(updatedPosts));
        toast.success(res.data.message);

      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message || 'Failed to like post');
    }
  };

  // Handle add comment functionality here
  const handleComment = async () => {
    try {

      const res = await api.post(`/post/comments/${post._id}`, { text }, {
        headers: {
          'Content-Type': 'application/json'
        },
      });

      if (res.data.success) {
        const updatedPosts = posts.map((p) =>
          p._id === post._id ? { ...p, comments: [res.data.comment, ...p.comments] } : p
        )

        toast.success(res.data.message);
        dispatch(setPosts(updatedPosts));
        setText("");
      }
    } catch (error) {
      console.log(error);
    }
  };


  // Handle bookmark functionality here
  const handleBookMark = async () => {
    try {
      const res = await api.get(`/post/BookmarkPost/${post._id}`);
      console.log(res.data);
      if (res.data.success) {
        toast.success(res.data.message);

        if (res.data.isbookmarked === true) {
          dispatch(setAuthUser({ ...user, bookmarks: [...user.bookmarks, post._id] }));
        } else {
          dispatch(setAuthUser({ ...user, bookmarks: user.bookmarks.filter(id => id !== post._id) }));
        }
      } else {
        toast.error(res.data.message || 'Failed to bookmark post');
      }
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <div className="my-8 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">

          <Link className="flex gap-2 font-medium" to={`/profile/${post?.author?._id}`}>
            <Avatar>
              <AvatarImage src={post?.author?.profilePicture} alt="post_img" />
              <AvatarFallback>{post?.author?.username?.charAt(0)?.toUpperCase()}</AvatarFallback>
              {/* <AvatarBadge className="bg-green-600 dark:bg-green-800" /> */}
            </Avatar>
            <div className="flex items-center gap-3">
              {post?.author.username}
            </div>
          </Link>

          {user && user._id === post.author._id && (<Badge variant="secondary">Author</Badge>)}
        </div>
        <div className="flex items-center gap-5">

          {
            (user && user._id !== post.author._id) && (
              <span onClick={() => followUser(post?.author?._id, user, dispatch)} className='text-[#3BADF8] text-xs font-bold cursor-pointer  hover:text-[#3495d6] hover:underline'>
                {user?.following?.includes(post?.author?._id) ? 'Following' : 'Follow'}
              </span>
            )
          }


          {/* Post options dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <MoreHorizontal className="cursor-pointer" />
            </DialogTrigger>
            <DialogContent className="flex flex-col items-center test-sm text-center">
              <DialogTitle>
                <VisuallyHidden>Post Options</VisuallyHidden>
              </DialogTitle>
              {post?.author._id !== user?._id && (
                <Button
                  variant="ghost"
                  className="cursor-pointer w-fit text-[#ED4956] font-bold"
                  type="button"
                >
                  Unfollow
                </Button>
              )}
              <Button
                variant="ghost"
                className="cursor-pointer w-fit font-bold"
                type="button"
              >
                Add to favorites
              </Button>

              {post?.author._id === user?._id && (
                <Button
                  onClick={handleDeletePost}
                  variant="ghost"
                  className="cursor-pointer w-fit text-[#ED4956]"
                  type="button"
                  disabled={loading}
                >
                  Delete
                </Button>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Post image */}
      <img
        className="rounded-sm my-2 w-full aspect-square object-cover"
        src={post?.image}
        alt="post_img"
      />

      {/* Post actions like, comment , share , bookmark */}
      <div className="flex items-center justify-between my-2 ">
        <div className="flex items-center gap-3">

          {Liked ? (
            <FaHeart onClick={handleLike} size={"22px"} className="cursor-pointer text-[#ED4956]" />
          ) : (
            <FaRegHeart onClick={handleLike} size={"22px"} className="cursor-pointer hover:text-gray-600" />
          )}

          <MessageCircle
            onClick={() => {
              dispatch(setSelectedPost(post));
              setOpen(true);
            }}
            size={"22px"}
            className="cursor-pointer  hover:text-gray-600"
          />
          <Send className="cursor-pointer hover:text-gray-600" />
        </div>

        {
          isBookmarked ? (
            <BookmarkCheck onClick={handleBookMark} className="cursor-pointer text-[#0e0f0f]" />
          ) : (
            <Bookmark onClick={handleBookMark} />
          )}
      </div>
      <span className="font-medium block mb-2">{post.likes.length} likes</span>
      <p>
        <span className="font-medium mr-2">{post?.author.username}</span>
        {post?.caption}
      </p>
      <span
        onClick={() => {
          dispatch(setSelectedPost(post));
          setOpen(true)
        }}
        className="cursor-pointer text-sm text-gray-400"
      >
        {post.comments.length > 0 && (
          <span>
            view all {post.comments.length} comments
          </span>
        )}
      </span>


      {/* Comment dialog box */}
      <CommentDialog open={open} setOpen={setOpen} comments={post.comments} />

      { /* Add comment */}
      <div className="flex items-center justify-between">
        <input
          type="text"
          placeholder="Add a comment..."
          value={text}
          onChange={ChangeEventHandler}
          className="outline-none text-sm w-full"

        />
        {text && <span onClick={handleComment} className="text-[#3BADF8] cursor-pointer">Post</span>}
      </div>
    </div>
  );
};

export default Post;
