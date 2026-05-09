import React from 'react'
import Feed from './ui/Feed'
import { Outlet } from 'react-router-dom'
import RightSidebar from './RightSidebar'
import useGetAllPost from '@/hooks/useGetAllPost'
import useGetSuggestedUsers from '@/hooks/useGetSuggestedUser'
import SearchSidebar from './SearchSidebar'

const Home = () => {
  useGetAllPost();
  useGetSuggestedUsers();

  return (
    <div className='flex'>
        <div className='grow'>
          <Feed/>
          <Outlet/>
        </div>
        {/* <RightSidebar/> */}
        <SearchSidebar/>
    </div>
  ) 
} 
 
export default Home 