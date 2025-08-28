import React, { useState } from "react";
import {
  User,
  Clock,
  AlertTriangle,
  CheckCircle,
  FileText,
  Calendar,
  Phone,
  MapPin,
  Search,
  Trash2,
} from "lucide-react";
import { mockPatients, mockDischargeData } from "../data/mockData";

const PatientDashboard: React.FC = () => {
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "ready" | "delayed">(
    "all"
  );
  const [patients, setPatients] = useState([...mockPatients]);
  const [showCreate, setShowCreate] = useState(false);
  const [newPatient, setNewPatient] = useState({
    id: "",
    name: "",
    age: "",
    room: "",
    diagnosis: "",
    admissionDate: "",
    dischargeStatus: "pending",
    physician: "",
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready":
        return "text-blue-300 bg-blue-500/10 border-blue-500/30 shadow-lg shadow-blue-500/20";
      case "pending":
        return "text-white bg-gray-700 border-gray-600 shadow-lg";
      case "delayed":
        return "text-gray-300 bg-gray-800 border-gray-600 shadow-lg";
      default:
        return "text-gray-300 bg-gray-800 border-gray-600 shadow-lg";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ready":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "delayed":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const [search, setSearch] = useState("");

  const filteredPatients = patients.filter((patient) => {
    const matchesFilter =
      filter === "all" || patient.dischargeStatus === filter;
    const matchesSearch =
      patient.name.toLowerCase().includes(search.toLowerCase()) ||
      patient.id.toLowerCase().includes(search.toLowerCase()) ||
      (patient.diagnosis &&
        patient.diagnosis.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && (search.trim() === "" || matchesSearch);
  });

  const selectedPatientData = selectedPatient
    ? patients.find((p) => p.id === selectedPatient)
    : null;

  const handleDeletePatient = (id: string) => {
    setPatients((prev) => prev.filter((p) => p.id !== id));
    setSelectedPatient(null);
  };

  const handleCreatePatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !newPatient.id ||
      !newPatient.name ||
      !newPatient.age ||
      !newPatient.room ||
      !newPatient.diagnosis ||
      !newPatient.admissionDate ||
      !newPatient.physician
    )
      return;
    setPatients((prev) => [
      {
        ...newPatient,
        age: Number(newPatient.age),
        dischargeStatus: newPatient.dischargeStatus as
          | "pending"
          | "ready"
          | "delayed",
      },
      ...prev,
    ]);
    setShowCreate(false);
    setNewPatient({
      id: "",
      name: "",
      age: "",
      room: "",
      diagnosis: "",
      admissionDate: "",
      dischargeStatus: "pending",
      physician: "",
    });
  };

  return (
    <div className="flex h-full">
      {/* Patient List */}
      <div
        className={`w-1/3 border-r border-gray-800 bg-gray-900 relative flex flex-col ${
          showCreate ? "z-0" : "z-10"
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent"></div>
        <div className="p-4 border-b border-gray-800 relative z-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Patients</h2>
            <button
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow transition-all duration-200"
              onClick={() => setShowCreate(true)}
            >
              Create Patient
            </button>
          </div>

          {/* Filter Buttons */}
          <div className="flex space-x-2 mb-4">
            {[
              { key: "all", label: "All", count: mockPatients.length },
              {
                key: "ready",
                label: "Ready",
                count: mockPatients.filter((p) => p.dischargeStatus === "ready")
                  .length,
              },
              {
                key: "pending",
                label: "Pending",
                count: mockPatients.filter(
                  (p) => p.dischargeStatus === "pending"
                ).length,
              },
              {
                key: "delayed",
                label: "Delayed",
                count: mockPatients.filter(
                  (p) => p.dischargeStatus === "delayed"
                ).length,
              },
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key as any)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  filter === key
                    ? "bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-300 border border-blue-500/30 shadow-lg shadow-blue-500/20"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                {label} ({count})
              </button>
            ))}
          </div>
          <div className="relative w-full">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search patients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 focus:shadow-lg focus:shadow-blue-500/20"
            />
          </div>
        </div>

        <div className="overflow-y-auto relative z-10 flex-1 custom-scrollbar">
          {filteredPatients.map((patient) => (
            <div
              key={patient.id}
              className={`p-4 border-b border-gray-800 cursor-pointer transition-all duration-200 group relative ${
                selectedPatient === patient.id
                  ? "bg-gradient-to-r from-blue-500/10 to-blue-600/10 border-l-4 border-l-blue-500 shadow-lg"
                  : "hover:bg-gray-800"
              }`}
            >
              <div className="flex items-start justify-between">
                <div
                  className="flex-1"
                  onClick={() => setSelectedPatient(patient.id)}
                >
                  <h3 className="font-semibold text-white">{patient.name}</h3>
                  <p className="text-sm text-gray-400">
                    Room {patient.room} • {patient.age}y
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {patient.diagnosis}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <div
                    className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${getStatusColor(
                      patient.dischargeStatus
                    )}`}
                  >
                    {getStatusIcon(patient.dischargeStatus)}
                    <span className="capitalize">
                      {patient.dischargeStatus}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-2 flex items-center text-xs text-gray-500">
                <Calendar className="w-3 h-3 mr-1" />
                Admitted: {new Date(patient.admissionDate).toLocaleDateString()}
              </div>
              <button
                onClick={() => handleDeletePatient(patient.id)}
                className="absolute bottom-4 right-4 p-2 hover:bg-red-600 opacity-50 hover:opacity-100 text-white rounded-full shadow transition-all duration-200"
                title="Delete Patient"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Patient Details */}
      <div className="flex-1 bg-black">
        {selectedPatientData ? (
          <div className="p-6 h-full overflow-y-auto custom-scrollbar">
            {/* Patient Header */}
            <div className="bg-gray-900 rounded-lg p-6 mb-6 shadow-2xl border border-gray-800 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-blue-600/5 rounded-lg"></div>
              <div className="flex items-start justify-between mb-4 relative z-10">
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {selectedPatientData.name}
                  </h1>
                  <div className="flex items-center space-x-4 mt-1">
                    <p className="text-gray-400">
                      ID: {selectedPatientData.id}
                    </p>
                    <p className="text-gray-400">•</p>
                    <p className="text-gray-400">
                      Dr.{" "}
                      {selectedPatientData.physician?.split(" ")[1] ||
                        "Johnson"}
                    </p>
                  </div>
                </div>
                <div
                  className={`px-4 py-2 rounded-full text-sm font-medium border flex items-center space-x-2 shadow-lg ${getStatusColor(
                    selectedPatientData.dischargeStatus
                  )}`}
                >
                  {getStatusIcon(selectedPatientData.dischargeStatus)}
                  <span className="capitalize">
                    Discharge {selectedPatientData.dischargeStatus}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 text-sm relative z-10">
                <div>
                  <span className="font-medium text-blue-300">Room:</span>
                  <p className="text-white font-mono">
                    {selectedPatientData.room}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-blue-300">Age:</span>
                  <p className="text-white">{selectedPatientData.age} years</p>
                </div>
                <div>
                  <span className="font-medium text-blue-300">Admitted:</span>
                  <p className="text-white">
                    {new Date(
                      selectedPatientData.admissionDate
                    ).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-blue-300">LOS:</span>
                  <p className="text-white">
                    {Math.ceil(
                      (Date.now() -
                        new Date(selectedPatientData.admissionDate).getTime()) /
                        (1000 * 60 * 60 * 24)
                    )}{" "}
                    days
                  </p>
                </div>
              </div>
            </div>

            {/* Discharge Progress */}
            <div className="bg-gray-900 rounded-lg p-6 mb-6 shadow-2xl border border-gray-800 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent rounded-lg"></div>
              <h2 className="text-lg font-semibold text-white mb-4 relative z-10">
                Discharge Progress
              </h2>
              <div className="space-y-3 relative z-10">
                {mockDischargeData.tasks.map((task, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-4 h-4 rounded-full ${
                          task.completed
                            ? "bg-blue-500 shadow-lg shadow-blue-500/50"
                            : "bg-gray-600"
                        }`}
                      ></div>
                      <span
                        className={`${
                          task.completed ? "text-white" : "text-gray-400"
                        }`}
                      >
                        {task.name}
                      </span>
                    </div>
                    <span className="text-sm text-gray-400">
                      {task.assignedTo}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Medical Information */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-900 rounded-lg p-6 shadow-2xl border border-gray-800 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-lg"></div>
                <h3 className="text-lg font-semibold text-white mb-4 relative z-10">
                  Medical Details
                </h3>
                <div className="space-y-3 relative z-10">
                  <div>
                    <span className="font-medium text-blue-300">
                      Diagnosis:
                    </span>
                    <p className="text-white mt-1">
                      {selectedPatientData.diagnosis}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-blue-300">
                      Attending Physician:
                    </span>
                    <p className="text-white mt-1">Dr. Sarah Johnson</p>
                  </div>
                  <div>
                    <span className="font-medium text-blue-300">
                      Discharge Medications:
                    </span>
                    <ul className="text-white mt-1 space-y-1">
                      {mockDischargeData.medications.map((med, index) => (
                        <li key={index}>• {med}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 rounded-lg p-6 shadow-2xl border border-gray-800 relative">
                <div className="absolute inset-0 bg-gradient-to-bl from-blue-500/5 to-transparent rounded-lg"></div>
                <h3 className="text-lg font-semibold text-white mb-4 relative z-10">
                  Discharge Planning
                </h3>
                <div className="space-y-3 relative z-10">
                  <div>
                    <span className="font-medium text-blue-300">
                      Expected Discharge:
                    </span>
                    <p className="text-white mt-1">
                      {mockDischargeData.expectedDischarge}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-blue-300">
                      Transportation:
                    </span>
                    <p className="text-white mt-1">
                      {mockDischargeData.transportation}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-blue-300">
                      Follow-up Care:
                    </span>
                    <p className="text-white mt-1">
                      {mockDischargeData.followUp}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-blue-300">
                      Discharge Destination:
                    </span>
                    <p className="text-white mt-1 flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {mockDischargeData.destination}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gray-900 rounded-lg p-6 mt-6 shadow-2xl border border-gray-800 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-blue-600/5 rounded-lg"></div>
              <h3 className="text-lg font-semibold text-white mb-4 relative z-10">
                Emergency Contact
              </h3>
              <div className="flex items-center space-x-4 relative z-10">
                <Phone className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="font-medium text-white">
                    Jane Smith (Daughter)
                  </p>
                  <p className="text-gray-400">(555) 123-4567</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center bg-black">
            <div className="text-center">
              <User className="w-16 h-16 text-blue-400 mx-auto mb-4 drop-shadow-lg" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Select a Patient
              </h3>
              <p className="text-gray-400">
                Choose a patient from the list to view their discharge details
              </p>
            </div>
          </div>
        )}

        {/* Modal for creating a new patient */}
        {showCreate && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-60">
            <div className="bg-gray-900 rounded-lg shadow-2xl border border-gray-700 w-full max-w-lg p-8 relative">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-white text-2xl font-bold"
                onClick={() => setShowCreate(false)}
                aria-label="Close"
              >
                ×
              </button>
              <h3 className="text-xl font-semibold text-white mb-4">
                Add New Patient
              </h3>
              <form onSubmit={handleCreatePatient} className="space-y-4">
                <div className="grid grid-cols-2 gap-4 ">
                  <input
                    className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                    placeholder="ID"
                    value={newPatient.id}
                    onChange={(e) =>
                      setNewPatient((p) => ({ ...p, id: e.target.value }))
                    }
                  />
                  <input
                    className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                    placeholder="Name"
                    value={newPatient.name}
                    onChange={(e) =>
                      setNewPatient((p) => ({ ...p, name: e.target.value }))
                    }
                  />
                  <input
                    className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                    placeholder="Age"
                    type="number"
                    value={newPatient.age}
                    onChange={(e) =>
                      setNewPatient((p) => ({ ...p, age: e.target.value }))
                    }
                  />
                  <input
                    className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                    placeholder="Room"
                    value={newPatient.room}
                    onChange={(e) =>
                      setNewPatient((p) => ({ ...p, room: e.target.value }))
                    }
                  />
                  <input
                    className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white col-span-2"
                    placeholder="Diagnosis"
                    value={newPatient.diagnosis}
                    onChange={(e) =>
                      setNewPatient((p) => ({
                        ...p,
                        diagnosis: e.target.value,
                      }))
                    }
                  />
                  <input
                    className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                    placeholder="Admission Date"
                    type="date"
                    value={newPatient.admissionDate}
                    onChange={(e) =>
                      setNewPatient((p) => ({
                        ...p,
                        admissionDate: e.target.value,
                      }))
                    }
                  />
                  <input
                    className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                    placeholder="Physician"
                    value={newPatient.physician}
                    onChange={(e) =>
                      setNewPatient((p) => ({
                        ...p,
                        physician: e.target.value,
                      }))
                    }
                  />
                  <select
                    className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                    value={newPatient.dischargeStatus}
                    onChange={(e) =>
                      setNewPatient((p) => ({
                        ...p,
                        dischargeStatus: e.target.value,
                      }))
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="ready">Ready</option>
                    <option value="delayed">Delayed</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow transition-all duration-200"
                >
                  Add Patient
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;

// Custom scrollbar styles for the patient list
// You can move this to index.css or a dedicated CSS file if preferred
import "../index.css";
