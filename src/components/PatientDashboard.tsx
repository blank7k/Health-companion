import React, { useState } from 'react';
import { User, Clock, AlertTriangle, CheckCircle, FileText, Calendar, Phone, MapPin } from 'lucide-react';
import { mockPatients, mockDischargeData } from '../../backend/mockData';

const PatientDashboard: React.FC = () => {
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'ready' | 'delayed'>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'text-green-700 bg-green-50 border-green-200';
      case 'pending': return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'delayed': return 'text-red-700 bg-red-50 border-red-200';
      default: return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'delayed': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const filteredPatients = mockPatients.filter(patient => {
    if (filter === 'all') return true;
    return patient.dischargeStatus === filter;
  });

  const selectedPatientData = selectedPatient 
    ? mockPatients.find(p => p.id === selectedPatient)
    : null;

  return (
    <div className="flex h-full">
      {/* Patient List */}
      <div className="w-1/3 border-r border-slate-200 bg-white">
        <div className="p-4 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Patients</h2>
          
          {/* Filter Buttons */}
          <div className="flex space-x-2 mb-4">
            {[
              { key: 'all', label: 'All', count: mockPatients.length },
              { key: 'ready', label: 'Ready', count: mockPatients.filter(p => p.dischargeStatus === 'ready').length },
              { key: 'pending', label: 'Pending', count: mockPatients.filter(p => p.dischargeStatus === 'pending').length },
              { key: 'delayed', label: 'Delayed', count: mockPatients.filter(p => p.dischargeStatus === 'delayed').length },
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key as any)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === key
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {label} ({count})
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-y-auto">
          {filteredPatients.map((patient) => (
            <div
              key={patient.id}
              onClick={() => setSelectedPatient(patient.id)}
              className={`p-4 border-b border-slate-100 cursor-pointer transition-colors ${
                selectedPatient === patient.id 
                  ? 'bg-blue-50 border-l-4 border-l-blue-500' 
                  : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-800">{patient.name}</h3>
                  <p className="text-sm text-slate-600">Room {patient.room} • {patient.age}y</p>
                  <p className="text-sm text-slate-500 mt-1">{patient.diagnosis}</p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${
                  getStatusColor(patient.dischargeStatus)
                }`}>
                  {getStatusIcon(patient.dischargeStatus)}
                  <span className="capitalize">{patient.dischargeStatus}</span>
                </div>
              </div>
              
              <div className="mt-2 flex items-center text-xs text-slate-500">
                <Calendar className="w-3 h-3 mr-1" />
                Admitted: {new Date(patient.admissionDate).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Patient Details */}
      <div className="flex-1 bg-slate-50">
        {selectedPatientData ? (
          <div className="p-6 h-full overflow-y-auto">
            {/* Patient Header */}
            <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-slate-800">{selectedPatientData.name}</h1>
                  <div className="flex items-center space-x-4 mt-1">
                    <p className="text-slate-600">ID: {selectedPatientData.id}</p>
                    <p className="text-slate-600">•</p>
                    <p className="text-slate-600">Dr. {selectedPatientData.physician?.split(' ')[1] || 'Johnson'}</p>
                  </div>
                </div>
                <div className={`px-4 py-2 rounded-full text-sm font-medium border flex items-center space-x-2 shadow-sm ${
                  getStatusColor(selectedPatientData.dischargeStatus)
                }`}>
                  {getStatusIcon(selectedPatientData.dischargeStatus)}
                  <span className="capitalize">Discharge {selectedPatientData.dischargeStatus}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium text-slate-700">Room:</span>
                  <p className="text-slate-600 font-mono">{selectedPatientData.room}</p>
                </div>
                <div>
                  <span className="font-medium text-slate-700">Age:</span>
                  <p className="text-slate-600">{selectedPatientData.age} years</p>
                </div>
                <div>
                  <span className="font-medium text-slate-700">Admitted:</span>
                  <p className="text-slate-600">{new Date(selectedPatientData.admissionDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="font-medium text-slate-700">LOS:</span>
                  <p className="text-slate-600">{Math.ceil((Date.now() - new Date(selectedPatientData.admissionDate).getTime()) / (1000 * 60 * 60 * 24))} days</p>
                </div>
              </div>
            </div>

            {/* Discharge Progress */}
            <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Discharge Progress</h2>
              <div className="space-y-3">
                {mockDischargeData.tasks.map((task, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${
                        task.completed ? 'bg-green-500' : 'bg-slate-300'
                      }`}></div>
                      <span className={`${task.completed ? 'text-slate-800' : 'text-slate-600'}`}>
                        {task.name}
                      </span>
                    </div>
                    <span className="text-sm text-slate-500">{task.assignedTo}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Medical Information */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Medical Details</h3>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-slate-700">Diagnosis:</span>
                    <p className="text-slate-600 mt-1">{selectedPatientData.diagnosis}</p>
                  </div>
                  <div>
                    <span className="font-medium text-slate-700">Attending Physician:</span>
                    <p className="text-slate-600 mt-1">Dr. Sarah Johnson</p>
                  </div>
                  <div>
                    <span className="font-medium text-slate-700">Discharge Medications:</span>
                    <ul className="text-slate-600 mt-1 space-y-1">
                      {mockDischargeData.medications.map((med, index) => (
                        <li key={index}>• {med}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Discharge Planning</h3>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-slate-700">Expected Discharge:</span>
                    <p className="text-slate-600 mt-1">{mockDischargeData.expectedDischarge}</p>
                  </div>
                  <div>
                    <span className="font-medium text-slate-700">Transportation:</span>
                    <p className="text-slate-600 mt-1">{mockDischargeData.transportation}</p>
                  </div>
                  <div>
                    <span className="font-medium text-slate-700">Follow-up Care:</span>
                    <p className="text-slate-600 mt-1">{mockDischargeData.followUp}</p>
                  </div>
                  <div>
                    <span className="font-medium text-slate-700">Discharge Destination:</span>
                    <p className="text-slate-600 mt-1 flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {mockDischargeData.destination}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg p-6 mt-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Emergency Contact</h3>
              <div className="flex items-center space-x-4">
                <Phone className="w-5 h-5 text-slate-500" />
                <div>
                  <p className="font-medium text-slate-700">Jane Smith (Daughter)</p>
                  <p className="text-slate-600">(555) 123-4567</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <User className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-600 mb-2">Select a Patient</h3>
              <p className="text-slate-500">Choose a patient from the list to view their discharge details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;