import React, { useState } from 'react';
import { Search, Filter, User, Calendar, Activity, FileText } from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  admissionDate: Date;
  diagnosis: string;
  status: 'Active' | 'Ready for Discharge' | 'Pending Approval';
  room: string;
  doctor: string;
}

const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'John Smith',
    age: 65,
    gender: 'Male',
    admissionDate: new Date('2024-01-15'),
    diagnosis: 'Pneumonia',
    status: 'Ready for Discharge',
    room: 'A-101',
    doctor: 'Dr. Sarah Wilson',
  },
  {
    id: '2',
    name: 'Mary Johnson',
    age: 45,
    gender: 'Female',
    admissionDate: new Date('2024-01-18'),
    diagnosis: 'Post-surgical recovery',
    status: 'Active',
    room: 'B-205',
    doctor: 'Dr. Sarah Wilson',
  },
  {
    id: '3',
    name: 'Robert Davis',
    age: 72,
    gender: 'Male',
    admissionDate: new Date('2024-01-12'),
    diagnosis: 'Cardiac monitoring',
    status: 'Pending Approval',
    room: 'C-301',
    doctor: 'Dr. Sarah Wilson',
  },
];

export default function PatientDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredPatients = mockPatients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || patient.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'Ready for Discharge':
        return 'bg-accent/10 text-accent border-accent/20';
      case 'Pending Approval':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className="h-full flex flex-col bg-background" data-testid="patient-dashboard">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <h2 className="text-2xl font-semibold text-foreground mb-4">Patient Dashboard</h2>
        
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-muted-foreground absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search patients by name or diagnosis..."
              className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-ring focus:border-ring"
              data-testid="patient-search-input"
            />
          </div>
          
          <div className="relative">
            <Filter className="w-5 h-5 text-muted-foreground absolute left-3 top-1/2 transform -translate-y-1/2" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-8 py-2 bg-input border border-border rounded-lg text-foreground focus:ring-2 focus:ring-ring focus:border-ring appearance-none cursor-pointer"
              data-testid="patient-status-filter"
            >
              <option value="all">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Ready for Discharge">Ready for Discharge</option>
              <option value="Pending Approval">Pending Approval</option>
            </select>
          </div>
        </div>
      </div>

      {/* Patient List */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredPatients.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center" data-testid="no-patients-found">
            <User className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Patients Found</h3>
            <p className="text-muted-foreground">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'No patients are currently in the system.'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredPatients.map((patient) => (
              <div
                key={patient.id}
                className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
                data-testid={`patient-card-${patient.id}`}
              >
                {/* Patient Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground" data-testid={`patient-name-${patient.id}`}>
                        {patient.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {patient.age} years, {patient.gender}
                      </p>
                    </div>
                  </div>
                  
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(patient.status)}`}
                    data-testid={`patient-status-${patient.id}`}
                  >
                    {patient.status}
                  </span>
                </div>

                {/* Patient Details */}
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Admitted: {patient.admissionDate.toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Activity className="w-4 h-4" />
                    <span>{patient.diagnosis}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <FileText className="w-4 h-4" />
                    <span>Room: {patient.room}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span>{patient.doctor}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 pt-4 border-t border-border flex space-x-2">
                  <button
                    className="flex-1 px-3 py-2 text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 rounded-md transition-colors"
                    data-testid={`patient-view-${patient.id}`}
                  >
                    View Details
                  </button>
                  <button
                    className="flex-1 px-3 py-2 text-xs font-medium bg-accent/10 text-accent hover:bg-accent/20 rounded-md transition-colors"
                    data-testid={`patient-edit-${patient.id}`}
                  >
                    Edit Record
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
