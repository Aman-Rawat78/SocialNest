import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import LeftSidebar from './LeftSidebar'

import SearchSidebar from './SearchSidebar';

const Mainlayout = () => {
  const [isSearchActive, setSearchActive] = useState(false);

  const handleSearchToggle = () => {
    setSearchActive(!isSearchActive);
  }
  return (
    <div className="flex min-h-screen">
      {
        isSearchActive ? <SearchSidebar onClose={handleSearchToggle} /> : <LeftSidebar  onSearch={handleSearchToggle}/>
        
      }
      
      <div className="flex-1 flex flex-col">
        <Outlet />
      </div>
    </div>
  );
}

export default Mainlayout