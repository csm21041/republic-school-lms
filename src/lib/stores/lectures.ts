import { writable } from 'svelte/store';

export interface Lecture {
  id: string;
  title: string;
  description: string;
  courseId: string;
  courseName: string;
  instructor: string;
  date: string;
  time: string;
  duration: number; // in minutes
  location: string;
  type: 'live' | 'recorded' | 'hybrid';
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  attendanceRequired: boolean;
  materials: string[];
  recordingUrl?: string;
  meetingLink?: string;
  topics: string[];
  prerequisites?: string[];
}

const initialLectures: Lecture[] = [
  {
    id: '1',
    title: 'Introduction to Digital Storytelling',
    description: 'Overview of digital storytelling techniques and tools used in modern journalism.',
    courseId: '1',
    courseName: 'Digital Journalism Fundamentals',
    instructor: 'Dr. Michael Chen',
    date: '2024-02-12',
    time: '10:00',
    duration: 90,
    location: 'Room 201 / Online',
    type: 'hybrid',
    status: 'upcoming',
    attendanceRequired: true,
    materials: ['digital_storytelling_slides.pdf', 'reading_list.pdf'],
    meetingLink: 'https://meet.example.com/digital-storytelling',
    topics: [
      'Elements of digital storytelling',
      'Multimedia integration techniques',
      'Audience engagement strategies',
      'Platform-specific considerations'
    ],
    prerequisites: ['Basic journalism principles']
  },
  {
    id: '2',
    title: 'Advanced Source Protection',
    description: 'Deep dive into protecting confidential sources in the digital age.',
    courseId: '2',
    courseName: 'Investigative Reporting Masterclass',
    instructor: 'Sarah Williams',
    date: '2024-02-13',
    time: '14:00',
    duration: 120,
    location: 'Room 305',
    type: 'live',
    status: 'upcoming',
    attendanceRequired: true,
    materials: ['source_protection_guide.pdf', 'legal_framework.pdf', 'digital_security_tools.pdf'],
    topics: [
      'Legal protections for sources',
      'Digital security measures',
      'Encrypted communication tools',
      'Ethical considerations',
      'Case studies in source protection'
    ],
    prerequisites: ['Basic investigative techniques', 'Understanding of media law']
  },
  {
    id: '3',
    title: 'Data Visualization Best Practices',
    description: 'Learn to create compelling and accurate data visualizations for news stories.',
    courseId: '4',
    courseName: 'Data Journalism and Visualization',
    instructor: 'Dr. Emily Zhang',
    date: '2024-02-14',
    time: '13:00',
    duration: 75,
    location: 'Computer Lab A',
    type: 'live',
    status: 'upcoming',
    attendanceRequired: true,
    materials: ['visualization_tools.pdf', 'sample_datasets.zip', 'design_principles.pdf'],
    topics: [
      'Chart selection principles',
      'Color theory for data viz',
      'Interactive visualization tools',
      'Accessibility in data presentation',
      'Common visualization mistakes'
    ],
    prerequisites: ['Basic statistics', 'Familiarity with spreadsheet software']
  },
  {
    id: '4',
    title: 'Ethics in Digital Journalism',
    description: 'Exploring ethical challenges and solutions in the digital media landscape.',
    courseId: '1',
    courseName: 'Digital Journalism Fundamentals',
    instructor: 'Dr. Michael Chen',
    date: '2024-02-08',
    time: '10:00',
    duration: 90,
    location: 'Room 201 / Online',
    type: 'hybrid',
    status: 'completed',
    attendanceRequired: true,
    materials: ['ethics_framework.pdf', 'case_studies.pdf'],
    recordingUrl: 'https://recordings.example.com/ethics-digital-journalism',
    topics: [
      'Traditional ethics in digital context',
      'Social media verification',
      'Privacy considerations',
      'Misinformation and fact-checking',
      'Audience engagement ethics'
    ]
  },
  {
    id: '5',
    title: 'Investigative Research Methods',
    description: 'Advanced techniques for conducting thorough investigative research.',
    courseId: '2',
    courseName: 'Investigative Reporting Masterclass',
    instructor: 'Sarah Williams',
    date: '2024-02-06',
    time: '14:00',
    duration: 120,
    location: 'Room 305',
    type: 'live',
    status: 'completed',
    attendanceRequired: true,
    materials: ['research_methodology.pdf', 'database_access_guide.pdf', 'foia_templates.pdf'],
    recordingUrl: 'https://recordings.example.com/investigative-research',
    topics: [
      'Public records research',
      'Database investigation techniques',
      'FOIA and information requests',
      'Source development strategies',
      'Document analysis methods'
    ]
  },
  {
    id: '6',
    title: 'Mobile Journalism Workshop',
    description: 'Hands-on workshop on creating professional content using mobile devices.',
    courseId: '1',
    courseName: 'Digital Journalism Fundamentals',
    instructor: 'Dr. Michael Chen',
    date: '2024-02-15',
    time: '15:00',
    duration: 180,
    location: 'Media Lab',
    type: 'live',
    status: 'upcoming',
    attendanceRequired: true,
    materials: ['mobile_journalism_guide.pdf', 'app_recommendations.pdf', 'equipment_list.pdf'],
    topics: [
      'Mobile video production',
      'Audio recording techniques',
      'Live streaming basics',
      'Mobile editing applications',
      'Publishing workflows'
    ],
    prerequisites: ['Smartphone with camera', 'Basic video editing knowledge']
  }
];

export const lectures = writable<Lecture[]>(initialLectures);

// Helper functions
export function markAttendance(lectureId: string, attended: boolean) {
  // This would typically update attendance records
  console.log(`Attendance marked for lecture ${lectureId}: ${attended}`);
}

export function addLecture(lecture: Lecture) {
  lectures.update(lectureList => [...lectureList, lecture]);
}

export function updateLecture(lectureId: string, updates: Partial<Lecture>) {
  lectures.update(lectureList => 
    lectureList.map(lecture => 
      lecture.id === lectureId 
        ? { ...lecture, ...updates }
        : lecture
    )
  );
}

export function cancelLecture(lectureId: string) {
  lectures.update(lectureList => 
    lectureList.map(lecture => 
      lecture.id === lectureId 
        ? { ...lecture, status: 'cancelled' as const }
        : lecture
    )
  );
}