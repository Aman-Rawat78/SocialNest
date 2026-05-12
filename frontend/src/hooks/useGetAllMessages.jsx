import { setMessages } from '@/redux/chatSlice';
import api from '@/lib/api'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';

const useGetAllMessages = () => {
    const dispatch = useDispatch();
    const {selectedUser} = useSelector((store) => store.auth);
    
 useEffect(()=>{
    const fetchAllMessages = async ()=>{
        try {
            const res = await api.get(`/message/all/${selectedUser?._id}`);
           
            if(res.data?.success){
                dispatch(setMessages(res.data?.messages));
            }
           
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    }
    fetchAllMessages();
 },[selectedUser])
}

export default useGetAllMessages