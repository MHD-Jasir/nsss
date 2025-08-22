import React, { useState } from 'react';
import { Plus, Trash2, Users, User, Search, Eye, EyeOff, Save, X, Settings, Calendar, Clock, MapPin } from 'lucide-react';
import { RegisteredStudent, Coordinator, StudentReport } from '../types';

interface ProgramOfficerPortalProps {
  students: RegisteredStudent[];
  coordinators: Coordinator[];
  departments: import('../types').Department[];
  programs: import('../types').Program[];
  onAddStudent: (student: Omit<RegisteredStudent, 'id' | 'createdAt'>) => void;
  onAddCoordinator: (coordinator: Omit<Coordinator, 'id' | 'createdAt'>) => void;
  onToggleCoordinatorAccess: (id: string) => void;
  onDeleteStudent: (id: string) => void;
  onDeleteCoordinator: (id: string) => void;
  onUpdateOfficerPassword: (newPassword: string) => void;
  onEditStudent: (id: string, updates: { name: string; department: string; password: string }) => void;
  onEditCoordinator: (id: string, updates: { name: string; department: string; password: string }) => void;
  onAddDepartment: (name: string) => void;
  onEditDepartment: (id: string, newName: string) => void;
  onToggleDepartment: (id: string) => void;
  studentReports: Record<string, StudentReport>;
  onAddStudentActivity: (
    studentId: string,
    activity: { badge: 'green' | 'yellow'; title: string; content: string }
  ) => void;
  onEditStudentActivity: (
    studentId: string,
    activityId: string,
    updates: Partial<{ badge: 'green' | 'yellow'; title: string; content: string }>
  ) => void;
}

