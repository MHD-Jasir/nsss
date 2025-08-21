export interface Program {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  coordinatorIds: string[]; // Array of student IDs who are coordinators
  createdAt: string;
  updatedAt: string;
  students?: Student[];
  participantIds?: string[]; // Array of student IDs who are participants
}

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  email: string;
  year: string;
  department: string;
  programId: string;
}

// New interfaces for the authentication system
export interface RegisteredStudent {
  id: string; // 3-digit ID
  name: string;
  department: string;
  password: string;
  createdAt: string;
}

export interface Coordinator {
  id: string;
  name: string;
  department: string;
  password: string;
  isActive: boolean;
  createdAt: string;
}

export interface Certificate {
  programId: string;
  studentName: string;
  studentDepartment: string;
  programTitle: string;
  date: string;
  time: string;
  venue: string;
  coordinator: string;
}

// Reporting structures for Program Officer
export interface StudentExtraActivity {
  id: string;
  badge: 'green' | 'yellow';
  title: string;
  content: string;
  createdAt: string;
}

export interface CoordinatedProgram {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  createdAt: string;
}

export interface StudentReport {
  activities: StudentExtraActivity[];
  coordinatedPrograms: CoordinatedProgram[]; // Programs where this student is a coordinator
}