
import React, { useState, useMemo } from 'react';
import { AttendanceRecord } from '../types';

interface AdminDashboardProps {
  records: AttendanceRecord[];
}

const StatCard: React.FC<{ title: string; value: string | number, icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-slate-800 p-6 rounded-xl shadow-lg flex items-center space-x-4 space-x-reverse transition-transform duration-300 hover:scale-105">
        <div className="bg-teal-500 p-3 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-slate-400 text-sm">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </div>
);

const AttendanceTable: React.FC<{ records: AttendanceRecord[], onViewImage: (imageUrl: string) => void }> = ({ records, onViewImage }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full bg-slate-800 rounded-lg shadow-md">
      <thead className="bg-slate-700">
        <tr>
          {['اسم المقرر', 'الفرقة', 'لجنة', 'مكان اللجنة', 'الملاحظ', 'تاريخ', 'إجمالي', 'حضور', 'غياب', 'الكشف'].map(header => (
            <th key={header} className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">{header}</th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-700">
        {records.length > 0 ? records.map(record => (
          <tr key={record.id} className="hover:bg-slate-700/50 transition-colors duration-200">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{record.courseName}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{record.academicYear}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{record.committeeNumber}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{record.committeeLocation}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{record.observerName}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{record.date}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{record.totalStudents}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400">{record.presentStudents}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-red-400">{record.absentStudents}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
                {record.attendanceSheetImage ? 
                    <button onClick={() => onViewImage(record.attendanceSheetImage!)} className="text-teal-400 hover:text-teal-300 font-semibold focus:outline-none">عرض</button>
                    : <span className="text-slate-500">لا يوجد</span>
                }
            </td>
          </tr>
        )) : (
            <tr>
                <td colSpan={10} className="text-center py-10 text-slate-400">
                    لا توجد سجلات تطابق معايير البحث الحالية.
                </td>
            </tr>
        )}
      </tbody>
    </table>
  </div>
);

const AdminDashboard: React.FC<AdminDashboardProps> = ({ records }) => {
  const [filterCommitteeNumber, setFilterCommitteeNumber] = useState('');
  const [filterCommitteeLocation, setFilterCommitteeLocation] = useState('');
  const [filterAcademicYear, setFilterAcademicYear] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterObserverName, setFilterObserverName] = useState('');
  const [viewingImage, setViewingImage] = useState<string | null>(null);

  const stats = useMemo(() => {
    const totalRecords = records.length;
    const totalStudents = records.reduce((sum, r) => sum + r.totalStudents, 0);
    const totalPresent = records.reduce((sum, r) => sum + r.presentStudents, 0);
    const attendanceRate = totalStudents > 0 ? ((totalPresent / totalStudents) * 100).toFixed(1) + '%' : 'N/A';
    return { totalRecords, totalStudents, totalPresent, attendanceRate };
  }, [records]);

  const filteredRecords = useMemo(() => {
    return records.filter(record => 
        (record.committeeNumber.includes(filterCommitteeNumber)) &&
        (record.committeeLocation.toLowerCase().includes(filterCommitteeLocation.toLowerCase())) &&
        (record.academicYear === filterAcademicYear || filterAcademicYear === '') &&
        (record.observerName.toLowerCase().includes(filterObserverName.toLowerCase())) &&
        (record.id.startsWith(filterDate) || filterDate === '')
    ).reverse();
  }, [records, filterCommitteeNumber, filterCommitteeLocation, filterAcademicYear, filterObserverName, filterDate]);
  
  const resetFilters = () => {
      setFilterCommitteeNumber('');
      setFilterCommitteeLocation('');
      setFilterAcademicYear('');
      setFilterDate('');
      setFilterObserverName('');
  };

  const exportToExcel = () => {
    const dataToExport = filteredRecords.map(r => ({
        "اسم المقرر": r.courseName,
        "الفرقة": r.academicYear,
        "رقم اللجنة": r.committeeNumber,
        "مكان اللجنة": r.committeeLocation,
        "اسم الملاحظ": r.observerName,
        "التاريخ": r.date,
        "إجمالي الطلاب": r.totalStudents,
        "عدد الحاضرين": r.presentStudents,
        "عدد الغائبين": r.absentStudents,
        "صورة الكشف": r.attendanceSheetImage ? "مرفقة" : "لا يوجد",
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "بيانات الغياب");
    XLSX.writeFile(wb, "بيانات_الغياب.xlsx");
  };

  if (records.length === 0) {
      return (
          <div className="container mx-auto px-4 py-8 text-center">
              <div className="bg-slate-800 p-12 rounded-2xl shadow-xl">
                <h2 className="text-2xl font-bold text-teal-400">لا توجد سجلات غياب حتى الآن</h2>
                <p className="text-slate-400 mt-4">يرجى إضافة سجل من شاشة المراقب أولاً.</p>
              </div>
          </div>
      );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="إجمالي السجلات" value={stats.totalRecords} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>} />
        <StatCard title="إجمالي الطلاب" value={stats.totalStudents} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} />
        <StatCard title="إجمالي الحضور" value={stats.totalPresent} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
        <StatCard title="متوسط الحضور" value={stats.attendanceRate} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>} />
      </div>

      {/* Filter and Table Section */}
      <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
            <input type="text" placeholder="رقم اللجنة..." value={filterCommitteeNumber} onChange={e => setFilterCommitteeNumber(e.target.value)} className="bg-slate-700 border border-slate-600 text-white rounded-lg p-2.5 focus:ring-teal-500 focus:border-teal-500" />
            <input type="text" placeholder="مكان اللجنة..." value={filterCommitteeLocation} onChange={e => setFilterCommitteeLocation(e.target.value)} className="bg-slate-700 border border-slate-600 text-white rounded-lg p-2.5 focus:ring-teal-500 focus:border-teal-500" />
            <select value={filterAcademicYear} onChange={e => setFilterAcademicYear(e.target.value)} className="bg-slate-700 border border-slate-600 text-white rounded-lg p-2.5 focus:ring-teal-500 focus:border-teal-500">
                <option value="">كل الفرق</option>
                <option value="الاولي">الاولي</option>
                <option value="الثانيه">الثانيه</option>
                <option value="الثالثه">الثالثه</option>
                <option value="الرابعه">الرابعه</option>
                <option value="دراسات عليا">دراسات عليا</option>
            </select>
            <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} className="bg-slate-700 border border-slate-600 text-white rounded-lg p-2.5 focus:ring-teal-500 focus:border-teal-500" />
            <input type="text" placeholder="اسم الملاحظ..." value={filterObserverName} onChange={e => setFilterObserverName(e.target.value)} className="bg-slate-700 border border-slate-600 text-white rounded-lg p-2.5 focus:ring-teal-500 focus:border-teal-500" />
             <button onClick={resetFilters} className="bg-slate-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-slate-700 transition-colors duration-300">مسح الفلاتر</button>
        </div>
        <div className="flex justify-end mb-4">
             <button 
                onClick={exportToExcel}
                className="w-full sm:w-auto bg-green-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-300 flex items-center justify-center space-x-2 space-x-reverse"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                <span>تصدير Excel</span>
            </button>
        </div>
        <AttendanceTable records={filteredRecords} onViewImage={setViewingImage} />
      </div>

      {/* Image Modal */}
      {viewingImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4 animate-fade-in"
          onClick={() => setViewingImage(null)} // Close on overlay click
        >
          <div 
            className="bg-slate-900 p-4 rounded-lg shadow-2xl max-w-4xl max-h-[90vh] relative transform transition-transform duration-300 scale-95 animate-zoom-in" 
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the image itself
          >
            <button 
              onClick={() => setViewingImage(null)}
              className="absolute -top-3 -right-3 bg-red-600 text-white rounded-full h-8 w-8 flex items-center justify-center hover:bg-red-700 transition focus:outline-none focus:ring-2 focus:ring-white z-10"
              aria-label="Close image view"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img src={viewingImage} alt="كشف الغياب" className="max-w-full max-h-[85vh] object-contain rounded"/>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;