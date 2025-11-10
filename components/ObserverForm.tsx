
import React, { useState, useCallback } from 'react';
import { AttendanceRecord } from '../types';

interface ObserverFormProps {
  onAddRecord: (record: AttendanceRecord) => void;
}

const InputField: React.FC<{id: string, label: string, type: string, value: string | number, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, required?: boolean}> = 
({id, label, type, value, onChange, required=true}) => (
    <div>
        <label htmlFor={id} className="block mb-2 text-sm font-medium text-slate-300">{label}</label>
        <input 
            type={type} 
            id={id} 
            value={value}
            onChange={onChange}
            required={required}
            className="bg-slate-700 border border-slate-600 text-white text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5 transition"
        />
    </div>
);

const SelectField: React.FC<{id: string, label: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, children: React.ReactNode, required?: boolean}> =
({id, label, value, onChange, children, required = true}) => (
    <div>
        <label htmlFor={id} className="block mb-2 text-sm font-medium text-slate-300">{label}</label>
        <select
            id={id}
            value={value}
            onChange={onChange}
            required={required}
            className="bg-slate-700 border border-slate-600 text-white text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5 transition"
        >
            {children}
        </select>
    </div>
);


const ObserverForm: React.FC<ObserverFormProps> = ({ onAddRecord }) => {
  const [observerName, setObserverName] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [committeeNumber, setCommitteeNumber] = useState('');
  const [committeeLocation, setCommitteeLocation] = useState('');
  const [courseName, setCourseName] = useState('');
  const [totalStudents, setTotalStudents] = useState(0);
  const [presentStudents, setPresentStudents] = useState(0);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageData, setImageData] = useState<string | undefined>(undefined);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [confirmationData, setConfirmationData] = useState<AttendanceRecord | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setImageData(base64String);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const resetForm = useCallback(() => {
    setObserverName('');
    setAcademicYear('');
    setCommitteeNumber('');
    setCommitteeLocation('');
    setCourseName('');
    setTotalStudents(0);
    setPresentStudents(0);
    setImagePreview(null);
    setImageData(undefined);
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const absentStudents = totalStudents - presentStudents;
    if (absentStudents < 0) {
        alert("عدد الحاضرين لا يمكن أن يكون أكبر من الإجمالي.");
        return;
    }

    const newRecord: AttendanceRecord = {
      id: new Date().toISOString(),
      observerName,
      academicYear,
      committeeNumber,
      committeeLocation,
      courseName,
      date: new Date().toLocaleString('ar-EG'),
      totalStudents,
      presentStudents,
      absentStudents,
      attendanceSheetImage: imageData,
    };
    
    setConfirmationData(newRecord);
  };
  
  const handleConfirmSubmission = () => {
    if (!confirmationData) return;

    setIsSubmitting(true);
    setSubmitMessage('');

    // Simulate API call
    setTimeout(() => {
        onAddRecord(confirmationData);
        setSubmitMessage(`شكراً ${confirmationData.observerName}، تم إرسال الغياب بنجاح!`);
        setConfirmationData(null); // Close modal
        resetForm();
        setIsSubmitting(false);
        setTimeout(() => setSubmitMessage(''), 5000); // Clear message after 5 seconds
    }, 1000);
  };

  const handleEditSubmission = () => {
    setConfirmationData(null); // Close modal and allow editing
  };


  return (
    <div className="container mx-auto px-4 py-8">
      {submitMessage && (
        <div className="max-w-4xl mx-auto mb-6 bg-green-900/50 border border-green-500 text-green-300 px-4 py-3 rounded-lg text-center transition-opacity duration-300" role="alert">
            <p className="font-bold">{submitMessage}</p>
        </div>
      )}
      <div className="bg-slate-800 p-6 md:p-8 rounded-2xl shadow-2xl max-w-4xl mx-auto transform transition-all duration-500 hover:scale-105">
        <h2 className="text-3xl font-bold text-center mb-6 text-teal-400">تسجيل غياب الطلاب</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField id="observerName" label="اسم الملاحظ" type="text" value={observerName} onChange={(e) => setObserverName(e.target.value)} />
            <SelectField id="academicYear" label="الفرقة" value={academicYear} onChange={(e) => setAcademicYear(e.target.value)}>
                <option value="">اختر الفرقة</option>
                <option value="الاولي">الاولي</option>
                <option value="الثانيه">الثانيه</option>
                <option value="الثالثه">الثالثه</option>
                <option value="الرابعه">الرابعه</option>
                <option value="دراسات عليا">دراسات عليا</option>
            </SelectField>
            <InputField id="committeeNumber" label="رقم اللجنة" type="text" value={committeeNumber} onChange={(e) => setCommitteeNumber(e.target.value)} />
            <InputField id="committeeLocation" label="مكان اللجنة" type="text" value={committeeLocation} onChange={(e) => setCommitteeLocation(e.target.value)} />
            <InputField id="courseName" label="اسم المقرر" type="text" value={courseName} onChange={(e) => setCourseName(e.target.value)} />
            <div>
                 <label className="block mb-2 text-sm font-medium text-slate-300">اليوم والتاريخ</label>
                 <div className="bg-slate-700 border border-slate-600 text-white text-sm rounded-lg p-2.5 w-full">
                     {new Date().toLocaleString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                 </div>
            </div>
            <InputField id="totalStudents" label="إجمالي الطلاب" type="number" value={totalStudents} onChange={(e) => setTotalStudents(parseInt(e.target.value, 10) || 0)} />
            <InputField id="presentStudents" label="عدد الحاضرين" type="number" value={presentStudents} onChange={(e) => setPresentStudents(parseInt(e.target.value, 10) || 0)} />
            <div>
                 <label className="block mb-2 text-sm font-medium text-slate-300">عدد الغائبين</label>
                 <div className="bg-slate-700 border border-slate-600 text-white text-sm rounded-lg p-2.5 w-full">
                    {Math.max(0, totalStudents - presentStudents)}
                 </div>
            </div>
            <div className="md:col-span-2">
              <label className="block mb-2 text-sm font-medium text-slate-300">ارفاق صورة من كشف الغياب</label>
              <div className="mt-2 flex justify-center items-center px-6 pt-5 pb-6 border-2 border-slate-600 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                   {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="mx-auto h-48 w-auto rounded-md object-contain" />
                    ) : (
                        <svg className="mx-auto h-12 w-12 text-slate-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    )}
                  <div className="flex text-sm text-slate-500 justify-center mt-4">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-teal-600 rounded-md font-medium text-white hover:bg-teal-700 px-4 py-2 transition">
                      <span>التقط صورة بالكاميرا</span>
                      <input id="file-upload" name="file-upload" type="file" accept="image/*" capture="environment" className="sr-only" onChange={handleImageChange} />
                    </label>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">سيتم فتح الكاميرا مباشرة</p>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-5">
            <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300 transform hover:scale-105">
              إرسال الغياب
            </button>
          </div>
        </form>
      </div>
      
      {/* Confirmation Modal */}
      {confirmationData && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4 animate-fade-in">
            <div className="bg-slate-900 p-8 rounded-2xl shadow-2xl w-full max-w-lg text-center animate-zoom-in space-y-6 border border-teal-500/50">
                <h3 className="text-2xl font-bold text-teal-400">مراجعة بيانات الغياب</h3>
                <div className="text-right space-y-3 text-lg bg-slate-800/50 p-4 rounded-lg">
                    <p className="flex justify-between items-center"><span className="font-semibold text-slate-400">إجمالي الطلاب:</span> <span className="font-bold text-white text-xl">{confirmationData.totalStudents}</span></p>
                    <p className="flex justify-between items-center"><span className="font-semibold text-slate-400">عدد الحاضرين:</span> <span className="font-bold text-green-400 text-xl">{confirmationData.presentStudents}</span></p>
                    <p className="flex justify-between items-center"><span className="font-semibold text-slate-400">عدد الغائبين:</span> <span className="font-bold text-red-400 text-xl">{confirmationData.absentStudents}</span></p>
                </div>
                <div className="flex justify-around pt-4">
                    <button
                        onClick={handleConfirmSubmission}
                        disabled={isSubmitting}
                        className="w-32 px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors duration-300 disabled:bg-slate-500 disabled:cursor-not-allowed flex items-center justify-center space-x-2 space-x-reverse"
                    >
                        {isSubmitting ? (
                            <>
                              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            </>
                        ) : 'تأكيد'}
                    </button>
                    <button
                        onClick={handleEditSubmission}
                        disabled={isSubmitting}
                        className="w-32 px-6 py-3 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-700 transition-colors duration-300 disabled:opacity-50"
                    >
                        تعديل
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default ObserverForm;