import { mockPatients, mockChatResponses } from '../data/mockData';

// Enhanced patient data with AI-friendly fields
interface EnhancedPatient {
  id: string;
  name: string;
  age: number;
  room: string;
  diagnosis: string;
  admissionDate: string;
  dischargeStatus: 'ready' | 'pending' | 'delayed';
  physician: string;
  keywords: string[];
  urgency: number;
  complexity: number;
  barriers: string[];
  nextSteps: string[];
}

// Intent classification
interface Intent {
  type: 'patient_query' | 'status_request' | 'workflow_management' | 'analytics' | 'help' | 'general';
  confidence: number;
  entities: any[];
}

// Smart AI Service
export class AIService {
  private patients: EnhancedPatient[];
  private conversationContext: any = {};

  constructor() {
    this.enhancePatientData();
  }

  private enhancePatientData() {
    this.patients = mockPatients.map(patient => ({
      ...patient,
      keywords: this.extractKeywords(patient.diagnosis + ' ' + patient.name),
      urgency: this.calculateUrgency(patient),
      complexity: this.calculateComplexity(patient),
      barriers: this.identifyBarriers(patient),
      nextSteps: this.generateNextSteps(patient)
    }));
  }

  private extractKeywords(text: string): string[] {
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2);
    
    return [...new Set(words)].slice(0, 10);
  }

  private calculateUrgency(patient: any): number {
    let urgency = 5;
    
    if (patient.dischargeStatus === 'delayed') urgency += 3;
    if (patient.dischargeStatus === 'pending') urgency += 1;
    
    if (patient.age > 80) urgency += 1;
    if (patient.age > 90) urgency += 1;
    
    const complexDiagnoses = ['cardiac', 'surgery', 'replacement', 'monitoring'];
    if (complexDiagnoses.some(d => patient.diagnosis.toLowerCase().includes(d))) {
      urgency += 2;
    }
    
    return Math.min(urgency, 10);
  }

  private calculateComplexity(patient: any): number {
    let complexity = 3;
    
    const complexTerms = ['surgery', 'replacement', 'monitoring', 'management'];
    complexity += complexTerms.filter(term => 
      patient.diagnosis.toLowerCase().includes(term)
    ).length;
    
    if (patient.age > 75) complexity += 1;
    
    return Math.min(complexity, 10);
  }

  private identifyBarriers(patient: any): string[] {
    const barriers = [];
    
    if (patient.dischargeStatus === 'delayed') {
      barriers.push('Medical clearance pending');
      barriers.push('Insurance authorization needed');
    }
    
    if (patient.dischargeStatus === 'pending') {
      barriers.push('Transportation coordination');
      barriers.push('Equipment delivery');
    }
    
    return barriers;
  }

  private generateNextSteps(patient: any): string[] {
    const steps = [];
    
    switch (patient.dischargeStatus) {
      case 'ready':
        steps.push('Confirm transportation');
        steps.push('Final patient education');
        steps.push('Discharge documentation');
        break;
      case 'pending':
        steps.push('Resolve pending items');
        steps.push('Coordinate with family');
        steps.push('Schedule follow-up');
        break;
      case 'delayed':
        steps.push('Escalate to physician');
        steps.push('Contact insurance');
        steps.push('Update family on delay');
        break;
    }
    
    return steps;
  }

  // Main AI processing function
  public async processQuery(userInput: string): Promise<string> {
    const intent = this.classifyIntent(userInput);
    const entities = this.extractEntities(userInput);
    
    this.updateContext(intent, entities);
    
    return this.generateResponse(intent, entities, userInput);
  }

  private classifyIntent(input: string): Intent {
    const lowerInput = input.toLowerCase();
    
    // Check for patient names
    const hasPatientName = this.patients.some(p => 
      lowerInput.includes(p.name.toLowerCase()) ||
      p.name.toLowerCase().split(' ').some(name => lowerInput.includes(name))
    );
    
    // Check for intent keywords
    const hasStatusWords = ['status', 'ready', 'pending', 'delayed', 'discharge'].some(word => 
      lowerInput.includes(word)
    );
    
    const hasWorkflowWords = ['transport', 'medication', 'document', 'room', 'bed', 'family'].some(word => 
      lowerInput.includes(word)
    );
    
    const hasAnalyticsWords = ['how many', 'count', 'average', 'metrics', 'summary', 'overview', 'today'].some(phrase => 
      lowerInput.includes(phrase)
    );
    
    const hasHelpWords = ['help', 'what can you do', 'how to'].some(phrase => 
      lowerInput.includes(phrase)
    );

    if (hasPatientName) {
      return {
        type: 'patient_query',
        confidence: 0.9,
        entities: this.extractPatientEntities(input)
      };
    }
    
    if (hasAnalyticsWords) {
      return {
        type: 'analytics',
        confidence: 0.85,
        entities: []
      };
    }
    
    if (hasStatusWords) {
      return {
        type: 'status_request',
        confidence: 0.8,
        entities: []
      };
    }
    
    if (hasWorkflowWords) {
      return {
        type: 'workflow_management',
        confidence: 0.75,
        entities: []
      };
    }
    
    if (hasHelpWords) {
      return {
        type: 'help',
        confidence: 0.9,
        entities: []
      };
    }
    
    return {
      type: 'general',
      confidence: 0.5,
      entities: []
    };
  }

  private extractEntities(input: string): any[] {
    const entities = [];
    const lowerInput = input.toLowerCase();
    
    // Extract patient names
    this.patients.forEach(patient => {
      if (lowerInput.includes(patient.name.toLowerCase()) ||
          patient.name.toLowerCase().split(' ').some(name => lowerInput.includes(name))) {
        entities.push({ type: 'patient', value: patient });
      }
    });
    
    // Extract room numbers
    const roomMatch = input.match(/[A-Z]-\d+/g);
    if (roomMatch) {
      entities.push(...roomMatch.map(room => ({ type: 'room', value: room })));
    }
    
    // Extract time references
    const timeWords = ['today', 'tomorrow', 'now', 'tonight'];
    timeWords.forEach(word => {
      if (lowerInput.includes(word)) {
        entities.push({ type: 'time', value: word });
      }
    });
    
    return entities;
  }

  private extractPatientEntities(input: string): any[] {
    return this.extractEntities(input).filter(e => e.type === 'patient');
  }

  private updateContext(intent: Intent, entities: any[]) {
    if (entities.length > 0) {
      this.conversationContext.lastEntities = entities;
    }
    this.conversationContext.lastIntent = intent;
  }

  private generateResponse(intent: Intent, entities: any[], originalInput: string): string {
    switch (intent.type) {
      case 'patient_query':
        return this.handlePatientQuery(entities, originalInput);
      
      case 'status_request':
        return this.handleStatusRequest(entities, originalInput);
      
      case 'workflow_management':
        return this.handleWorkflowQuery(entities, originalInput);
      
      case 'analytics':
        return this.handleAnalyticsQuery(entities, originalInput);
      
      case 'help':
        return this.generateHelpResponse();
      
      default:
        return this.generateIntelligentFallback(originalInput);
    }
  }

  private handlePatientQuery(entities: any[], input: string): string {
    const patientEntity = entities.find(e => e.type === 'patient');
    
    if (patientEntity) {
      const patient = patientEntity.value;
      return this.generatePatientSpecificResponse(patient, input);
    }
    
    // Fuzzy search for patient names
    const lowerInput = input.toLowerCase();
    const matchingPatient = this.patients.find(patient => 
      lowerInput.includes(patient.name.toLowerCase()) ||
      patient.name.toLowerCase().split(' ').some(name => lowerInput.includes(name))
    );
    
    if (matchingPatient) {
      return this.generatePatientSpecificResponse(matchingPatient, input);
    }
    
    return this.generatePatientListResponse(input);
  }

  private generatePatientSpecificResponse(patient: EnhancedPatient, input: string): string {
    const lowerInput = input.toLowerCase();
    const isStatusQuery = lowerInput.includes('status') || lowerInput.includes('how') || lowerInput.includes('what');
    
    let response = `**${patient.name} (Room ${patient.room})** - `;
    
    if (isStatusQuery) {
      response += `Discharge Status: ${patient.dischargeStatus.toUpperCase()}\n\n`;
      
      if (patient.dischargeStatus === 'ready') {
        response += `✅ **All discharge criteria met**\n`;
        response += `- Physician orders: Complete\n`;
        response += `- Medications reconciled: Ready\n`;
        response += `- Patient education: Completed\n`;
        response += `- Transportation: Arranged\n`;
        response += `- Follow-up: Scheduled\n\n`;
        response += `**Ready for immediate discharge** - No barriers identified.`;
      } else if (patient.dischargeStatus === 'pending') {
        response += `⏳ **Pending Items:**\n`;
        response += patient.barriers.map(barrier => `- ${barrier}`).join('\n');
        response += `\n\n✅ **Completed:**\n`;
        response += `- Medical treatment on track\n`;
        response += `- Discharge planning initiated\n\n`;
        response += `**Next Steps:** ${patient.nextSteps.join(', ')}`;
      } else {
        response += `🔴 **Delayed Discharge**\n`;
        response += `**Barriers:** ${patient.barriers.join(', ')}\n`;
        response += `**Urgency Level:** ${patient.urgency}/10\n`;
        response += `**Complexity:** ${patient.complexity}/10\n\n`;
        response += `**Action Required:** ${patient.nextSteps.join(', ')}`;
      }
    } else {
      response += `**General Information:**\n`;
      response += `- Age: ${patient.age}\n`;
      response += `- Diagnosis: ${patient.diagnosis}\n`;
      response += `- Physician: ${patient.physician}\n`;
      response += `- Admission: ${new Date(patient.admissionDate).toLocaleDateString()}\n`;
      response += `- Status: ${patient.dischargeStatus}\n\n`;
      response += `**Keywords:** ${patient.keywords.join(', ')}`;
    }
    
    return response;
  }

  private generatePatientListResponse(input: string): string {
    const lowerInput = input.toLowerCase();
    const isReadyQuery = lowerInput.includes('ready') || lowerInput.includes('can go');
    const isPendingQuery = lowerInput.includes('pending') || lowerInput.includes('waiting');
    const isDelayedQuery = lowerInput.includes('delayed') || lowerInput.includes('stuck');
    
    let filteredPatients = this.patients;
    
    if (isReadyQuery) {
      filteredPatients = this.patients.filter(p => p.dischargeStatus === 'ready');
    } else if (isPendingQuery) {
      filteredPatients = this.patients.filter(p => p.dischargeStatus === 'pending');
    } else if (isDelayedQuery) {
      filteredPatients = this.patients.filter(p => p.dischargeStatus === 'delayed');
    }
    
    const statusGroups = {
      ready: filteredPatients.filter(p => p.dischargeStatus === 'ready'),
      pending: filteredPatients.filter(p => p.dischargeStatus === 'pending'),
      delayed: filteredPatients.filter(p => p.dischargeStatus === 'delayed')
    };
    
    let response = `**Patient Discharge Overview:**\n\n`;
    
    if (statusGroups.ready.length > 0) {
      response += `🟢 **Ready for Discharge (${statusGroups.ready.length}):**\n`;
      statusGroups.ready.forEach(p => {
        response += `• ${p.name} (${p.room}) - ${p.diagnosis}\n`;
      });
      response += `\n`;
    }
    
    if (statusGroups.pending.length > 0) {
      response += `🟡 **Pending Discharge (${statusGroups.pending.length}):**\n`;
      statusGroups.pending.forEach(p => {
        response += `• ${p.name} (${p.room}) - ${p.diagnosis}\n`;
      });
      response += `\n`;
    }
    
    if (statusGroups.delayed.length > 0) {
      response += `🔴 **Delayed Discharge (${statusGroups.delayed.length}):**\n`;
      statusGroups.delayed.forEach(p => {
        response += `• ${p.name} (${p.room}) - ${p.diagnosis}\n`;
      });
      response += `\n`;
    }
    
    response += `**Total: ${filteredPatients.length} patients**`;
    
    return response;
  }

  private handleStatusRequest(entities: any[], input: string): string {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('delay') || lowerInput.includes('delayed')) {
      return this.generateDelayAnalysis();
    }
    
    if (lowerInput.includes('transport') || lowerInput.includes('pickup')) {
      return this.generateTransportationStatus();
    }
    
    if (lowerInput.includes('medication') || lowerInput.includes('med')) {
      return this.generateMedicationStatus();
    }
    
    return this.generateGeneralStatus();
  }

  private generateDelayAnalysis(): string {
    const delayedPatients = this.patients.filter(p => p.dischargeStatus === 'delayed');
    const avgUrgency = delayedPatients.reduce((sum, p) => sum + p.urgency, 0) / delayedPatients.length;
    
    let response = `**Discharge Delay Analysis:**\n\n`;
    response += `🔴 **Delayed Patients: ${delayedPatients.length}**\n`;
    response += `📊 **Average Urgency Level: ${avgUrgency.toFixed(1)}/10**\n\n`;
    
    delayedPatients.forEach(patient => {
      response += `**${patient.name} (${patient.room})**\n`;
      response += `- Urgency: ${patient.urgency}/10\n`;
      response += `- Complexity: ${patient.complexity}/10\n`;
      response += `- Barriers: ${patient.barriers.join(', ')}\n`;
      response += `- Next Steps: ${patient.nextSteps.join(', ')}\n\n`;
    });
    
    return response;
  }

  private generateTransportationStatus(): string {
    const readyPatients = this.patients.filter(p => p.dischargeStatus === 'ready');
    const pendingPatients = this.patients.filter(p => p.dischargeStatus === 'pending');
    
    let response = `**Transportation Coordination Status:**\n\n`;
    
    response += `✅ **Confirmed & Ready (${readyPatients.length}):**\n`;
    readyPatients.forEach(p => {
      response += `• ${p.name} - Transportation arranged\n`;
    });
    
    response += `\n⏳ **Pending Coordination (${pendingPatients.length}):**\n`;
    pendingPatients.forEach(p => {
      response += `• ${p.name} - ${p.barriers.find(b => b.includes('transport')) || 'Coordination needed'}\n`;
    });
    
    return response;
  }

  private generateMedicationStatus(): string {
    const patients = this.patients;
    const completed = patients.filter(p => p.dischargeStatus === 'ready').length;
    const pending = patients.filter(p => p.dischargeStatus === 'pending').length;
    const delayed = patients.filter(p => p.dischargeStatus === 'delayed').length;
    
    let response = `**Medication Reconciliation Status:**\n\n`;
    response += `✅ **Completed: ${completed} patients**\n`;
    response += `⏳ **In Progress: ${pending} patients**\n`;
    response += `🔴 **Delayed: ${delayed} patients**\n\n`;
    response += `**System Notes:**\n`;
    response += `- Electronic medication reconciliation active\n`;
    response += `- Pharmacy verification in progress\n`;
    response += `- Patient education materials prepared`;
    
    return response;
  }

  private generateGeneralStatus(): string {
    const totalPatients = this.patients.length;
    const readyCount = this.patients.filter(p => p.dischargeStatus === 'ready').length;
    const pendingCount = this.patients.filter(p => p.dischargeStatus === 'pending').length;
    const delayedCount = this.patients.filter(p => p.dischargeStatus === 'delayed').length;
    
    const avgUrgency = this.patients.reduce((sum, p) => sum + p.urgency, 0) / totalPatients;
    const avgComplexity = this.patients.reduce((sum, p) => sum + p.complexity, 0) / totalPatients;
    
    let response = `**Overall Discharge Status Summary:**\n\n`;
    response += `📊 **Patient Distribution:**\n`;
    response += `• Total: ${totalPatients} patients\n`;
    response += `• Ready: ${readyCount} (${((readyCount/totalPatients)*100).toFixed(1)}%)\n`;
    response += `• Pending: ${pendingCount} (${((pendingCount/totalPatients)*100).toFixed(1)}%)\n`;
    response += `• Delayed: ${delayedCount} (${((delayedCount/totalPatients)*100).toFixed(1)}%)\n\n`;
    response += `📈 **Metrics:**\n`;
    response += `• Average Urgency: ${avgUrgency.toFixed(1)}/10\n`;
    response += `• Average Complexity: ${avgComplexity.toFixed(1)}/10\n`;
    response += `• Discharge Efficiency: ${((readyCount/totalPatients)*100).toFixed(1)}%`;
    
    return response;
  }

  private handleWorkflowQuery(entities: any[], input: string): string {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('transport') || lowerInput.includes('pickup')) {
      return mockChatResponses['transportation,transport coordination,pickup'];
    }
    
    if (lowerInput.includes('medication') || lowerInput.includes('med')) {
      return mockChatResponses['medication,medications,med reconciliation'];
    }
    
    if (lowerInput.includes('document') || lowerInput.includes('paperwork')) {
      return mockChatResponses['documentation,paperwork,discharge papers'];
    }
    
    if (lowerInput.includes('room') || lowerInput.includes('bed')) {
      return mockChatResponses['room,bed management,bed availability'];
    }
    
    if (lowerInput.includes('family') || lowerInput.includes('contact')) {
      return mockChatResponses['family,contact,notification'];
    }
    
    return this.generateWorkflowOverview();
  }

  private generateWorkflowOverview(): string {
    let response = `**Discharge Workflow Overview:**\n\n`;
    response += `🔄 **Current Workflow Status:**\n`;
    response += `• 6 patients in discharge planning\n`;
    response += `• 2 ready for immediate discharge\n`;
    response += `• 4 with pending workflow items\n\n`;
    response += `📋 **Active Workflows:**\n`;
    response += `• Transportation coordination: 2 pending\n`;
    response += `• Medication reconciliation: 3 completed, 3 in progress\n`;
    response += `• Documentation: 4 complete, 2 pending\n`;
    response += `• Family communication: 5 contacted, 1 pending\n\n`;
    response += `🎯 **Priority Actions:**\n`;
    response += `• Resolve Martinez transport issue\n`;
    response += `• Complete Davis cardiology clearance\n`;
    response += `• Expedite Brown insurance authorization`;
    
    return response;
  }

  private handleAnalyticsQuery(entities: any[], input: string): string {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('how many') || lowerInput.includes('count')) {
      return this.generatePatientCounts();
    }
    
    if (lowerInput.includes('average') || lowerInput.includes('metrics')) {
      return this.generateMetrics();
    }
    
    if (lowerInput.includes('today') || lowerInput.includes('now')) {
      return this.generateTodaySummary();
    }
    
    return this.generateComprehensiveAnalytics();
  }

  private generatePatientCounts(): string {
    const totalPatients = this.patients.length;
    const readyCount = this.patients.filter(p => p.dischargeStatus === 'ready').length;
    const pendingCount = this.patients.filter(p => p.dischargeStatus === 'pending').length;
    const delayedCount = this.patients.filter(p => p.dischargeStatus === 'delayed').length;
    
    let response = `**Patient Count Summary:**\n\n`;
    response += `📊 **Current Census:**\n`;
    response += `• Total patients: ${totalPatients}\n`;
    response += `• Ready for discharge: ${readyCount}\n`;
    response += `• Pending discharge: ${pendingCount}\n`;
    response += `• Delayed discharge: ${delayedCount}\n\n`;
    response += `📈 **Discharge Readiness:**\n`;
    response += `• ${((readyCount/totalPatients)*100).toFixed(1)}% ready for discharge\n`;
    response += `• ${((pendingCount/totalPatients)*100).toFixed(1)}% pending items\n`;
    response += `• ${((delayedCount/totalPatients)*100).toFixed(1)}% experiencing delays`;
    
    return response;
  }

  private generateMetrics(): string {
    const avgUrgency = this.patients.reduce((sum, p) => sum + p.urgency, 0) / this.patients.length;
    const avgComplexity = this.patients.reduce((sum, p) => sum + p.complexity, 0) / this.patients.length;
    const highUrgencyPatients = this.patients.filter(p => p.urgency >= 8).length;
    const highComplexityPatients = this.patients.filter(p => p.complexity >= 8).length;
    
    let response = `**Discharge Metrics:**\n\n`;
    response += `📊 **Average Scores:**\n`;
    response += `• Urgency Level: ${avgUrgency.toFixed(1)}/10\n`;
    response += `• Complexity Level: ${avgComplexity.toFixed(1)}/10\n\n`;
    response += `🚨 **High Priority Patients:**\n`;
    response += `• High urgency (8+): ${highUrgencyPatients} patients\n`;
    response += `• High complexity (8+): ${highComplexityPatients} patients\n\n`;
    response += `📈 **Performance Indicators:**\n`;
    response += `• Discharge efficiency: ${((this.patients.filter(p => p.dischargeStatus === 'ready').length/this.patients.length)*100).toFixed(1)}%\n`;
    response += `• Delay rate: ${((this.patients.filter(p => p.dischargeStatus === 'delayed').length/this.patients.length)*100).toFixed(1)}%`;
    
    return response;
  }

  private generateTodaySummary(): string {
    const today = new Date();
    const readyPatients = this.patients.filter(p => p.dischargeStatus === 'ready');
    const pendingPatients = this.patients.filter(p => p.dischargeStatus === 'pending');
    const delayedPatients = this.patients.filter(p => p.dischargeStatus === 'delayed');
    
    let response = `**Today's Discharge Summary (${today.toLocaleDateString()}):**\n\n`;
    response += `📅 **Today's Schedule:**\n`;
    response += `• Scheduled discharges: ${this.patients.length} patients\n`;
    response += `• Ready to go: ${readyPatients.length} patients\n`;
    response += `• Pending items: ${pendingPatients.length} patients\n`;
    response += `• Delayed discharges: ${delayedPatients.length} patients\n\n`;
    response += `⚡ **Immediate Actions:**\n`;
    delayedPatients.forEach(p => {
      response += `• ${p.name}: ${p.nextSteps[0]}\n`;
    });
    response += `\n🎯 **Goal:** Complete ${readyPatients.length + Math.floor(pendingPatients.length/2)} discharges by 5 PM`;
    
    return response;
  }

  private generateComprehensiveAnalytics(): string {
    let response = `**Comprehensive Discharge Analytics:**\n\n`;
    response += `📊 **Patient Distribution:**\n`;
    response += `• Total: ${this.patients.length} patients\n`;
    response += `• Ready: ${this.patients.filter(p => p.dischargeStatus === 'ready').length}\n`;
    response += `• Pending: ${this.patients.filter(p => p.dischargeStatus === 'pending').length}\n`;
    response += `• Delayed: ${this.patients.filter(p => p.dischargeStatus === 'delayed').length}\n\n`;
    response += `📈 **Performance Metrics:**\n`;
    response += `• Average urgency: ${(this.patients.reduce((sum, p) => sum + p.urgency, 0) / this.patients.length).toFixed(1)}/10\n`;
    response += `• Average complexity: ${(this.patients.reduce((sum, p) => sum + p.complexity, 0) / this.patients.length).toFixed(1)}/10\n`;
    response += `• Discharge readiness: ${((this.patients.filter(p => p.dischargeStatus === 'ready').length/this.patients.length)*100).toFixed(1)}%\n\n`;
    response += `🎯 **Recommendations:**\n`;
    response += `• Focus on high-urgency delayed patients\n`;
    response += `• Expedite transportation coordination\n`;
    response += `• Streamline documentation processes`;
    
    return response;
  }

  private generateHelpResponse(): string {
    let response = `**AI Discharge Assistant - Help Guide**\n\n`;
    response += `🤖 **I'm your intelligent discharge coordinator!**\n\n`;
    response += `📋 **Patient Queries:**\n`;
    response += `• "Show me Margaret Johnson's status"\n`;
    response += `• "What's the discharge status for Robert Martinez?"\n`;
    response += `• "Patient list overview"\n`;
    response += `• "Who's ready for discharge?"\n\n`;
    response += `🚨 **Workflow Management:**\n`;
    response += `• "What delays do we have today?"\n`;
    response += `• "Transportation status update"\n`;
    response += `• "Medication reconciliation status"\n`;
    response += `• "Documentation completion"\n\n`;
    response += `📊 **Analytics & Reports:**\n`;
    response += `• "How many patients are ready?"\n`;
    response += `• "Today's discharge summary"\n`;
    response += `• "Average length of stay"\n`;
    response += `• "Discharge metrics"\n\n`;
    response += `💡 **Smart Features:**\n`;
    response += `• Natural language understanding\n`;
    response += `• Context-aware responses\n`;
    response += `• Intelligent patient matching\n`;
    response += `• Predictive analytics\n\n`;
    response += `**Just ask me naturally - I understand healthcare terminology!**`;
    
    return response;
  }

  private generateIntelligentFallback(input: string): string {
    // Try to find relevant patient based on keywords
    const inputWords = input.toLowerCase().split(/\s+/);
    const relevantPatient = this.patients.find(patient => 
      patient.keywords.some(keyword => 
        inputWords.some(word => word.includes(keyword) || keyword.includes(word))
      )
    );
    
    if (relevantPatient) {
      return `I understand you're asking about patient discharge information. Let me help you with ${relevantPatient.name}:\n\n${this.generatePatientSpecificResponse(relevantPatient, input)}`;
    }
    
    // Try to find similar responses
    const similarResponses = Object.keys(mockChatResponses).map(key => ({
      key,
      similarity: this.calculateSimilarity(input.toLowerCase(), key.toLowerCase())
    }));
    
    const bestResponse = similarResponses.sort((a, b) => b.similarity - a.similarity)[0];
    
    if (bestResponse.similarity > 0.3) {
      return mockChatResponses[bestResponse.key];
    }
    
    let response = `I understand you're asking about "${input}". Let me provide you with relevant discharge information:\n\n`;
    response += `📊 **Current Status:**\n`;
    response += `• ${this.patients.length} patients in discharge planning\n`;
    response += `• ${this.patients.filter(p => p.dischargeStatus === 'ready').length} ready for discharge\n`;
    response += `• ${this.patients.filter(p => p.dischargeStatus === 'delayed').length} experiencing delays\n\n`;
    response += `💡 **Try asking:**\n`;
    response += `• "Show me ready patients"\n`;
    response += `• "What delays exist?"\n`;
    response += `• "Patient status for [name]"\n`;
    response += `• "Today's discharge summary"\n\n`;
    response += `I'm designed to understand natural healthcare language - feel free to ask specific questions!`;
    
    return response;
  }

  private calculateSimilarity(str1: string, str2: string): number {
    const words1 = str1.split(/\s+/);
    const words2 = str2.split(/\s+/);
    const commonWords = words1.filter(word => words2.includes(word));
    return commonWords.length / Math.max(words1.length, words2.length);
  }
}

// Export singleton instance
export const aiService = new AIService();
