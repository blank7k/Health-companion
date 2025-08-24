// Mock patient data for the hospital discharge assistant
export const mockPatients = [
  {
    id: 'PT001',
    name: 'Margaret Johnson',
    age: 78,
    room: 'A-204',
    diagnosis: 'Pneumonia, recovered',
    admissionDate: '2025-01-15',
    dischargeStatus: 'ready' as const,
    physician: 'Dr. Sarah Johnson'
  },
  {
    id: 'PT002',
    name: 'Robert Martinez',
    age: 65,
    room: 'B-112',
    diagnosis: 'Hip replacement surgery',
    admissionDate: '2025-01-16',
    dischargeStatus: 'pending' as const,
    physician: 'Dr. Michael Chen'
  },
  {
    id: 'PT003',
    name: 'Linda Davis',
    age: 72,
    room: 'A-301',
    diagnosis: 'Cardiac monitoring post-procedure',
    admissionDate: '2025-01-17',
    dischargeStatus: 'delayed' as const,
    physician: 'Dr. Amanda Rodriguez'
  },
  {
    id: 'PT004',
    name: 'William Thompson',
    age: 69,
    room: 'C-205',
    diagnosis: 'Diabetes management',
    admissionDate: '2025-01-18',
    dischargeStatus: 'ready' as const,
    physician: 'Dr. James Wilson'
  },
  {
    id: 'PT005',
    name: 'Dorothy Wilson',
    age: 81,
    room: 'B-208',
    diagnosis: 'Fall injury, observation',
    admissionDate: '2025-01-19',
    dischargeStatus: 'pending' as const,
    physician: 'Dr. Sarah Johnson'
  },
  {
    id: 'PT006',
    name: 'Charles Brown',
    age: 74,
    room: 'A-105',
    diagnosis: 'Post-surgical recovery',
    admissionDate: '2025-01-20',
    dischargeStatus: 'delayed' as const,
    physician: 'Dr. Michael Chen'
  }
];

export const mockDischargeData = {
  tasks: [
    { name: 'Physician discharge orders', completed: true, assignedTo: 'Dr. Johnson' },
    { name: 'Medication reconciliation', completed: true, assignedTo: 'PharmD' },
    { name: 'Patient education completed', completed: true, assignedTo: 'Nurse Smith' },
    { name: 'Transportation arranged', completed: false, assignedTo: 'Discharge Coord.' },
    { name: 'Follow-up appointments scheduled', completed: true, assignedTo: 'Case Manager' },
    { name: 'Equipment/supplies ordered', completed: false, assignedTo: 'Supply Chain' },
    { name: 'Insurance authorization', completed: true, assignedTo: 'Financial' }
  ],
  medications: [
    'Lisinopril 10mg daily',
    'Metformin 500mg twice daily',
    'Atorvastatin 20mg at bedtime',
    'Aspirin 81mg daily'
  ],
  expectedDischarge: 'Today, 2:00 PM',
  transportation: 'Family pickup arranged',
  followUp: 'Primary care in 1 week, Cardiology in 2 weeks',
  destination: 'Home with family support'
};

export const mockChatResponses: { [key: string]: string } = {
  'pending discharges,pending discharge,show pending': `Current pending discharges:

**Robert Martinez** (Room B-112)
- Status: Pending transportation arrangement
- Expected: Today 3:00 PM
- Issue: Waiting for family coordination

**Dorothy Wilson** (Room B-208)
- Status: Pending equipment delivery
- Expected: Tomorrow 10:00 AM  
- Issue: Walker delivery delayed

**Action needed:** Contact families and medical supply vendor.`,

  'patient readiness,readiness status,ready patients': `Patient Discharge Readiness Summary:

**Ready for Discharge (2 patients):**
• Margaret Johnson (A-204) - All criteria met, can discharge now
• William Thompson (C-205) - Documentation complete, family notified

**Pending (2 patients):**  
• Robert Martinez (B-112) - Transportation coordination needed
• Dorothy Wilson (B-208) - Medical equipment pending

**Delayed (2 patients):**
• Linda Davis (A-301) - Awaiting cardiology clearance
• Charles Brown (A-105) - Insurance authorization pending`,

  'delays,discharge delays,delayed discharges': `Today's Discharge Delays:

**Linda Davis** (Room A-301)
- Delay: 4 hours
- Reason: Waiting for cardiology final clearance
- Action: Dr. Rodriguez contacted, ETA 1 hour

**Charles Brown** (Room A-105)  
- Delay: 2 hours
- Reason: Insurance prior authorization for home oxygen
- Action: Financial team escalating with insurer

**Average delay today:** 2.5 hours
**Main delay causes:** Medical clearances (40%), Insurance (30%), Transportation (30%)`,

  'transportation,transport coordination,pickup': `Transportation Coordination Status:

**Arranged & Confirmed:**
• Margaret Johnson - Daughter pickup at 2:00 PM
• William Thompson - Medical transport at 4:00 PM

**Pending Coordination:**
• Robert Martinez - Family scheduling conflict, backup transport needed
• Dorothy Wilson - Son pickup tentative for tomorrow AM

**Recommendations:**
- Contact backup transport services for Martinez
- Confirm Wilson pickup time by end of day
- Update patient/family on any changes immediately`,

  'medication,medications,med reconciliation': `Medication Reconciliation Status:

**Completed:**
✓ Margaret Johnson - 4 medications reconciled, patient educated
✓ William Thompson - 3 medications, pharmacy verified
✓ Dorothy Wilson - 6 medications, complex regimen reviewed

**In Progress:**
⏳ Robert Martinez - Awaiting surgeon's final med orders
⏳ Linda Davis - Cardiology medications under review

**Issues:**
⚠️ Charles Brown - Insurance doesn't cover prescribed oxygen concentrator, seeking alternatives`,

  'documentation,paperwork,discharge papers': `Discharge Documentation Status:

**Complete & Ready:**
• Margaret Johnson - All forms signed, copies provided
• William Thompson - Documentation packet prepared

**Incomplete:**
• Robert Martinez - Missing PT evaluation summary
• Dorothy Wilson - Awaiting social work assessment
• Linda Davis - Cardiology discharge summary pending
• Charles Brown - Insurance forms need revision

**System Notes:**
- Electronic discharge summaries auto-generated for completed cases
- Reminder alerts sent to physicians for pending documentation`,

  'room,bed management,bed availability': `Current Bed Management Status:

**Discharge Impact:**
- 6 patients scheduled for discharge today
- 4 beds becoming available for admissions
- 2 discharges delayed, beds remain occupied

**Bed Availability:**
• Medical Unit A: 2 beds available after discharges
• Medical Unit B: 1 bed available  
• Medical Unit C: 1 bed available

**ED Holding:**
- 3 patients in ED awaiting medical beds
- Estimated bed turnover: 2 hours after discharge cleaning`,

  'family,contact,notification': `Family Communication Status:

**Successfully Contacted:**
• Johnson family - Confirmed 2 PM pickup
• Thompson family - Medical transport arranged, family notified
• Wilson family - Tentative pickup scheduled

**Needs Follow-up:**
• Martinez family - Scheduling conflict, need alternative
• Davis family - Delay notification sent, awaiting response
• Brown family - Insurance issue explained, solutions discussed

**Communication Protocol:**
- Discharge coordinator calls families 2 hours before discharge
- Text notifications sent for any delays
- Emergency contacts updated in system`
};