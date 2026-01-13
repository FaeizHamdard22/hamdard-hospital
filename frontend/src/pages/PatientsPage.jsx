import React, { useState } from 'react';
import PatientList from '../components/Patients/PatientList';
import PatientForm from '../components/Patients/PatientForm';
import SearchBar from '../components/Common/SearchBar';
import { PlusIcon } from '@heroicons/react/24/outline';

const PatientsPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage all patient records and information
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <SearchBar 
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search patients..."
          />
          
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-hospital-blue hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hospital-blue"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Patient
          </button>
        </div>
      </div>

      {/* Patient Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <PatientForm 
              onClose={() => setShowForm(false)}
              onSuccess={() => {
                setShowForm(false);
                // Refresh patient list here
              }}
            />
          </div>
        </div>
      )}

      {/* Patient List */}
      <div className="card">
        <PatientList searchTerm={searchTerm} />
      </div>
    </div>
  );
};

export default PatientsPage;
