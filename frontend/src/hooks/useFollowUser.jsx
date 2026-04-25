import { setAuthUser, setUserProfile } from '@/redux/authSlice';
import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';


const useFollowUser = (FollowId) => {
  const { user, userProfile } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  
  const handleFollow = async () => {
    try {
      console.log("insidethe handleFollow function, FollowId:", FollowId);
      const res = await axios.get(`http://localhost:8000/api/v1/user/followOrUnfollow/${FollowId}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        if (res.data.action === 'follow') {
          dispatch(setAuthUser({ ...user, following: [...user.following, FollowId] }));
          dispatch(setUserProfile({...userProfile, followers: [...userProfile.followers, user._id] }));
        } else if (res.data.action === 'unfollow') {
          dispatch(setAuthUser({ ...user, following: user.following.filter(id => id !== FollowId) }));
          dispatch(setUserProfile({...userProfile, followers: userProfile.followers.filter(id => id !== user._id) }));
        }
      }
      toast.success(res.data.message);
    } catch (error) {
      toast.error('Failed to follow/unfollow user.');
    }
  };

  return handleFollow;
};

export default useFollowUser