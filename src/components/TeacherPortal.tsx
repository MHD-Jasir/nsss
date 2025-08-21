import React, { useState } from 'react';
import { Plus, Edit, Trash2, Calendar, Clock, MapPin, User, Save, X, Users, Search, Check } from 'lucide-react';
import { Program, RegisteredStudent } from '../types';

interface TeacherPortalProps {
  programs: Program[];
  registeredStudents: RegisteredStudent[];
  onAddProgram: (program: Omit<Program, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onEditProgram: (id: string, program: Omit<Program, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onDeleteProgram: (id: string) => void;
  onAddParticipants: (programId: string, studentIds: string[]) => void;
}

export const TeacherPortal: React.FC<TeacherPortalProps> = ({
  programs,
  registeredStudents,
  onAddProgram,
  onEditProgram,
  onDeleteProgram,
  onAddParticipants,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [showParticipantSelection, setShowParticipantSelection] = useState<string | null>(null);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    coordinatorIds: [] as string[],
  });

  const [showCoordinatorSelection, setShowCoordinatorSelection] = useState(false);
  const [selectedCoordinatorIds, setSelectedCoordinatorIds] = useState<string[]>([]);

  const handleParticipantSelection = (programId: string) => {
    setShowParticipantSelection(programId);
    setSelectedStudentIds(programs.find(p => p.id === programId)?.participantIds || []);
    setSearchTerm('');
  };

  const handleStudentToggle = (studentId: string) => {
    setSelectedStudentIds(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleCoordinatorToggle = (studentId: string) => {
    setSelectedCoordinatorIds(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleConfirmParticipants = () => {
    if (showParticipantSelection) {
      onAddParticipants(showParticipantSelection, selectedStudentIds);
      setShowParticipantSelection(null);
      setSelectedStudentIds([]);
      setSearchTerm('');
    }
  };

  const handleConfirmCoordinators = () => {
    setFormData(prev => ({ ...prev, coordinatorIds: selectedCoordinatorIds }));
    setShowCoordinatorSelection(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProgram) {
      onEditProgram(editingProgram.id, formData);
      setEditingProgram(null);
    } else {
      onAddProgram(formData);
    }
    
    setFormData({ title: '', description: '', date: '', time: '', venue: '', coordinatorIds: [] });
    setShowForm(false);
  };

  const handleEdit = (program: Program) => {
    setEditingProgram(program);
    setFormData({
      title: program.title,
      description: program.description,
      date: program.date,
      time: program.time,
      venue: program.venue,
      coordinatorIds: program.coordinatorIds || [],
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProgram(null);
    setFormData({ title: '', description: '', date: '', time: '', venue: '', coordinatorIds: [] });
  };

  const filteredStudents = registeredStudents.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.id.includes(searchTerm)
  ).sort((a, b) => parseInt(a.id) - parseInt(b.id));

  const allFilteredSelected =
    filteredStudents.length > 0 &&
    filteredStudents.every(student => selectedStudentIds.includes(student.id));

  const handleToggleSelectAllFiltered = () => {
    setSelectedStudentIds(previousSelectedIds => {
      if (filteredStudents.length === 0) return previousSelectedIds;

      const filteredIdSet = new Set(filteredStudents.map(s => s.id));
      const isAllSelected = Array.from(filteredIdSet).every(id => previousSelectedIds.includes(id));

      if (isAllSelected) {
        // Deselect all filtered
        return previousSelectedIds.filter(id => !filteredIdSet.has(id));
      }

      // Select all filtered (merge, avoid duplicates)
      const merged = new Set(previousSelectedIds);
      filteredStudents.forEach(s => merged.add(s.id));
      return Array.from(merged);
    });
  };

  const sortedPrograms = [...programs].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const getCoordinatorNames = (coordinatorIds: string[]) => {
    return coordinatorIds.map(id => {
      const student = registeredStudents.find(s => s.id === id);
      return student ? `${student.name} (ID: ${student.id})` : `ID: ${id}`;
    }).join(', ');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Coordinator Portal</h1>
          <p className="text-gray-600">Manage NSS programs and select participants</p>
        </div>



        <div className="mb-6">
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors flex items-center space-x-2 shadow-lg"
          >
            <Plus size={20} />
            <span>Add New Program</span>
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {editingProgram ? 'Edit Program' : 'Add New Program'}
              </h2>
              <button onClick={handleCancel} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Program Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter program title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Coordinators</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      required
                      readOnly
                      value={getCoordinatorNames(formData.coordinatorIds)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                      placeholder="Click to select coordinators"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCoordinatorIds(formData.coordinatorIds);
                        setShowCoordinatorSelection(true);
                      }}
                      className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Select
                    </button>
                  </div>
                  {formData.coordinatorIds.length > 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                      {formData.coordinatorIds.length} coordinator(s) selected
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                  <input
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Venue</label>
                  <input
                    type="text"
                    required
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter venue location"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter program description"
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors flex items-center space-x-2"
                >
                  <Save size={20} />
                  <span>{editingProgram ? 'Update Program' : 'Add Program'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Coordinator Selection Modal */}
        {showCoordinatorSelection && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Select Coordinators</h3>
                    <p className="text-gray-600">Choose students to coordinate this program</p>
                  </div>
                  <button 
                    onClick={() => setShowCoordinatorSelection(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>
                
                <div className="relative">
                  <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search students by name, department, or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={handleToggleSelectAllFiltered}
                    className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                  >
                    {allFilteredSelected ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[50vh]">
                {filteredStudents.length === 0 ? (
                  <div className="text-center py-8">
                    <Users size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-xl text-gray-500">No students found</p>
                    <p className="text-gray-400">
                      {searchTerm ? 'Try adjusting your search terms' : 'No students have been registered by the Program Officer yet'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredStudents.map((student) => (
                      <div key={student.id} className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <input
                            type="checkbox"
                            checked={selectedCoordinatorIds.includes(student.id)}
                            onChange={() => handleCoordinatorToggle(student.id)}
                            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
                            ID: {student.id}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{student.name}</h4>
                            <p className="text-sm text-gray-600">{student.department}</p>
                          </div>
                        </div>
                        {selectedCoordinatorIds.includes(student.id) && (
                          <div className="text-green-600">
                            <Check size={20} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="p-6 border-t border-gray-200 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  {selectedCoordinatorIds.length} of {filteredStudents.length} students selected
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowCoordinatorSelection(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmCoordinators}
                    className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition-colors flex items-center space-x-2"
                  >
                    <Check size={16} />
                    <span>Confirm Coordinators</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Participant Selection Modal */}
        {showParticipantSelection && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Select Participants</h3>
                    <p className="text-gray-600">Choose students to participate in this program</p>
                  </div>
                  <button 
                    onClick={() => setShowParticipantSelection(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>
                
                <div className="relative">
                  <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search students by name, department, or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={handleToggleSelectAllFiltered}
                    className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                  >
                    {allFilteredSelected ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[50vh]">
                {filteredStudents.length === 0 ? (
                  <div className="text-center py-8">
                    <Users size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-xl text-gray-500">No students found</p>
                    <p className="text-gray-400">
                      {searchTerm ? 'Try adjusting your search terms' : 'No students have been registered by the Program Officer yet'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredStudents.map((student) => (
                      <div key={student.id} className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <input
                            type="checkbox"
                            checked={selectedStudentIds.includes(student.id)}
                            onChange={() => handleStudentToggle(student.id)}
                            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
                            ID: {student.id}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{student.name}</h4>
                            <p className="text-sm text-gray-600">{student.department}</p>
                          </div>
                        </div>
                        {selectedStudentIds.includes(student.id) && (
                          <div className="text-green-600">
                            <Check size={20} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="p-6 border-t border-gray-200 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  {selectedStudentIds.length} of {filteredStudents.length} students selected
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowParticipantSelection(null)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmParticipants}
                    className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition-colors flex items-center space-x-2"
                  >
                    <Check size={16} />
                    <span>Confirm Participants</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">All Programs</h2>
            <p className="text-gray-600 mt-1">{programs.length} programs total</p>
          </div>

          <div className="divide-y divide-gray-200">
            {sortedPrograms.length === 0 ? (
              <div className="p-8 text-center">
                <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-xl text-gray-500">No programs created yet</p>
                <p className="text-gray-400">Click "Add New Program" to get started</p>
              </div>
            ) : (
              sortedPrograms.map((program) => (
                <div key={program.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-lg font-bold text-gray-900">{program.title}</h3>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                          new Date(program.date) >= new Date()
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {new Date(program.date) >= new Date() ? 'Upcoming' : 'Completed'}
                        </div>
                        {program.participantIds && program.participantIds.length > 0 && (
                          <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                            <Users size={14} />
                            <span>{program.participantIds.length} participants</span>
                          </div>
                        )}
                      </div>

                      <p className="text-gray-600 mb-4">{program.description}</p>

                      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Calendar size={16} />
                          <span>{new Date(program.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock size={16} />
                          <span>{program.time}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin size={16} />
                          <span>{program.venue}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <User size={16} />
                          <span>{getCoordinatorNames(program.coordinatorIds || [])}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2 ml-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(program)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Edit program"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this program?')) {
                              onDeleteProgram(program.id);
                            }
                          }}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete program"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <button
                        onClick={() => handleParticipantSelection(program.id)}
                        className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2 text-sm"
                      >
                        <Users size={16} />
                        <span>Select Participants</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
