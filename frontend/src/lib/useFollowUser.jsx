import { setAuthUser, setUserProfile } from '@/redux/authSlice';
import api from '@/lib/api'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';


const followUser = async(FollowId,user,dispatch,userProfile) => {
    try {
      // console.log("insidethe handleFollow function, FollowId:", FollowId);
      const res = await api.get(`/user/followOrUnfollow/${FollowId}`);
      if (res.data.success) {
        if (res.data.action === 'follow') {
          dispatch(setAuthUser({ ...user, following: [...user.following, FollowId] }));
          if(userProfile)dispatch(setUserProfile({...userProfile, followers: [...userProfile.followers, user._id] }));
        } else if (res.data.action === 'unfollow') {
          dispatch(setAuthUser({ ...user, following: user.following.filter(id => id !== FollowId) }));
          if(userProfile)dispatch(setUserProfile({...userProfile, followers: userProfile.followers.filter(id => id !== user._id) }));
        }
      }
      toast.success(res.data.message);
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
      toast.error('Failed to follow/unfollow user.');
    }
  };

 


export default followUser