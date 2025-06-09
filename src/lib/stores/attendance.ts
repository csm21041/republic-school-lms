import { writable } from 'svelte/store';

export interface AttendanceRecord {
  id: string;
  lectureId: string;
  lectureTitle: string;
  courseId: string;
  courseName: string;
  date: string;
  time: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  checkInTime?: string;
  notes?: string;
}

export interface AttendanceSummary {
  courseId: string;
  courseName: string;
  totalLectures: number;
  attendedLectures: number;
  absentLectures: number;
  lateCount: number;
  excusedCount: number;
  attendancePercentage: number;
}

const initialAttendanceRecords: AttendanceRecord[] = [
  {
    id: '1',
    lectureId: '4',
    lectureTitle: 'Ethics in Digital Journalism',
    courseId: '1',
    courseName: 'Digital Journalism Fundamentals',
    date: '2024-02-08',
    time: '10:00',
    status: 'present',
    checkInTime: '09:58'
  },
  {
    id: '2',
    lectureId: '5',
    lectureTitle: 'Investigative Research Methods',
    courseId: '2',
    courseName: 'Investigative Reporting Masterclass',
    date: '2024-02-06',
    time: '14:00',
    status: 'present',
    checkInTime: '14:05',
    notes: 'Arrived slightly late due to previous class'
  },
  {
    id: '3',
    lectureId: '7',
    lectureTitle: 'Introduction to Multimedia',
    courseId: '1',
    courseName: 'Digital Journalism Fundamentals',
    date: '2024-02-01',
    time: '10:00',
    status: 'present',
    checkInTime: '09:55'
  },
  {
    id: '4',
    lectureId: '8',
    lectureTitle: 'Source Development Strategies',
    courseId: '2',
    courseName: 'Investigative Reporting Masterclass',
    date: '2024-01-30',
    time: '14:00',
    status: 'absent',
    notes: 'Medical appointment'
  },
  {
    id: '5',
    lectureId: '9',
    lectureTitle: 'Digital Tools Overview',
    courseId: '1',
    courseName: 'Digital Journalism Fundamentals',
    date: '2024-01-25',
    time: '10:00',
    status: 'late',
    checkInTime: '10:15',
    notes: 'Traffic delay'
  }
];

const initialAttendanceSummaries: AttendanceSummary[] = [
  {
    courseId: '1',
    courseName: 'Digital Journalism Fundamentals',
    totalLectures: 8,
    attendedLectures: 6,
    absentLectures: 1,
    lateCount: 1,
    excusedCount: 0,
    attendancePercentage: 75
  },
  {
    courseId: '2',
    courseName: 'Investigative Reporting Masterclass',
    totalLectures: 6,
    attendedLectures: 5,
    absentLectures: 1,
    lateCount: 0,
    excusedCount: 0,
    attendancePercentage: 83
  }
];

export const attendanceRecords = writable<AttendanceRecord[]>(initialAttendanceRecords);
export const attendanceSummaries = writable<AttendanceSummary[]>(initialAttendanceSummaries);

// Helper functions
export function markAttendance(lectureId: string, status: AttendanceRecord['status'], checkInTime?: string, notes?: string) {
  const newRecord: AttendanceRecord = {
    id: Date.now().toString(),
    lectureId,
    lectureTitle: 'Lecture Title', // This would be fetched from lectures store
    courseId: '1', // This would be determined from the lecture
    courseName: 'Course Name', // This would be fetched from courses store
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().split(' ')[0].substring(0, 5),
    status,
    checkInTime,
    notes
  };

  attendanceRecords.update(records => [...records, newRecord]);
  updateAttendanceSummary(newRecord.courseId);
}

export function updateAttendanceRecord(recordId: string, updates: Partial<AttendanceRecord>) {
  attendanceRecords.update(records => 
    records.map(record => 
      record.id === recordId 
        ? { ...record, ...updates }
        : record
    )
  );
}

function updateAttendanceSummary(courseId: string) {
  // This would recalculate attendance summary for the course
  // Implementation would depend on the specific business logic
}

export function getAttendanceForCourse(courseId: string) {
  return attendanceRecords.subscribe(records => 
    records.filter(record => record.courseId === courseId)
  );
}

export function getAttendanceSummaryForCourse(courseId: string) {
  return attendanceSummaries.subscribe(summaries => 
    summaries.find(summary => summary.courseId === courseId)
  );
}