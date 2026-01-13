import React from 'react';
import { useAuth } from '../context/useAuth';
import PatientStats from '../components/Patients/PatientStats';
import StatsCard from '../components/Dashboard/StatsCard';
import { 
  UserGroupIcon, 
  UserPlusIcon, 
  CalendarIcon, 
  ChartBarIcon 
} from '@heroicons/react/24/outline';

const DashboardPage = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: 'Total Patients',
      value: '1,254',
      change: '+12.5%',
      icon: UserGroupIcon,
      color: 'blue'
    },
    {
      title: 'New Today',
      value: '24',
      change: '+8.2%',
      icon: UserPlusIcon,
      color: 'green'
    },
    {
      title: 'Appointments',
      value: '48',
      change: '-3.2%',
      icon: CalendarIcon,
      color: 'yellow'
    },
    {
      title: 'Occupancy Rate',
      value: '82%',
      change: '+5.7%',
      icon: ChartBarIcon,
      color: 'purple'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-hospital-blue to-hospital-teal rounded-2xl shadow-lg p-6 text-white">
        <h1 className="text-3xl font-bold">
          Welcome back, {user?.username}!
        </h1>
        <p className="mt-2 text-blue-100">
          Here's what's happening with your hospital today.
        </p>
        <div className="mt-4 flex items-center space-x-2">
          <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
            {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}
          </span>
          <span className="text-sm">
            Last login: {new Date().toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Patient Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Patient Overview
            </h3>
            <PatientStats />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button className="w-full btn-primary text-left px-4 py-3">
              Add New Patient
            </button>
            <button className="w-full btn-secondary text-left px-4 py-3">
              Schedule Appointment
            </button>
            <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-lg transition duration-200 text-left">
              Generate Report
            </button>
            <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-lg transition duration-200 text-left">
              View Today's Appointments
            </button>
          </div>

          {/* Recent Activity */}
          <div className="mt-8">
            <h4 className="font-medium text-gray-900 mb-3">Recent Activity</h4>
            <ul className="space-y-3">
              {[
                { time: '10:30 AM', activity: 'Patient John Doe admitted' },
                { time: '09:45 AM', activity: 'Dr. Smith completed surgery' },
                { time: 'Yesterday', activity: 'Monthly report generated' },
                { time: '2 days ago', activity: 'New doctor joined' }
              ].map((item, index) => (
                <li key={index} className="flex items-center text-sm">
                  <span className="text-gray-500 w-16">{item.time}</span>
                  <span className="text-gray-700">{item.activity}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
