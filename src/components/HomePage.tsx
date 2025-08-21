import React, { useState } from 'react';
import { Calendar, Award, MapPin, Clock, User } from 'lucide-react';
import { Program } from '../types';

interface HomePageProps {
  programs: Program[];
}

export const HomePage: React.FC<HomePageProps> = ({ programs }) => {
  const [collegeImageVisible, setCollegeImageVisible] = useState<boolean>(true);
  const [collegeTriedAlt, setCollegeTriedAlt] = useState<boolean>(false);
  const upcomingPrograms = programs
    .filter(program => new Date(program.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-emerald-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center items-center mb-6 space-x-6">
              {/* NSS logo - normal size */}
              <div className="rounded-full overflow-hidden w-28 h-28 flex items-center justify-center bg-white">
                <img src="/download.png" alt="NSS logo" className="w-full h-full object-cover" loading="lazy" />
              </div>

              {/* College logo (MAMO) with fallback */}
              {collegeImageVisible ? (
                <div className="rounded-full overflow-hidden w-28 h-28 flex items-center justify-center bg-white">
                  <img
                    src="/mamo%20logo.png"
                    alt="College logo"
                    className="w-full h-full object-contain"
                    loading="lazy"
                    onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                      const img = e.currentTarget;
                      // If we haven't tried the safer filename yet, try it once
                      if (!collegeTriedAlt) {
                        img.src = '/mamo-logo.png';
                        setCollegeTriedAlt(true);
                      } else {
                        setCollegeImageVisible(false);
                      }
                    }}
                    onLoad={() => setCollegeImageVisible(true)}
                  />
                </div>
              ) : (
                <div className="rounded-full w-28 h-28 flex items-center justify-center bg-white border">
                  <span className="text-sm font-semibold text-gray-700 text-center px-2">MAMO COLLEGE</span>
                </div>
              )}
            </div>
            <h1 className="text-4xl font-bold mb-2">NSS MAMOC</h1>
            <h2 className="text-4xl font-bold mb-6">National Service Scheme</h2>
            <p className="text-xl max-w-3xl mx-auto leading-relaxed">
              Empowering students through community service and social responsibility. 
              Join us in making a positive impact on society while developing leadership skills and civic consciousness.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <div className="bg-white bg-opacity-20 px-6 py-3 rounded-lg">
                <div className="flex items-center justify-center space-x-2">
                  <img src="/download.png" alt="NSS icon" className="w-5 h-5 object-contain rounded-full" />
                  <span className="font-medium">100+ Active Members</span>
                </div>
              </div>
              <div className="bg-white bg-opacity-20 px-6 py-3 rounded-lg">
                <div className="flex items-center justify-center space-x-2">
                  <Calendar size={20} />
                  <span className="font-medium">50+ Programs Annually</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            To develop the personality and character of students through voluntary community service
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <User className="text-blue-700" size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Community Service</h3>
            <p className="text-gray-600 leading-relaxed">
              Engaging in meaningful community service projects that address local needs and create lasting positive impact.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <Award className="text-emerald-700" size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Leadership Development</h3>
            <p className="text-gray-600 leading-relaxed">
              Building leadership skills through hands-on experience in organizing and managing community service initiatives.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <Calendar className="text-orange-700" size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Regular Programs</h3>
            <p className="text-gray-600 leading-relaxed">
              Consistent programming throughout the year including camps, workshops, and awareness drives.
            </p>
          </div>
        </div>
      </div>

      {/* Upcoming Programs */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Upcoming Programs</h2>
            <p className="text-xl text-gray-600">Don't miss out on these exciting opportunities</p>
          </div>

          {upcomingPrograms.length === 0 ? (
            <div className="text-center py-12">
              <Calendar size={64} className="mx-auto text-gray-400 mb-4" />
              <p className="text-xl text-gray-500">No upcoming programs scheduled</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {upcomingPrograms.map((program) => (
                <div
                  key={program.id}
                  className="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                        Upcoming
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(program.date).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{program.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{program.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600">
                        <Clock size={16} className="mr-2" />
                        <span className="text-sm">{program.time}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin size={16} className="mr-2" />
                        <span className="text-sm">{program.venue}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <User size={16} className="mr-2" />
                        <span className="text-sm">{program.coordinator}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="rounded-full overflow-hidden w-8 h-8 bg-white">
                  <img src="/download.png" alt="NSS logo small" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">NSS MAMOC</h3>
                  <p className="text-gray-400 text-sm">National Service Scheme</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="overflow-hidden w-10 h-10">
                  <img src="/mamo-logo.png" alt="College logo small" className="w-full h-full object-contain" />
                </div>
                <div>
                  <p className="text-gray-300 text-sm leading-snug">Muhammed Abdurahiman Memorial Orphanage College</p>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Committed to developing student personality through community service and social responsibility.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About NSS</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Programs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Registration</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
              <div className="space-y-2 text-gray-400">
                <p>📧 nss@college.edu</p>
                <p>📱 +91 98765 43210</p>
                <p>📍 MAMO College, Mukkam, Kozhikode</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 NSS MAMOC. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};