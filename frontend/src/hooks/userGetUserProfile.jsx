import {  setUserProfile } from '@/redux/authSlice';
import api from '@/lib/api'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';


const useGetUserProfile = (userId) => {
    const dispatch = useDispatch();
   

 useEffect(()=>{
    const fetchUserProfile= async ()=>{
        try {
            dispatch(setUserProfile(null));
            const res = await api.get(`/user/profile/${userId}`);
            if(res.data?.success){
                dispatch(setUserProfile(res.data?.user));
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
        }
    }
    fetchUserProfile();
 },[userId])
}

export default useGetUserProfile