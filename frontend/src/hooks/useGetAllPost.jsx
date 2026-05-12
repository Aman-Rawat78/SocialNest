import { setPosts } from '@/redux/postSlice';
import api from '@/lib/api'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';

const useGetAllPost = () => {
    const dispatch = useDispatch();

 useEffect(()=>{
    const fetchAllPost = async ()=>{
        try {
            const res = await api.get("/post/getAllposts");
            if(res.data?.success){
                dispatch(setPosts(res.data?.post));
            }
           
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    }
    fetchAllPost();
 },[])
}

export default useGetAllPost