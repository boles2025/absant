export interface AttendanceRecord {
  id: string;
  observerName: string;
  academicYear: string;
  committeeNumber: string;
  committeeLocation: string;
  courseName: string;
  date: string;
  totalStudents: number;
  presentStudents: number;
  absentStudents: number;
  attendanceSheetImage?: string; // Base64 encoded image string
}

export enum View {
  Observer,
  Admin,
}

// Declare global variables for libraries loaded via CDN
declare global {
  const XLSX: any;
}