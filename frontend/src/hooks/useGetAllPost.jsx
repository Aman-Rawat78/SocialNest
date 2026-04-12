import { setPosts } from '@/redux/postSlice';
import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';

const useGetAllPost = () => {
    const dispatch = useDispatch();

 useEffect(()=>{
    const fetchAllPost = async ()=>{
        try {
            const res = await axios.get("http://localhost:8000/api/v1/post/getAllposts", {
                withCredentials: true
            });
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