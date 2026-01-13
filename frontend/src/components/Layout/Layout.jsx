import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useAuth } from '../../context/useAuth';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: 'Home', current: true },
    { name: 'Patients', href: '/patients', icon: 'Users', current: false },
    { name: 'Appointments', href: '#', icon: 'Calendar', current: false },
    { name: 'Doctors', href: '#', icon: 'UserGroup', current: false },
    { name: 'Reports', href: '#', icon: 'ChartBar', current: false },
    { name: 'Profile', href: '/profile', icon: 'User', current: false },
  ];

  if (user?.role === 'admin') {
    navigation.push(
      { name: 'Admin', href: '#', icon: 'Cog', current: false },
      { name: 'Users', href: '#', icon: 'UserAdd', current: false }
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        navigation={navigation} 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen}
      />
      
      <div className="lg:pl-64">
        <Navbar setSidebarOpen={setSidebarOpen} />
        
        <main className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default Layout;