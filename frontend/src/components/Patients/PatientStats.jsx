import React, { useState, useEffect } from 'react';
import { patientApi } from '../../api/patientApi';

const PatientStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await patientApi.getPatientStats();
      setStats(response.stats);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-hospital-blue border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Total Patients */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">Total Patients</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {stats?.total || 0}
            </p>
          </div>
          <div className="h-12 w-12 rounded-full bg-hospital-blue flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              {stats?.total || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Status Distribution */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-4">Patient Status</h4>
        <div className="space-y-3">
          {[
            { status: 'Active', color: 'bg-green-500', count: stats?.statuses?.find(s => s.status === 'active')?.count || 0 },
            { status: 'Inactive', color: 'bg-yellow-500', count: stats?.statuses?.find(s => s.status === 'inactive')?.count || 0 },
            { status: 'Discharged', color: 'bg-blue-500', count: stats?.statuses?.find(s => s.status === 'discharged')?.count || 0 }
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`h-3 w-3 rounded-full ${item.color} mr-3`}></div>
                <span className="text-sm text-gray-700">{item.status}</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-gray-500">Avg. Age</p>
          <p className="text-lg font-semibold text-gray-900">42</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-gray-500">This Month</p>
          <p className="text-lg font-semibold text-gray-900">+24</p>
        </div>
      </div>
    </div>
  );
};

export default PatientStats;