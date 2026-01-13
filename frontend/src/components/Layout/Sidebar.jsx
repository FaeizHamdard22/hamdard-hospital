import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  UsersIcon, 
  CalendarIcon, 
  UserGroupIcon,
  ChartBarIcon,
  UserIcon,
  Cog6ToothIcon,
  UserPlusIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Sidebar = ({ navigation, sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  
  const iconMap = {
    Home: HomeIcon,
    Users: UsersIcon,
    Calendar: CalendarIcon,
    UserGroup: UserGroupIcon,
    ChartBar: ChartBarIcon,
    User: UserIcon,
    Cog: Cog6ToothIcon,
    UserAdd: UserPlusIcon
  };

  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-hospital-blue flex items-center justify-center">
                <span className="text-white font-bold">H</span>
              </div>
              <span className="ml-3 text-lg font-semibold text-gray-900">
                Hamdard Hospital
              </span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = iconMap[item.icon];
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${isActive
                    ? 'bg-hospital-blue text-white'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`h-5 w-5 mr-3 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Bottom section */}
          <div className="border-t p-4">
            <div className="flex items-center">
              <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center">
                <UserIcon className="h-5 w-5 text-gray-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  Hamdard Hospital
                </p>
                <p className="text-xs text-gray-500">
                  Patient Management System
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;