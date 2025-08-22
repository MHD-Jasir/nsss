import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { TeacherPortal } from './components/TeacherPortal';
import { StudentPortal } from './components/StudentPortal';
import { ProgramOfficerPortal } from './components/ProgramOfficerPortal';
import { LoginPage } from './components/LoginPage';
import { ProgramsPage } from './components/ProgramsPage';
import { StoryBatch, StoryAlbum, StoryMediaItem } from './types';
import { mockPrograms } from './data/mockData';
import { Program, RegisteredStudent, Coordinator, StudentReport, Department } from './types';

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'programs' | 'stories' | 'login' | 'student' | 'coordinator' | 'officer'>('home');
  const [programs, setPrograms] = useState<Program[]>(mockPrograms);
  const [registeredStudents, setRegisteredStudents] = useState<RegisteredStudent[]>([
    {
      id: '101',
      name: 'John Doe',
      department: 'Computer Science',
      password: 'student123',
      createdAt: new Date().toISOString(),
    },
    {
      id: '102',
      name: 'Jane Smith',
      department: 'Electronics',
      password: 'student456',
      createdAt: new Date().toISOString(),
    },
    {
      id: '103',
      name: 'Mike Johnson',
      department: 'Mechanical',
      password: 'student789',
      createdAt: new Date().toISOString(),
    },
  ]);
  
  const [coordinators, setCoordinators] = useState<Coordinator[]>([
    {
      id: 'COORD1001',
      name: 'Dr. Sarah Johnson',
      department: 'NSS Coordinator',
      password: 'coord123',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'COORD1002',
      name: 'Prof. Michael Chen',
      department: 'Environmental Science',
      password: 'coord456',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
  ]);
  
  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<{
    type: 'student' | 'coordinator' | 'officer';
    data: RegisteredStudent | Coordinator | { id: string; name: string };
  } | null>(null);

  // Reports keyed by studentId
  const [studentReports, setStudentReports] = useState<Record<string, StudentReport>>({});

  // STORIES state: batches -> albums -> media
  const [storyBatches, setStoryBatches] = useState<StoryBatch[]>([{
    id: 'batch-2024',
    name: '2024-25 Batch',
    createdAt: new Date().toISOString(),
    featuredMediaIds: [],
    albums: [
      {
        id: 'album-1',
        name: 'Orientation Program',
        createdAt: new Date().toISOString(),
        media: []
      }
    ]
  }]);
  const [currentBatchId, setCurrentBatchId] = useState<string>('batch-2024');

  // Department management
  const [departments, setDepartments] = useState<Department[]>([
    { id: 'dept-1', name: 'Mathematics', isActive: true, createdAt: new Date().toISOString() },
    { id: 'dept-2', name: 'Physics', isActive: true, createdAt: new Date().toISOString() },
    { id: 'dept-3', name: 'Chemistry', isActive: true, createdAt: new Date().toISOString() },
    { id: 'dept-4', name: 'Microbiology', isActive: true, createdAt: new Date().toISOString() },
    { id: 'dept-5', name: 'History', isActive: true, createdAt: new Date().toISOString() },
    { id: 'dept-6', name: 'English', isActive: true, createdAt: new Date().toISOString() },
    { id: 'dept-7', name: 'ASM', isActive: true, createdAt: new Date().toISOString() },
    { id: 'dept-8', name: 'BBA', isActive: true, createdAt: new Date().toISOString() },
    { id: 'dept-9', name: 'BCOM', isActive: true, createdAt: new Date().toISOString() },
    { id: 'dept-10', name: 'Computer Science', isActive: true, createdAt: new Date().toISOString() },
    { id: 'dept-11', name: 'Economics', isActive: true, createdAt: new Date().toISOString() },
  ]);

  // Program Officer credentials (hardcoded for demo)
  const [officerCredentials, setOfficerCredentials] = useState({ id: 'OFFICER001', password: 'NSS@OFFICER2025' });

  // Auto-logout functionality
  const logoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds

  // Auto-logout function
  const handleAutoLogout = useCallback(() => {
    alert('You have been automatically logged out due to inactivity (30 minutes).');
    handleLogout();
  }, []);

  // Reset logout timer on user activity
  const resetLogoutTimer = useCallback(() => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
    }
    
    if (isLoggedIn) {
      logoutTimerRef.current = setTimeout(() => {
        handleAutoLogout();
      }, INACTIVITY_TIMEOUT);
    }
  }, [isLoggedIn, INACTIVITY_TIMEOUT, handleAutoLogout]);

  // Set up activity listeners when user is logged in
  useEffect(() => {
    if (isLoggedIn) {
      resetLogoutTimer();
      
      // Add event listeners for user activity
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
      
      const handleUserActivity = () => {
        resetLogoutTimer();
      };
      
      events.forEach(event => {
        document.addEventListener(event, handleUserActivity, true);
      });
      
      // Cleanup function
      return () => {
        events.forEach(event => {
          document.removeEventListener(event, handleUserActivity, true);
        });
        if (logoutTimerRef.current) {
          clearTimeout(logoutTimerRef.current);
        }
      };
    } else {
      // Clear timer when not logged in
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
        logoutTimerRef.current = null;
      }
    }
  }, [isLoggedIn, resetLogoutTimer]);

  // Cleanup timer on component unmount
  useEffect(() => {
    return () => {
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
      }
    };
  }, []);

  const handleLogin = (credentials: { id: string; password: string }) => {
    // Officer first (single set of credentials)
    if (credentials.id === officerCredentials.id && credentials.password === officerCredentials.password) {
      setCurrentUser({ type: 'officer', data: { id: credentials.id, name: 'Program Officer' } });
      setIsLoggedIn(true);
      setCurrentView('officer');
      return;
    }

    // Coordinator next (must be active)
    const coordinator = coordinators.find(c => c.id === credentials.id && c.password === credentials.password && c.isActive);
    if (coordinator) {
      setCurrentUser({ type: 'coordinator', data: coordinator });
      setIsLoggedIn(true);
      setCurrentView('coordinator');
      return;
    }

    // Student last
    const student = registeredStudents.find(s => s.id === credentials.id && s.password === credentials.password);
    if (student) {
      setCurrentUser({ type: 'student', data: student });
      setIsLoggedIn(true);
      setCurrentView('student');
      return;
    }

    alert('Invalid credentials');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCurrentView('home');
    
    // Clear the logout timer
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }
  };

  const handleAddProgram = (programData: Omit<Program, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProgram: Program = {
      ...programData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      participantIds: [],
    };
    setPrograms(prev => [newProgram, ...prev]);
    
    // Update student reports for coordinators
    if (programData.coordinatorIds && programData.coordinatorIds.length > 0) {
      setStudentReports(prev => {
        const updated = { ...prev };
        programData.coordinatorIds.forEach(studentId => {
          const existingReport = updated[studentId];
          const coordinatedProgram = {
            id: newProgram.id,
            title: newProgram.title,
            description: newProgram.description,
            date: newProgram.date,
            time: newProgram.time,
            venue: newProgram.venue,
            createdAt: newProgram.createdAt,
          };
          
          if (existingReport) {
            updated[studentId] = {
              ...existingReport,
              coordinatedPrograms: [coordinatedProgram, ...existingReport.coordinatedPrograms],
            };
          } else {
            updated[studentId] = {
              activities: [],
              coordinatedPrograms: [coordinatedProgram],
            };
          }
        });
        return updated;
      });
    }
  };

  const handleEditProgram = (id: string, programData: Omit<Program, 'id' | 'createdAt' | 'updatedAt'>) => {
    // Get the old program to compare coordinators
    const oldProgram = programs.find(p => p.id === id);
    
    setPrograms(prev => prev.map(program => 
      program.id === id 
        ? { ...program, ...programData, updatedAt: new Date().toISOString() }
        : program
    ));
    
    // Update student reports if coordinators changed
    if (oldProgram && programData.coordinatorIds) {
      // Remove program from old coordinators' reports
      if (oldProgram.coordinatorIds) {
        setStudentReports(prev => {
          const updated = { ...prev };
                     oldProgram.coordinatorIds.forEach(studentId => {
             if (updated[studentId]) {
               updated[studentId] = {
                 ...updated[studentId],
                 coordinatedPrograms: (updated[studentId].coordinatedPrograms || []).filter(p => p.id !== id)
               };
             }
           });
          return updated;
        });
      }
      
      // Add program to new coordinators' reports
      if (programData.coordinatorIds.length > 0) {
        setStudentReports(prev => {
          const updated = { ...prev };
          const coordinatedProgram = {
            id: id,
            title: programData.title,
            description: programData.description,
            date: programData.date,
            time: programData.time,
            venue: programData.venue,
            createdAt: oldProgram.createdAt,
          };
          
          programData.coordinatorIds.forEach(studentId => {
            const existingReport = updated[studentId];
            if (existingReport) {
              updated[studentId] = {
                ...existingReport,
                coordinatedPrograms: [coordinatedProgram, ...existingReport.coordinatedPrograms.filter(p => p.id !== id)]
              };
            } else {
              updated[studentId] = {
                activities: [],
                coordinatedPrograms: [coordinatedProgram]
              };
            }
          });
          return updated;
        });
      }
    }
  };

  const handleDeleteProgram = (id: string) => {
    setPrograms(prev => prev.filter(program => program.id !== id));
  };

  const handleAddParticipants = (programId: string, studentIds: string[]) => {
    setPrograms(prev => prev.map(program => 
      program.id === programId 
        ? { ...program, participantIds: studentIds, updatedAt: new Date().toISOString() }
        : program
    ));
  };

  const handleAddStudent = (studentData: Omit<RegisteredStudent, 'createdAt'>) => {
    const newStudent: RegisteredStudent = {
      ...studentData,
      createdAt: new Date().toISOString(),
    };
    setRegisteredStudents(prev => [...prev, newStudent]);
  };

  const handleAddCoordinator = (coordinatorData: Omit<Coordinator, 'id' | 'createdAt'>) => {
    const newCoordinator: Coordinator = {
      ...coordinatorData,
      id: 'COORD' + (Math.floor(Math.random() * 9000) + 1000).toString(), // Generate COORD + 4-digit ID
      createdAt: new Date().toISOString(),
    };
    setCoordinators(prev => [...prev, newCoordinator]);
  };

  const handleToggleCoordinatorAccess = (id: string) => {
    setCoordinators(prev => prev.map(coordinator =>
      coordinator.id === id
        ? { ...coordinator, isActive: !coordinator.isActive }
        : coordinator
    ));
  };

  const handleEditStudent = (id: string, updates: { name: string; department: string; password: string; profileImageUrl?: string }) => {
    setRegisteredStudents(prev => prev.map(student =>
      student.id === id ? { ...student, ...updates } : student
    ));
  };

  const handleEditCoordinator = (id: string, updates: { name: string; department: string; password: string }) => {
    setCoordinators(prev => prev.map(coordinator =>
      coordinator.id === id ? { ...coordinator, ...updates } : coordinator
    ));
  };

  const handleDeleteStudent = (id: string) => {
    setRegisteredStudents(prev => prev.filter(student => student.id !== id));
    // Also remove from all program participants
    setPrograms(prev => prev.map(program => ({
      ...program,
      participantIds: program.participantIds?.filter(participantId => participantId !== id) || []
    })));
    // Remove report data for this student
    setStudentReports(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const handleDeleteCoordinator = (id: string) => {
    setCoordinators(prev => prev.filter(coordinator => coordinator.id !== id));
  };

  const handleUpdateOfficerPassword = (newPassword: string) => {
    setOfficerCredentials(prev => ({ ...prev, password: newPassword }));
  };

  // Department management functions
  const handleAddDepartment = (name: string) => {
    const newDepartment: Department = {
      id: 'dept-' + Date.now(),
      name,
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    setDepartments(prev => [...prev, newDepartment]);
  };

  const handleEditDepartment = (id: string, newName: string) => {
    const oldDepartment = departments.find(d => d.id === id);
    if (!oldDepartment) return;

    // Update department name
    setDepartments(prev => prev.map(d => 
      d.id === id ? { ...d, name: newName } : d
    ));

    // Propagate department name change to all students
    setRegisteredStudents(prev => prev.map(student => 
      student.department === oldDepartment.name 
        ? { ...student, department: newName }
        : student
    ));
  };

  const handleToggleDepartment = (id: string) => {
    setDepartments(prev => prev.map(d => 
      d.id === id ? { ...d, isActive: !d.isActive } : d
    ));
  };
  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <HomePage programs={programs} />;
      case 'programs':
        return <ProgramsPage programs={programs} />;
      case 'stories':
        if (isLoggedIn) {
          const StoriesPage = React.lazy(() => import('./components/StoriesPage'));
          return (
            <React.Suspense fallback={<div className="p-6">Loading...</div>}>
              <StoriesPage
                batches={storyBatches}
                currentBatchId={currentBatchId}
                setCurrentBatchId={setCurrentBatchId}
                canManage={currentUser?.type === 'coordinator' || currentUser?.type === 'officer'}
                isOfficer={currentUser?.type === 'officer'}
                onCreateBatch={(name) => {
                  const newBatch: StoryBatch = { id: 'batch-' + Date.now(), name, albums: [], featuredMediaIds: [], createdAt: new Date().toISOString() };
                  setStoryBatches(prev => [newBatch, ...prev]);
                  setCurrentBatchId(newBatch.id);
                }}
                onCreateAlbum={(batchId, name) => {
                  setStoryBatches(prev => prev.map(b => b.id === batchId ? { ...b, albums: [{ id: 'album-' + Date.now(), name, media: [], createdAt: new Date().toISOString() }, ...b.albums] } : b));
                }}
                onDeleteMedia={(batchId, albumId, mediaId) => {
                  setStoryBatches(prev => prev.map(b => b.id === batchId ? { ...b, albums: b.albums.map(a => a.id === albumId ? { ...a, media: a.media.filter(m => m.id !== mediaId) } : a), featuredMediaIds: b.featuredMediaIds.filter(id => id !== mediaId) } : b));
                }}
                onAddMedia={(batchId, albumId, files) => {
                  const newItems: StoryMediaItem[] = files.map(f => ({ id: 'media-' + Date.now() + '-' + Math.random().toString(36).slice(2,8), type: f.type.startsWith('video') ? 'video' : 'image', url: URL.createObjectURL(f), title: f.name, createdAt: new Date().toISOString() }));
                  setStoryBatches(prev => prev.map(b => b.id === batchId ? { ...b, albums: b.albums.map(a => a.id === albumId ? { ...a, media: [...newItems, ...a.media] } : a) } : b));
                }}
                onToggleFeatured={(batchId, mediaId) => {
                  setStoryBatches(prev => prev.map(b => b.id === batchId ? { ...b, featuredMediaIds: b.featuredMediaIds.includes(mediaId) ? b.featuredMediaIds.filter(id => id !== mediaId) : [...b.featuredMediaIds, mediaId] } : b));
                }}
                onMergeCurrentAlbumToSingle={(batchId) => {
                  // No-op placeholder; UI will just present action confirmation
                }}
              />
            </React.Suspense>
          );
        }
        return <LoginPage onLogin={handleLogin} onBack={() => setCurrentView('home')} />;
      case 'login':
        return <LoginPage onLogin={handleLogin} onBack={() => setCurrentView('home')} />;
      case 'student':
        if (isLoggedIn && currentUser?.type === 'student') {
          return (
            <StudentPortal 
              programs={programs} 
              currentStudent={currentUser.data as RegisteredStudent}
            />
          );
        }
        return <LoginPage onLogin={handleLogin} onBack={() => setCurrentView('home')} />;
      case 'coordinator':
        if (isLoggedIn && (currentUser?.type === 'coordinator' || currentUser?.type === 'officer')) {
          return (
            <TeacherPortal
              programs={programs}
              registeredStudents={registeredStudents}
              onAddProgram={handleAddProgram}
              onEditProgram={handleEditProgram}
              onDeleteProgram={handleDeleteProgram}
              onAddParticipants={handleAddParticipants}
            />
          );
        }
        return <LoginPage onLogin={handleLogin} onBack={() => setCurrentView('home')} />;
      case 'officer':
        if (isLoggedIn && currentUser?.type === 'officer') {
          return (
            <ProgramOfficerPortal
              students={registeredStudents}
              coordinators={coordinators}
              departments={departments}
              onAddStudent={handleAddStudent}
              onAddCoordinator={handleAddCoordinator}
              onToggleCoordinatorAccess={handleToggleCoordinatorAccess}
              onDeleteStudent={handleDeleteStudent}
              onDeleteCoordinator={handleDeleteCoordinator}
              onUpdateOfficerPassword={handleUpdateOfficerPassword}
              onEditStudent={handleEditStudent}
              onEditCoordinator={handleEditCoordinator}
              onAddDepartment={handleAddDepartment}
              onEditDepartment={handleEditDepartment}
              onToggleDepartment={handleToggleDepartment}
              studentReports={studentReports}
              programs={programs}
              onAddStudentActivity={(studentId, activity) => {
                setStudentReports(prev => {
                  const report = prev[studentId] || { activities: [] };
                  return {
                    ...prev,
                    [studentId]: {
                      activities: [
                        ...report.activities,
                        { ...activity, id: Date.now().toString(), createdAt: new Date().toISOString() },
                      ],
                    },
                  };
                });
              }}
              onEditStudentActivity={(studentId, activityId, updates) => {
                setStudentReports(prev => {
                  const report = prev[studentId];
                  if (!report) return prev;
                  return {
                    ...prev,
                    [studentId]: {
                      activities: report.activities.map(a => a.id === activityId ? { ...a, ...updates } : a),
                    },
                  };
                });
              }}
            />
          );
        }
        return <LoginPage onLogin={handleLogin} onBack={() => setCurrentView('home')} />;
      default:
        return <HomePage programs={programs} />;
    }
  };

  const getUserInfo = () => {
    if (!currentUser) return undefined;
    return {
      name: currentUser.type === 'officer' 
        ? (currentUser.data as { name: string }).name
        : (currentUser.data as RegisteredStudent | Coordinator).name,
      type: currentUser.type
    };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        currentView={currentView} 
        onViewChange={setCurrentView}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        userInfo={getUserInfo()}
      />
      {renderCurrentView()}
    </div>
  );
}

export default App;