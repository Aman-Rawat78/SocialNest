import {  setUserProfile } from '@/redux/authSlice';
import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';


const useGetUserProfile = (userId) => {
    const dispatch = useDispatch();
   

 useEffect(()=>{
    const fetchUserProfile= async ()=>{
        try {
            const res = await axios.get(`http://localhost:8000/api/v1/user/profile/${userId}`, {
                withCredentials: true
            });
            if(res.data?.success){
                dispatch(setUserProfile(res.data?.user));
                console.log("User profile is set");
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
        }
    }
    fetchUserProfile();
 },[userId])
}

export default useGetUserProfile