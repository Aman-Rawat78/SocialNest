import { setSuggestedUsers } from '@/redux/authSlice';
import api from '@/lib/api'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';


const useGetSuggestedUsers = () => {
    const dispatch = useDispatch();
   

 useEffect(()=>{
    const fetchSuggestedUsers= async ()=>{
        try {
            const res = await api.get("/user/suggested");
            if(res.data?.success){
                dispatch(setSuggestedUsers(res.data?.users));
            }
        } catch (error) {
            console.error("Error fetching suggested users:", error);
        }
    }
    fetchSuggestedUsers();
 },[])
}

export default useGetSuggestedUsers