import React, { useState } from "react";
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  User,
  Calendar,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface DischargeRequest {
  id: string;
  patientName: string;
  patientId: string;
  room: string;
  diagnosis: string;
  requestDate: Date;
  status: "Pending" | "Approved" | "Rejected" | "Completed";
  doctor: string;
  notes: string;
  priority: "Low" | "Medium" | "High";
}

const mockDischargeRequests: DischargeRequest[] = [
  {
    id: "1",
    patientName: "John Smith",
    patientId: "P001",
    room: "A-101",
    diagnosis: "Pneumonia - Fully recovered",
    requestDate: new Date("2024-01-20"),
    status: "Pending",
    doctor: "Dr. Sarah Wilson",
    notes: "Patient has completed antibiotic course and chest X-ray is clear.",
    priority: "Medium",
  },
  {
    id: "2",
    patientName: "Mary Johnson",
    patientId: "P002",
    room: "B-205",
    diagnosis: "Post-surgical recovery",
    requestDate: new Date("2024-01-19"),
    status: "Approved",
    doctor: "Dr. Sarah Wilson",
    notes: "Wound healing well, patient mobile and pain controlled.",
    priority: "Low",
  },
  {
    id: "3",
    patientName: "Robert Davis",
    patientId: "P003",
    room: "C-301",
    diagnosis: "Cardiac monitoring",
    requestDate: new Date("2024-01-21"),
    status: "Pending",
    doctor: "Dr. Sarah Wilson",
    notes: "Requires cardiology clearance before discharge.",
    priority: "High",
  },
];

