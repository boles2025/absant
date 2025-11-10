
import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ObserverForm from './components/ObserverForm';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';
import { View, AttendanceRecord } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.Observer);
  const [records, setRecords] = useLocalStorage<AttendanceRecord[]>('attendanceRecords', []);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  const addAttendanceRecord = (record: AttendanceRecord) => {
    setRecords(prevRecords => [...prevRecords, record]);
  };

  const handleLogout = () => {
    setIsAdminAuthenticated(false);
    setCurrentView(View.Observer); // Switch back to observer view on logout
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        currentView={currentView}
        setCurrentView={setCurrentView}
        isAdminAuthenticated={isAdminAuthenticated}
        onLogout={handleLogout}
      />
      <main className="flex-grow">
        {currentView === View.Observer && <ObserverForm onAddRecord={addAttendanceRecord} />}
        {currentView === View.Admin && (
            isAdminAuthenticated 
                ? <AdminDashboard records={records} />
                : <Login onLoginSuccess={() => setIsAdminAuthenticated(true)} />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;
