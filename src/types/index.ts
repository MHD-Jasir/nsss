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
  id: string; // Custom alphanumeric ID
  name: string;
  department: string;
  password: string;
  createdAt: string;
  profileImageUrl?: string; // Optional profile picture
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

// Department management
export interface Department {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
}

// STORIES gallery types
export type MediaType = 'image' | 'video';

export interface StoryMediaItem {
  id: string;
  type: MediaType;
  url: string;
  title?: string;
  createdAt: string;
}

export interface StoryAlbum {
  id: string;
  name: string; // e.g., program folder name
  media: StoryMediaItem[];
  createdAt: string;
}

export interface StoryBatch {
  id: string;
  name: string; // e.g., 2024-25 Batch
  albums: StoryAlbum[];
  featuredMediaIds: string[]; // selected for top slider
  createdAt: string;
}