export default function DischargeManagement() {
  const { state } = useAuth();
  const [requests, setRequests] = useState(mockDischargeRequests);
  const [selectedRequest, setSelectedRequest] =
    useState<DischargeRequest | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredRequests = requests.filter((request) => {
    return filterStatus === "all" || request.status === filterStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending":
        return <Clock className="w-4 h-4" />;
      case "Approved":
        return <CheckCircle className="w-4 h-4" />;
      case "Rejected":
        return <AlertTriangle className="w-4 h-4" />;
      case "Completed":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "Approved":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "Rejected":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      case "Completed":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      case "Medium":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "Low":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const canApprove =
    state.user?.permissions?.includes("approve:discharge") ?? false;
  const canReject =
    state.user?.permissions?.includes("reject:discharge") ?? false;

  const handleApprove = (requestId: string) => {
    if (!canApprove) return;
    setRequests((prev) =>
      prev.map((req) =>
        req.id === requestId ? { ...req, status: "Approved" as const } : req
      )
    );
  };

  const handleReject = (requestId: string) => {
    if (!canReject) return;
    setRequests((prev) =>
      prev.map((req) =>
        req.id === requestId ? { ...req, status: "Rejected" as const } : req
      )
    );
  };

  return (
    <div className="flex h-full">
      {/* Request List */}
      <div className="w-1/2 border-r border-gray-800 bg-gray-900 relative flex flex-col">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent"></div>
        <div className="p-6 border-b border-gray-800 relative z-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">
              Discharge Management
            </h2>
            <div className="text-sm text-white">
              {filteredRequests.length} of {requests.length} requests
            </div>
          </div>
          {/* Filter Bar */}
          <div className="flex items-center space-x-4 mb-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              data-testid="discharge-status-filter"
            >
              <option value="all">All Requests</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
        <div className="overflow-y-auto relative z-10 flex-1 custom-scrollbar p-4 space-y-4">
          {filteredRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <FileText className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                No Discharge Requests
              </h3>
              <p className="text-white">
                {filterStatus !== "all"
                  ? `No requests found with status: ${filterStatus}`
                  : "No discharge requests are currently in the system."}
              </p>
            </div>
          ) : (
            filteredRequests.map((request) => (
              <div
                key={request.id}
                onClick={() => setSelectedRequest(request)}
                className={`p-4 border-b border-gray-800 cursor-pointer transition-all duration-200 group relative bg-gray-900 rounded-lg shadow-lg hover:bg-gray-800 ${
                  selectedRequest?.id === request.id
                    ? "bg-gradient-to-r from-blue-500/10 to-blue-600/10 border-l-4 border-l-blue-500"
                    : ""
                }`}
                data-testid={`discharge-request-${request.id}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <User className="w-5 h-5 text-primary text-blue-800" />
                      <span
                        className="font-semibold text-white"
                        data-testid={`request-patient-${request.id}`}
                      >
                        {request.patientName}
                      </span>
                      <span className="text-sm text-gray-400">
                        ({request.patientId})
                      </span>
                    </div>
                    <div className="space-y-2 text-sm text-white mt-2">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4" />
                        <span>Room: {request.room}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Requested: {request.requestDate.toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-white font-medium truncate">
                        {request.diagnosis}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${getPriorityColor(
                        request.priority
                      )}`}
                    >
                      {request.priority}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${getStatusColor(
                        request.status
                      )}`}
                    >
                      {getStatusIcon(request.status)}
                      <span>{request.status}</span>
                    </span>
                  </div>
                </div>
                {request.status === "Pending" && (
                  <div className="mt-3 pt-3 border-t border-gray-800 flex space-x-2">
                    {canApprove && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApprove(request.id);
                        }}
                        className="flex-1 px-3 py-2 text-xs font-medium bg-green-500/10 text-green-600 hover:bg-green-500/20 rounded-md transition-colors"
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
                        className="flex-1 px-3 py-2 text-xs font-medium bg-red-500/10 text-red-600 hover:bg-red-500/20 rounded-md transition-colors"
                        data-testid={`reject-request-${request.id}`}
                      >
                        Reject
                      </button>
                    )}
                    {!canApprove && !canReject && (
                      <div className="flex-1 px-3 py-2 text-xs font-medium bg-muted/10 text-white rounded-md text-center">
                        Awaiting Approval
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      {/* Request Details */}
      <div className="flex-1 bg-black">
        {selectedRequest ? (
          <div className="p-6 h-full overflow-y-auto custom-scrollbar">
            <div className="bg-gray-900 rounded-lg p-6 mb-6 shadow-2xl border border-gray-800 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-blue-600/5 rounded-lg"></div>
              <div className="flex items-start justify-between mb-4 relative z-10">
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    Discharge Request Details
                  </h3>
                  <div className="flex items-center space-x-4 mt-1">
                    <p className="text-gray-400">ID: {selectedRequest.id}</p>
                    <p className="text-gray-400">•</p>
                    <p className="text-gray-400">
                      Dr. {selectedRequest.doctor}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium border flex items-center space-x-2 shadow-lg ${getStatusColor(
                    selectedRequest.status
                  )}`}
                >
                  {getStatusIcon(selectedRequest.status)}
                  <span>{selectedRequest.status}</span>
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm relative z-10">
                <div>
                  <span className="font-medium text-blue-300">Room:</span>
                  <p className="text-white font-mono">{selectedRequest.room}</p>
                </div>
                <div>
                  <span className="font-medium text-blue-300">Priority:</span>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(
                      selectedRequest.priority
                    )}`}
                  >
                    {selectedRequest.priority}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-blue-300">
                    Request Date:
                  </span>
                  <p className="text-white">
                    {selectedRequest.requestDate.toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <span className="font-medium text-blue-300">
                  Diagnosis & Treatment Summary:
                </span>
                <p className="text-white mt-1">{selectedRequest.diagnosis}</p>
              </div>
              <div className="mt-6">
                <span className="font-medium text-blue-300">
                  Clinical Notes:
                </span>
                <div className="bg-card border border-border rounded-lg p-4 mt-1">
                  <p className="text-white">{selectedRequest.notes}</p>
                </div>
              </div>
              {selectedRequest.status === "Pending" && (
                <div className="flex space-x-4 mt-6">
                  {canApprove && (
                    <button
                      onClick={() => handleApprove(selectedRequest.id)}
                      className="pointer px-6 py-2 bg-green-500/10 text-green-600 rounded-lg hover:bg-green-500/80 transition-colors flex items-center space-x-2"
                      data-testid={`approve-detailed-${selectedRequest.id}`}
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Approve Discharge</span>
                    </button>
                  )}
                  {canReject && (
                    <button
                      onClick={() => handleReject(selectedRequest.id)}
                      className="px-6 py-2 bg-red-500/10 text-red-600 rounded-lg hover:bg-red-500/80 transition-colors flex items-center space-x-2"
                      data-testid={`reject-detailed-${selectedRequest.id}`}
                    >
                      <AlertTriangle className="w-4 h-4" />
                      <span>Reject Request</span>
                    </button>
                  )}
                  {!canApprove && !canReject && (
                    <div className="px-6 py-2 bg-muted text-white rounded-lg flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>Insufficient Permissions</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center bg-black">
            <div className="text-center">
              <FileText className="w-16 h-16 text-blue-400 mx-auto mb-4 drop-shadow-lg" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Select a Request
              </h3>
              <p className="text-gray-400">
                Choose a discharge request from the list to view details
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
