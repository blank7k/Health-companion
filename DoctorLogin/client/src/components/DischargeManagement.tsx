import React, { useState } from 'react';
import { CheckCircle, Clock, AlertTriangle, FileText, User, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface DischargeRequest {
  id: string;
  patientName: string;
  patientId: string;
  room: string;
  diagnosis: string;
  requestDate: Date;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Completed';
  doctor: string;
  notes: string;
  priority: 'Low' | 'Medium' | 'High';
}

const mockDischargeRequests: DischargeRequest[] = [
  {
    id: '1',
    patientName: 'John Smith',
    patientId: 'P001',
    room: 'A-101',
    diagnosis: 'Pneumonia - Fully recovered',
    requestDate: new Date('2024-01-20'),
    status: 'Pending',
    doctor: 'Dr. Sarah Wilson',
    notes: 'Patient has completed antibiotic course and chest X-ray is clear.',
    priority: 'Medium',
  },
  {
    id: '2',
    patientName: 'Mary Johnson',
    patientId: 'P002',
    room: 'B-205',
    diagnosis: 'Post-surgical recovery',
    requestDate: new Date('2024-01-19'),
    status: 'Approved',
    doctor: 'Dr. Sarah Wilson',
    notes: 'Wound healing well, patient mobile and pain controlled.',
    priority: 'Low',
  },
  {
    id: '3',
    patientName: 'Robert Davis',
    patientId: 'P003',
    room: 'C-301',
    diagnosis: 'Cardiac monitoring',
    requestDate: new Date('2024-01-21'),
    status: 'Pending',
    doctor: 'Dr. Sarah Wilson',
    notes: 'Requires cardiology clearance before discharge.',
    priority: 'High',
  },
];

export default function DischargeManagement() {
  const { state } = useAuth();
  const [requests, setRequests] = useState(mockDischargeRequests);
  const [selectedRequest, setSelectedRequest] = useState<DischargeRequest | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredRequests = requests.filter(request => {
    return filterStatus === 'all' || request.status === filterStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Clock className="w-4 h-4" />;
      case 'Approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'Rejected':
        return <AlertTriangle className="w-4 h-4" />;
      case 'Completed':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'Approved':
        return 'bg-accent/10 text-accent border-accent/20';
      case 'Rejected':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'Completed':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'Medium':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'Low':
        return 'bg-accent/10 text-accent border-accent/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const canApprove = state.user?.permissions?.includes('approve:discharge') ?? false;
  const canReject = state.user?.permissions?.includes('reject:discharge') ?? false;

  const handleApprove = (requestId: string) => {
    if (!canApprove) return;
    
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: 'Approved' as const } : req
    ));
  };

  const handleReject = (requestId: string) => {
    if (!canReject) return;
    
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: 'Rejected' as const } : req
    ));
  };

  return (
    <div className="h-full flex flex-col bg-background" data-testid="discharge-management">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <h2 className="text-2xl font-semibold text-foreground mb-4">Discharge Management</h2>
        
        {/* Filter Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:ring-2 focus:ring-ring focus:border-ring"
              data-testid="discharge-status-filter"
            >
              <option value="all">All Requests</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          
          <div className="text-sm text-muted-foreground">
            {filteredRequests.length} of {requests.length} requests
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex">
        {/* Request List */}
        <div className="w-1/2 border-r border-border overflow-y-auto">
          {filteredRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6" data-testid="no-requests-found">
              <FileText className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Discharge Requests</h3>
              <p className="text-muted-foreground">
                {filterStatus !== 'all' 
                  ? `No requests found with status: ${filterStatus}`
                  : 'No discharge requests are currently in the system.'
                }
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {filteredRequests.map((request) => (
                <div
                  key={request.id}
                  onClick={() => setSelectedRequest(request)}
                  className={`bg-card border border-border rounded-lg p-4 cursor-pointer hover:shadow-md transition-all ${
                    selectedRequest?.id === request.id ? 'ring-2 ring-primary' : ''
                  }`}
                  data-testid={`discharge-request-${request.id}`}
                >
                  {/* Request Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <User className="w-5 h-5 text-primary" />
                      <span className="font-semibold text-foreground" data-testid={`request-patient-${request.id}`}>
                        {request.patientName}
                      </span>
                      <span className="text-sm text-muted-foreground">({request.patientId})</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(request.priority)}`}>
                        {request.priority}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border flex items-center space-x-1 ${getStatusColor(request.status)}`}>
                        {getStatusIcon(request.status)}
                        <span>{request.status}</span>
                      </span>
                    </div>
                  </div>

                  {/* Request Details */}
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4" />
                      <span>Room: {request.room}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>Requested: {request.requestDate.toLocaleDateString()}</span>
                    </div>
                    <p className="text-foreground font-medium truncate">{request.diagnosis}</p>
                  </div>

                  {/* Action Buttons */}
                  {request.status === 'Pending' && (
                    <div className="mt-3 pt-3 border-t border-border flex space-x-2">
                      {canApprove && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApprove(request.id);
                          }}
                          className="flex-1 px-3 py-2 text-xs font-medium bg-accent/10 text-accent hover:bg-accent/20 rounded-md transition-colors"
                          data-testid={`approve-request-${request.id}`}
                        >
                          Approve
                        </button>
                      )}
                      {canReject && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReject(request.id);
                          }}
                          className="flex-1 px-3 py-2 text-xs font-medium bg-destructive/10 text-destructive hover:bg-destructive/20 rounded-md transition-colors"
                          data-testid={`reject-request-${request.id}`}
                        >
                          Reject
                        </button>
                      )}
                      {!canApprove && !canReject && (
                        <div className="flex-1 px-3 py-2 text-xs font-medium bg-muted/10 text-muted-foreground rounded-md text-center">
                          Awaiting Approval
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Request Details */}
        <div className="w-1/2 overflow-y-auto">
          {selectedRequest ? (
            <div className="p-6" data-testid={`request-details-${selectedRequest.id}`}>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-foreground">Discharge Request Details</h3>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full border flex items-center space-x-2 ${getStatusColor(selectedRequest.status)}`}>
                    {getStatusIcon(selectedRequest.status)}
                    <span>{selectedRequest.status}</span>
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Patient</label>
                    <p className="text-foreground">{selectedRequest.patientName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Patient ID</label>
                    <p className="text-foreground">{selectedRequest.patientId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Room</label>
                    <p className="text-foreground">{selectedRequest.room}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Priority</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(selectedRequest.priority)}`}>
                      {selectedRequest.priority}
                    </span>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Attending Doctor</label>
                    <p className="text-foreground">{selectedRequest.doctor}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Request Date</label>
                    <p className="text-foreground">{selectedRequest.requestDate.toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="text-sm font-medium text-muted-foreground">Diagnosis & Treatment Summary</label>
                  <p className="text-foreground mt-1">{selectedRequest.diagnosis}</p>
                </div>

                <div className="mb-6">
                  <label className="text-sm font-medium text-muted-foreground">Clinical Notes</label>
                  <div className="bg-card border border-border rounded-lg p-4 mt-1">
                    <p className="text-foreground">{selectedRequest.notes}</p>
                  </div>
                </div>

                {selectedRequest.status === 'Pending' && (
                  <div className="flex space-x-4">
                    {canApprove && (
                      <button
                        onClick={() => handleApprove(selectedRequest.id)}
                        className="px-6 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/80 transition-colors flex items-center space-x-2"
                        data-testid={`approve-detailed-${selectedRequest.id}`}
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Approve Discharge</span>
                      </button>
                    )}
                    {canReject && (
                      <button
                        onClick={() => handleReject(selectedRequest.id)}
                        className="px-6 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/80 transition-colors flex items-center space-x-2"
                        data-testid={`reject-detailed-${selectedRequest.id}`}
                      >
                        <AlertTriangle className="w-4 h-4" />
                        <span>Reject Request</span>
                      </button>
                    )}
                    {!canApprove && !canReject && (
                      <div className="px-6 py-2 bg-muted text-muted-foreground rounded-lg flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>Insufficient Permissions</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-center p-6" data-testid="no-request-selected">
              <div>
                <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Select a Request</h3>
                <p className="text-muted-foreground">Choose a discharge request from the list to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