export const ProgramOfficerPortal: React.FC<ProgramOfficerPortalProps> = ({
  students,
  coordinators,
  departments,
  programs,
  onAddStudent,
  onAddCoordinator,
  onToggleCoordinatorAccess,
  onDeleteStudent,
  onDeleteCoordinator,
  onUpdateOfficerPassword,
  onEditStudent,
  onEditCoordinator,
  onAddDepartment,
  onEditDepartment,
  onToggleDepartment,
  studentReports,
  onAddStudentActivity,
  onEditStudentActivity,
}) => {
  const [activeTab, setActiveTab] = useState<'students' | 'coordinators' | 'departments'>('students');
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPasswords, setShowPasswords] = useState<{[key: string]: boolean}>({});
  const [showSettings, setShowSettings] = useState(false);
  const [editingStudent, setEditingStudent] = useState<RegisteredStudent | null>(null);
  const [editingCoordinator, setEditingCoordinator] = useState<Coordinator | null>(null);
  const [editForm, setEditForm] = useState({ name: '', department: '', password: '', profileImageUrl: '' as string | undefined });
  const [reportStudentId, setReportStudentId] = useState<string | null>(null);
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [activityForm, setActivityForm] = useState({ badge: 'green' as 'green' | 'yellow', title: '', content: '' });
  const [editingActivityId, setEditingActivityId] = useState<string | null>(null);
  
  // Department management state
  const [showDepartmentForm, setShowDepartmentForm] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<import('../types').Department | null>(null);
  const [departmentForm, setDepartmentForm] = useState({ name: '' });

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStudent) {
      onEditStudent(editingStudent.id, { name: editForm.name, department: editForm.department, password: editForm.password });
      setEditingStudent(null);
      setEditForm({ name: '', department: '', password: '', profileImageUrl: '' });
      return;
    }
    if (editingCoordinator) {
      onEditCoordinator(editingCoordinator.id, editForm);
      setEditingCoordinator(null);
      setEditForm({ name: '', department: '', password: '' });
      return;
    }
  };
  
  const [studentForm, setStudentForm] = useState({
    id: '',
    name: '',
    department: '',
    password: '',
    profileImageUrl: '' as string | undefined,
  });
  
  const [coordinatorForm, setCoordinatorForm] = useState({
    name: '',
    department: '',
    password: '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const ensureUniqueId = (candidate: string): boolean => {
    return !students.some(s => s.id.toLowerCase() === candidate.toLowerCase());
  };



  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentForm.id) {
      alert('Please enter a custom ID (letters and numbers).');
      return;
    }
    if (!ensureUniqueId(studentForm.id)) {
      alert('This ID is already in use. Please choose another.');
      return;
    }
    const newStudent = {
      id: studentForm.id,
      name: studentForm.name,
      department: studentForm.department,
      password: studentForm.password,
      profileImageUrl: studentForm.profileImageUrl || undefined,
    };
    onAddStudent(newStudent as any);
    setStudentForm({ id: '', name: '', department: '', password: '', profileImageUrl: '' });
    setShowForm(false);
  };

  const generateCoordinatorId = (): string => {
    let id: string;
    do {
      id = 'COORD' + Math.floor(1000 + Math.random() * 9000).toString();
    } while (coordinators.some(c => c.id === id));
    return id;
  };

  const handleCoordinatorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCoordinator = {
      ...coordinatorForm,
      id: generateCoordinatorId(),
      isActive: true,
    };
    onAddCoordinator(newCoordinator);
    setCoordinatorForm({ name: '', department: '', password: '' });
    setShowForm(false);
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.id.includes(searchTerm)
  ).sort((a, b) => parseInt(a.id) - parseInt(b.id));

  const filteredCoordinators = coordinators.filter(coordinator =>
    coordinator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coordinator.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coordinator.id.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => a.id.localeCompare(b.id));

  const togglePasswordVisibility = (id: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    
    // For demo purposes, we'll use a hardcoded current password check
    // In a real app, this would be validated against the backend
    if (passwordForm.currentPassword !== 'NSS@OFFICER2025') {
      alert('Current password is incorrect');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      alert('New password must be at least 6 characters long');
      return;
    }

    onUpdateOfficerPassword(passwordForm.newPassword);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setShowSettings(false);
    alert('Password updated successfully!');
  };

  // Department management functions
  const handleDepartmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDepartment) {
      onEditDepartment(editingDepartment.id, departmentForm.name);
      setEditingDepartment(null);
    } else {
      onAddDepartment(departmentForm.name);
    }
    setDepartmentForm({ name: '' });
    setShowDepartmentForm(false);
  };

  const handleEditDepartment = (department: import('../types').Department) => {
    setEditingDepartment(department);
    setDepartmentForm({ name: department.name });
    setShowDepartmentForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Program Officer Portal</h1>
            <p className="text-gray-600">Manage student accounts and coordinator access</p>
          </div>
          <button
            onClick={() => setShowSettings(true)}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2 w-full sm:w-auto"
            title="Settings"
          >
            <Settings size={20} />
            <span>Settings</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-8">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('students')}
              className={`flex-1 px-3 sm:px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'students'
                  ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                <Users size={18} className="sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">Students ({students.length})</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('coordinators')}
              className={`flex-1 px-3 sm:px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'coordinators'
                  ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                <User size={18} className="sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">Coordinators ({coordinators.length})</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('departments')}
              className={`flex-1 px-3 sm:px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'departments'
                  ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                <span className="text-sm sm:text-base">Departments ({departments.filter(d => d.isActive).length})</span>
              </div>
            </button>
          </div>

          <div className="p-6">
            {/* Add Button and Search */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-6">
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-700 text-white px-4 sm:px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors flex items-center justify-center space-x-2 shadow-lg w-full sm:w-auto"
              >
                <Plus size={20} />
                <span className="text-sm sm:text-base">Add New {activeTab === 'students' ? 'Student' : 'Coordinator'}</span>
              </button>

              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Students Tab */}
            {activeTab === 'students' && (
              <div className="space-y-4">
                {filteredStudents.length === 0 ? (
                  <div className="text-center py-12">
                    <Users size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-xl text-gray-500">No students found</p>
                    <p className="text-gray-400">
                      {searchTerm ? 'Try adjusting your search terms' : 'Click "Add New Student" to get started'}
                    </p>
                  </div>
                ) : (
                  filteredStudents.map((student) => (
                    <div key={student.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                            <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold w-fit">
                              ID: {student.id}
                            </div>
                            <h4 className="font-semibold text-gray-900">{student.name}</h4>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                                {student.profileImageUrl ? (
                                  <img src={student.profileImageUrl} alt={student.name} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Photo</div>
                                )}
                              </div>
                              <span className="text-gray-700">Profile</span>
                            </div>
                            <p>Department: {student.department}</p>
                            <div className="flex items-center space-x-2">
                              <span>Password:</span>
                              <span className="font-mono">
                                {showPasswords[student.id] ? student.password : '••••••••'}
                              </span>
                              <button
                                onClick={() => togglePasswordVisibility(student.id)}
                                className="text-gray-500 hover:text-gray-700"
                              >
                                {showPasswords[student.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                              </button>
                            </div>
                            <p className="text-xs">Created: {new Date(student.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 self-end sm:self-center">
                          <button
                            onClick={() => {
                              setReportStudentId(student.id);
                              setShowActivityForm(false);
                              setEditingActivityId(null);
                            }}
                            className="text-emerald-700 hover:bg-emerald-100 px-3 py-2 rounded-lg text-sm font-medium"
                          >
                            Report
                          </button>
                          <button
                            onClick={() => {
                              setEditingStudent(student);
                              setEditForm({ name: student.name, department: student.department, password: student.password, profileImageUrl: student.profileImageUrl });
                            }}
                            className="text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                            title="Edit student"
                          >
                            <Settings size={18} />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete student ${student.name}?`)) {
                                onDeleteStudent(student.id);
                              }
                            }}
                            className="text-red-600 hover:bg-red-100 p-2 rounded-lg transition-colors w-fit"
                            title="Delete student"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Coordinators Tab */}
            {activeTab === 'coordinators' && (
              <div className="space-y-4">
                {filteredCoordinators.length === 0 ? (
                  <div className="text-center py-12">
                    <User size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-xl text-gray-500">No coordinators found</p>
                    <p className="text-gray-400">
                      {searchTerm ? 'Try adjusting your search terms' : 'Click "Add New Coordinator" to get started'}
                    </p>
                  </div>
                ) : (
                  filteredCoordinators.map((coordinator) => (
                    <div key={coordinator.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex flex-col gap-4">
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                            <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-bold w-fit">
                              ID: {coordinator.id}
                            </div>
                            <h4 className="font-semibold text-gray-900">{coordinator.name}</h4>
                            <div className={`px-3 py-1 rounded-full text-sm font-medium w-fit ${
                              coordinator.isActive
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {coordinator.isActive ? 'Active' : 'Inactive'}
                            </div>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>Department: {coordinator.department}</p>
                            <div className="flex items-center space-x-2">
                              <span>Password:</span>
                              <span className="font-mono">
                                {showPasswords[coordinator.id] ? coordinator.password : '••••••••'}
                              </span>
                              <button
                                onClick={() => togglePasswordVisibility(coordinator.id)}
                                className="text-gray-500 hover:text-gray-700"
                              >
                                {showPasswords[coordinator.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                              </button>
                            </div>
                            <p className="text-xs">Created: {new Date(coordinator.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2">
                          <button
                            onClick={() => onToggleCoordinatorAccess(coordinator.id)}
                            className={`px-4 py-2 rounded-lg transition-colors text-sm ${
                              coordinator.isActive
                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                          >
                            {coordinator.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={() => {
                              setEditingCoordinator(coordinator);
                              setEditForm({ name: coordinator.name, department: coordinator.department, password: coordinator.password });
                            }}
                            className="text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                            title="Edit coordinator"
                          >
                            <Settings size={18} />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete coordinator ${coordinator.name}?`)) {
                                onDeleteCoordinator(coordinator.id);
                              }
                            }}
                            className="text-red-600 hover:bg-red-100 p-2 rounded-lg transition-colors w-fit"
                            title="Delete coordinator"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Departments Tab */}
            {activeTab === 'departments' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Manage Departments</h3>
                  <button
                    onClick={() => {
                      setEditingDepartment(null);
                      setDepartmentForm({ name: '' });
                      setShowDepartmentForm(true);
                    }}
                    className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 flex items-center gap-2"
                  >
                    <Plus size={18} /> Add Department
                  </button>
                </div>
                
                {departments.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-xl text-gray-500">No departments found</p>
                    <p className="text-gray-400">Click "Add Department" to get started</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {departments.map((department) => (
                      <div key={department.id} className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                            department.isActive
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {department.isActive ? 'Active' : 'Inactive'}
                          </div>
                          <h4 className="font-semibold text-gray-900">{department.name}</h4>
                          <span className="text-sm text-gray-500">
                            {students.filter(s => s.department === department.name).length} students
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditDepartment(department)}
                            className="text-blue-600 hover:bg-blue-100 p-2 rounded-lg transition-colors"
                            title="Edit department"
                          >
                            <Settings size={18} />
                          </button>
                          <button
                            onClick={() => onToggleDepartment(department.id)}
                            className={`px-3 py-2 rounded-lg transition-colors text-sm ${
                              department.isActive
                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                          >
                            {department.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full mx-4">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-900">Officer Settings</h3>
                  <button 
                    onClick={() => {
                      setShowSettings(false);
                      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <h4 className="text-md font-semibold text-gray-900 mb-4">Reset Password</h4>
                <form onSubmit={handlePasswordReset} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                    <input
                      type="password"
                      required
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter current password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                    <input
                      type="password"
                      required
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter new password"
                      minLength={6}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Confirm new password"
                      minLength={6}
                    />
                  </div>
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowSettings(false);
                        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                      }}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition-colors flex items-center space-x-2"
                    >
                      <Save size={16} />
                      <span>Update Password</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Add Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full mx-4">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-900">
                    Add New {activeTab === 'students' ? 'Student' : 'Coordinator'}
                  </h3>
                  <button 
                    onClick={() => setShowForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {activeTab === 'students' ? (
                  <form onSubmit={handleStudentSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Custom Student ID</label>
                      <input
                        type="text"
                        required
                        pattern="[A-Za-z0-9_-]+"
                        value={studentForm.id}
                        onChange={(e) => setStudentForm({ ...studentForm, id: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., CS24-001"
                      />
                      <p className="text-xs text-gray-500 mt-1">Letters, numbers, hyphen or underscore allowed.</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Student Name</label>
                      <input
                        type="text"
                        required
                        value={studentForm.name}
                        onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter student name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                      <select
                        required
                        value={studentForm.department}
                        onChange={(e) => setStudentForm({ ...studentForm, department: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select a department</option>
                        {departments.filter(d => d.isActive).map(dept => (
                          <option key={dept.id} value={dept.name}>{dept.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture (optional)</label>
                      <input
                        type="url"
                        value={studentForm.profileImageUrl || ''}
                        onChange={(e) => setStudentForm({ ...studentForm, profileImageUrl: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Paste image URL or leave blank"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                      <input
                        type="text"
                        required
                        value={studentForm.password}
                        onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter password"
                      />
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition-colors flex items-center space-x-2"
                      >
                        <Save size={16} />
                        <span>Add Student</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleCoordinatorSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Coordinator Name</label>
                      <input
                        type="text"
                        required
                        value={coordinatorForm.name}
                        onChange={(e) => setCoordinatorForm({ ...coordinatorForm, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter coordinator name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                      <select
                        required
                        value={coordinatorForm.department}
                        onChange={(e) => setCoordinatorForm({ ...coordinatorForm, department: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select a department</option>
                        {departments.filter(d => d.isActive).map(dept => (
                          <option key={dept.id} value={dept.name}>{dept.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                      <input
                        type="text"
                        required
                        value={coordinatorForm.password}
                        onChange={(e) => setCoordinatorForm({ ...coordinatorForm, password: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter password"
                      />
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition-colors flex items-center space-x-2"
                      >
                        <Save size={16} />
                        <span>Add Coordinator</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {(editingStudent || editingCoordinator) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full mx-4">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-900">
                    Edit {editingStudent ? 'Student' : 'Coordinator'} Details
                  </h3>
                  <button
                    onClick={() => {
                      setEditingStudent(null);
                      setEditingCoordinator(null);
                      setEditForm({ name: '', department: '', password: '' });
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <form onSubmit={handleEditSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      required
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={`Enter ${editingStudent ? 'student' : 'coordinator'} name`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                    <select
                      required
                      value={editForm.department}
                      onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select a department</option>
                      {departments.filter(d => d.isActive).map(dept => (
                        <option key={dept.id} value={dept.name}>{dept.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <input
                      type="text"
                      required
                      value={editForm.password}
                      onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture URL</label>
                    <input
                      type="url"
                      value={editForm.profileImageUrl || ''}
                      onChange={(e) => setEditForm({ ...editForm, profileImageUrl: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Paste image URL"
                    />
                  </div>
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingStudent(null);
                        setEditingCoordinator(null);
                        setEditForm({ name: '', department: '', password: '' });
                      }}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition-colors flex items-center space-x-2"
                    >
                      <Save size={16} />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Department Form Modal */}
        {showDepartmentForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full mx-4">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-900">
                    {editingDepartment ? 'Edit Department' : 'Add New Department'}
                  </h3>
                  <button 
                    onClick={() => {
                      setShowDepartmentForm(false);
                      setEditingDepartment(null);
                      setDepartmentForm({ name: '' });
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <form onSubmit={handleDepartmentSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Department Name</label>
                    <input
                      type="text"
                      required
                      value={departmentForm.name}
                      onChange={(e) => setDepartmentForm({ name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter department name"
                    />
                  </div>
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowDepartmentForm(false);
                        setEditingDepartment(null);
                        setDepartmentForm({ name: '' });
                      }}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition-colors flex items-center space-x-2"
                    >
                      <Save size={16} />
                      <span>{editingDepartment ? 'Update Department' : 'Add Department'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Report Modal */}
        {reportStudentId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 p-4">
            <div className="relative bg-white rounded-xl max-w-5xl w-full mx-auto mt-20 flex flex-col max-h-[80vh]">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-900">Student Report</h3>
                  <button
                    onClick={() => setReportStudentId(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-6 overflow-hidden">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-900">Extra Activities</h4>
                    <button
                      onClick={() => { setShowActivityForm(true); setEditingActivityId(null); setActivityForm({ badge: 'green', title: '', content: '' }); }}
                      className="px-3 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                    >
                      Add Activity
                    </button>
                  </div>
                  {showActivityForm && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!reportStudentId) return;
                        if (editingActivityId) {
                          onEditStudentActivity(reportStudentId, editingActivityId, activityForm);
                        } else {
                          onAddStudentActivity(reportStudentId, activityForm);
                        }
                        setShowActivityForm(false);
                        setEditingActivityId(null);
                        setActivityForm({ badge: 'green', title: '', content: '' });
                      }}
                      className="mt-4 grid md:grid-cols-2 gap-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Badge</label>
                        <select
                          value={activityForm.badge}
                          onChange={(e) => setActivityForm({ ...activityForm, badge: e.target.value as 'green' | 'yellow' })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="green">Green</option>
                          <option value="yellow">Light Yellow</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Heading</label>
                        <input
                          type="text"
                          required
                          value={activityForm.title}
                          onChange={(e) => setActivityForm({ ...activityForm, title: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Activity title"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Details</label>
                        <textarea
                          required
                          rows={3}
                          value={activityForm.content}
                          onChange={(e) => setActivityForm({ ...activityForm, content: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Add details as a short paragraph"
                        />
                      </div>
                      <div className="md:col-span-2 flex justify-end space-x-2">
                        <button type="button" onClick={() => { setShowActivityForm(false); setEditingActivityId(null); }} className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
                        <button type="submit" className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition-colors">Save Activity</button>
                      </div>
                    </form>
                  )}
                </div>

                <div className="space-y-4 overflow-y-auto pr-2" style={{ maxHeight: '40vh' }}>
                  <h4 className="font-semibold text-gray-900">Activities, Coordinated & Participated Programs</h4>
                  {/* Activities */}
                  <div className="space-y-3">
                    {(studentReports[reportStudentId]?.activities || []).map(activity => (
                      <div key={activity.id} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${activity.badge === 'green' ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {activity.badge === 'green' ? 'Green Badge' : 'Light Yellow'}
                          </span>
                          <span className="font-semibold text-gray-900">{activity.title}</span>
                          <button
                            className="ml-auto text-gray-600 hover:text-gray-800"
                            title="Edit activity"
                            onClick={() => { setShowActivityForm(true); setEditingActivityId(activity.id); setActivityForm({ badge: activity.badge, title: activity.title, content: activity.content }); }}
                          >
                            <Settings size={16} />
                          </button>
                        </div>
                        <p className="text-sm text-gray-700 whitespace-pre-line">{activity.content}</p>
                      </div>
                    ))}
                  </div>

                  {/* Coordinated programs */}
                  <div className="space-y-3">
                    {programs
                      .filter(p => p.coordinatorIds?.includes(reportStudentId))
                      .map(p => (
                        <div key={p.id} className="bg-white border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">COORDINATED</span>
                            <span className="font-semibold text-gray-900">{p.title}</span>
                          </div>
                          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-gray-600">
                            <div className="flex items-center space-x-2"><Calendar size={14} /><span>{new Date(p.date).toLocaleDateString()}</span></div>
                            <div className="flex items-center space-x-2"><Clock size={14} /><span>{p.time}</span></div>
                            <div className="flex items-center space-x-2"><MapPin size={14} /><span>{p.venue}</span></div>
                            <div className="flex items-center space-x-2"><Users size={14} /><span>{p.participantIds?.length || 0} participants</span></div>
                          </div>
                          <p className="text-sm text-gray-700 mt-2 line-clamp-3">{p.description}</p>
                        </div>
                      ))}
                  </div>

                  {/* Participated programs (excluding those already shown as coordinated) */}
                  <div className="space-y-3">
                    {programs
                      .filter(p => p.participantIds?.includes(reportStudentId) && !p.coordinatorIds?.includes(reportStudentId))
                      .map(p => (
                        <div key={p.id} className="bg-white border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">Participated</span>
                            <span className="font-semibold text-gray-900">{p.title}</span>
                          </div>
                          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-gray-600">
                            <div className="flex items-center space-x-2"><Calendar size={14} /><span>{new Date(p.date).toLocaleDateString()}</span></div>
                            <div className="flex items-center space-x-2"><Clock size={14} /><span>{p.time}</span></div>
                            <div className="flex items-center space-x-2"><MapPin size={14} /><span>{p.venue}</span></div>
                            <div className="flex items-center space-x-2"><User size={14} /><span>{p.coordinatorIds?.map(id => {
                              const student = students.find(s => s.id === id);
                              return student ? student.name : id;
                            }).join(', ') || 'No coordinators'}</span></div>
                          </div>
                          <p className="text-sm text-gray-700 mt-2 line-clamp-3">{p.description}</p>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};