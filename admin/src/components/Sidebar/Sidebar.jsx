import React from 'react'
import './Sidebar.css'
import { NavLink } from 'react-router-dom'
// Import icons from React Icons
import { MdAddCircleOutline, MdDashboard } from 'react-icons/md'
import { FaListAlt } from 'react-icons/fa'
import { BsBoxSeam } from 'react-icons/bs'

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <div className="sidebar-options">
        <NavLink to='/add' className="sidebar-option">
            <MdAddCircleOutline className="sidebar-icon" />
            <p>Add Items</p>
        </NavLink>
        <NavLink to='/list' className="sidebar-option">
            <FaListAlt className="sidebar-icon" />
            <p>List Items</p>
        </NavLink>
        <NavLink to='/orders' className="sidebar-option">
            <BsBoxSeam className="sidebar-icon" />
            <p>Orders</p>
        </NavLink>
        <NavLink to='/summary' className="sidebar-option">
            <MdDashboard className="sidebar-icon" />
            <p>Dashboard</p>
        </NavLink>
      </div>
    </div>
  )
}

export default Sidebar
