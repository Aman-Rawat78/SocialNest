import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from './ui/button';
import followUser from '@/lib/useFollowUser';


const SuggestedUsers = () => {
    const { suggestedUsers, user } = useSelector((store) => store.auth);
     const dispatch = useDispatch();

    return (
        <div className='my-10 w-full'>
            <div className='flex items-center justify-between text-sm w-full'>
                <h1 className='font-semibold text-gray-600'>Suggested for you</h1>
                <span className='pl-8 ml-font-medium cursor-pointer'>See All</span>
            </div>

            {  
                suggestedUsers?.map((Suggested) => {
                
                    return (
                        <div key={Suggested?._id} className='flex items-center justify-between my-5'>
                            <div className='flex items-center gap-2'>
                                <Link to={`/profile/${Suggested?._id}`}>
                                    <Avatar className="h-12 w-12" >
                                        <AvatarImage src={Suggested?.profilePicture} alt="post_image" />
                                        <AvatarFallback>{Suggested?.username.charAt(0).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                </Link>
                             <div>
                                 <h1 className='font-semibold text-sm'><Link to={`/profile/${Suggested?._id}`}>{Suggested?.username}</Link></h1>
                                 <span className='text-gray-600 text-sm'>Suggested for you</span>                                </div>
                            </div>

                            {
                            (user?.following?.includes(Suggested?._id) === false) ?
                                (<span onClick={() =>{followUser(Suggested._id,user,dispatch)}} className='text-[#3BADF8] text-xs font-bold cursor-pointer hover:text-[#3495d6]'>Follow</span>)
                               :(<Button onClick={() =>{followUser(Suggested._id,user,dispatch)}} variant='secondary' className='h-8 cursor-pointer  border-2 border-black'>Following</Button>)} 
                        </div>
                    )
                })
            }
        </div>
    )
}

export default SuggestedUsers 