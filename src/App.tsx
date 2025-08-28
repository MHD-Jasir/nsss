import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { TeacherPortal } from './components/TeacherPortal';
import { StudentPortal } from './components/StudentPortal';
import { LoginPage } from './components/LoginPage';
import { ProgramsPage } from './components/ProgramsPage';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { useAuth } from './hooks/useAuth';
import { usePrograms } from './hooks/usePrograms';
import { useStudents } from './hooks/useStudents';
import { useCoordinators } from './hooks/useCoordinators';
import { useDepartments } from './hooks/useDepartments';
import { StoryBatch, StoryAlbum, StoryMediaItem } from './types';

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'programs' | 'stories' | 'login' | 'student' | 'coordinator' | 'officer'>('home');
  
  // Hooks
  const { isLoggedIn, currentUser, loading: authLoading, login, logout } = useAuth();
  const { programs, loading: programsLoading, addProgram, updateProgram, deleteProgram, updateParticipants } = usePrograms();
  const { students, loading: studentsLoading, addStudent, updateStudent, deleteStudent } = useStudents();
  const { coordinators, loading: coordinatorsLoading, addCoordinator, updateCoordinator, deleteCoordinator, toggleAccess } = useCoordinators();
  const { departments, loading: departmentsLoading, addDepartment, updateDepartment, toggleDepartment } = useDepartments();

  // Stories state
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

  // Auto-logout
  const logoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds

  const handleAutoLogout = useCallback(() => {
    alert('You have been automatically logged out due to inactivity (30 minutes).');
    logout();
    setCurrentView('home');
  }, [logout]);

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

  useEffect(() => {
    if (isLoggedIn) {
      resetLogoutTimer();
      
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
      
      const handleUserActivity = () => {
        resetLogoutTimer();
      };
      
      events.forEach(event => {
        document.addEventListener(event, handleUserActivity, true);
      });
      
      return () => {
        events.forEach(event => {
          document.removeEventListener(event, handleUserActivity, true);
        });
        if (logoutTimerRef.current) {
          clearTimeout(logoutTimerRef.current);
        }
      };
    } else {
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
        logoutTimerRef.current = null;
      }
    }
  }, [isLoggedIn, resetLogoutTimer]);

  useEffect(() => {
    return () => {
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
      }
    };
  }, []);

  const handleLogin = async (credentials: { id: string; password: string }) => {
    const result = await login(credentials);
    if (result.success) {
      setCurrentView(result.userType as any);
    } else {
      alert(result.error || 'Login failed');
    }
  };

  const handleLogout = () => {
    logout();
    setCurrentView('home');
    
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }
  };

  if (authLoading || programsLoading || studentsLoading || coordinatorsLoading || departmentsLoading) {
    return <LoadingSpinner />;
  }
  
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
            <React.Suspense fallback={<LoadingSpinner />}>
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
                onMergeCurrentAlbumToSingle={() => {}}
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
              currentStudent={currentUser.data as any}
            />
          );
        }
        return <LoginPage onLogin={handleLogin} onBack={() => setCurrentView('home')} />;
      case 'coordinator':
        if (isLoggedIn && (currentUser?.type === 'coordinator' || currentUser?.type === 'officer')) {
          return (
            <TeacherPortal
              programs={programs}
              registeredStudents={students}
              onAddProgram={addProgram}
              onEditProgram={updateProgram}
              onDeleteProgram={deleteProgram}
              onAddParticipants={updateParticipants}
            />
          );
        }
        return <LoginPage onLogin={handleLogin} onBack={() => setCurrentView('home')} />;
      case 'officer':
        if (isLoggedIn && currentUser?.type === 'officer') {
          const ProgramOfficerPortal = React.lazy(() => import('./components/ProgramOfficerPortal'));
          return (
            <React.Suspense fallback={<LoadingSpinner />}>
              <ProgramOfficerPortal
                students={students}
                coordinators={coordinators}
                departments={departments}
                onAddStudent={addStudent}
                onAddCoordinator={addCoordinator}
                onToggleCoordinatorAccess={toggleAccess}
                onDeleteStudent={deleteStudent}
                onDeleteCoordinator={deleteCoordinator}
                onEditStudent={updateStudent}
                onEditCoordinator={updateCoordinator}
                onAddDepartment={addDepartment}
                onEditDepartment={updateDepartment}
                onToggleDepartment={toggleDepartment}
                programs={programs}
              />
            </React.Suspense>
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
        ? 'Program Officer'
        : (currentUser.data as any).name,
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