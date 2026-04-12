import React from 'react'
import Feed from './ui/Feed'
import { Outlet } from 'react-router-dom'
import RightSidebar from './RightSidebar'
import useGetAllPost from '@/hooks/useGetAllPost'

const Home = () => {
  useGetAllPost()
  return (
    <div className='flex'>
        <div className='grow'>
          <Feed/>
          <Outlet/>
        </div>
        <RightSidebar/>
    </div>
  ) 
} 
 
export default Home 