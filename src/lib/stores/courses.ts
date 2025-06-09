export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  courseCode: string;
  credits: number;
  duration: string;
  level: string;
  category: string;
  thumbnail: string;
  isEnrolled: boolean;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  rating: number;
  totalStudents: number;
  startDate: string;
  endDate: string;
  schedule: string;
  prerequisites: string[];
  learningOutcomes: string[];
  syllabus: {
    week: number;
    topic: string;
    description: string;
  }[];
}

const initialCourses: Course[] = [
  {
    id: '1',
    title: 'Digital Journalism Fundamentals',
    description: 'Master the basics of digital journalism including online reporting, multimedia storytelling, and digital ethics.',
    instructor: 'Dr. Michael Chen',
    courseCode: 'DJ101',
    credits: 4,
    duration: '12 weeks',
    level: 'Beginner',
    category: 'Digital Media',
    thumbnail: 'https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1',
    isEnrolled: true,
    progress: 65,
    totalLessons: 24,
    completedLessons: 16,
    rating: 4.8,
    totalStudents: 156,
    startDate: '2024-01-15',
    endDate: '2024-04-15',
    schedule: 'Mon, Wed, Fri - 10:00 AM',
    prerequisites: ['Basic Computer Skills', 'English Proficiency'],
    learningOutcomes: [
      'Understand digital journalism principles',
      'Create multimedia content',
      'Apply ethical standards in digital reporting',
      'Use digital tools for research and verification'
    ],
    syllabus: [
      { week: 1, topic: 'Introduction to Digital Journalism', description: 'Overview of digital media landscape' },
      { week: 2, topic: 'Online Research Techniques', description: 'Advanced search strategies and source verification' },
      { week: 3, topic: 'Multimedia Storytelling', description: 'Combining text, images, audio, and video' },
      { week: 4, topic: 'Social Media Journalism', description: 'Reporting and verification on social platforms' }
    ]
  },
  {
    id: '2',
    title: 'Investigative Reporting Masterclass',
    description: 'Advanced techniques for investigative journalism, including data analysis, source protection, and long-form storytelling.',
    instructor: 'Sarah Williams',
    courseCode: 'IR201',
    credits: 6,
    duration: '16 weeks',
    level: 'Advanced',
    category: 'Investigative',
    thumbnail: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1',
    isEnrolled: true,
    progress: 30,
    totalLessons: 32,
    completedLessons: 10,
    rating: 4.9,
    totalStudents: 89,
    startDate: '2024-02-01',
    endDate: '2024-05-30',
    schedule: 'Tue, Thu - 2:00 PM',
    prerequisites: ['Basic Journalism', 'Research Methods'],
    learningOutcomes: [
      'Conduct in-depth investigations',
      'Analyze complex data sets',
      'Protect sources and maintain confidentiality',
      'Write compelling long-form narratives'
    ],
    syllabus: [
      { week: 1, topic: 'Investigation Planning', description: 'Developing investigation strategies' },
      { week: 2, topic: 'Data Journalism', description: 'Working with databases and statistics' },
      { week: 3, topic: 'Source Development', description: 'Building and maintaining source networks' },
      { week: 4, topic: 'Legal Considerations', description: 'Understanding media law and ethics' }
    ]
  },
  {
    id: '3',
    title: 'Broadcast Journalism Essentials',
    description: 'Learn the fundamentals of television and radio journalism, including on-camera presentation and audio production.',
    instructor: 'James Rodriguez',
    courseCode: 'BJ101',
    credits: 5,
    duration: '14 weeks',
    level: 'Intermediate',
    category: 'Broadcast',
    thumbnail: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1',
    isEnrolled: false,
    progress: 0,
    totalLessons: 28,
    completedLessons: 0,
    rating: 4.7,
    totalStudents: 124,
    startDate: '2024-03-01',
    endDate: '2024-06-15',
    schedule: 'Mon, Wed - 3:00 PM',
    prerequisites: ['Communication Skills', 'Basic Journalism'],
    learningOutcomes: [
      'Master on-camera presentation',
      'Understand broadcast production workflow',
      'Develop interviewing skills for broadcast',
      'Learn audio and video editing basics'
    ],
    syllabus: [
      { week: 1, topic: 'Broadcast Fundamentals', description: 'Understanding TV and radio formats' },
      { week: 2, topic: 'On-Camera Techniques', description: 'Presentation and delivery skills' },
      { week: 3, topic: 'Interview Skills', description: 'Conducting effective broadcast interviews' },
      { week: 4, topic: 'Production Basics', description: 'Technical aspects of broadcast production' }
    ]
  },
  {
    id: '4',
    title: 'Data Journalism and Visualization',
    description: 'Learn to find, analyze, and visualize data to tell compelling stories through charts, maps, and interactive graphics.',
    instructor: 'Dr. Emily Zhang',
    courseCode: 'DJ301',
    credits: 4,
    duration: '10 weeks',
    level: 'Advanced',
    category: 'Data',
    thumbnail: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1',
    isEnrolled: false,
    progress: 0,
    totalLessons: 20,
    completedLessons: 0,
    rating: 4.6,
    totalStudents: 67,
    startDate: '2024-04-01',
    endDate: '2024-06-10',
    schedule: 'Fri - 1:00 PM',
    prerequisites: ['Statistics Basics', 'Excel Proficiency'],
    learningOutcomes: [
      'Extract insights from complex datasets',
      'Create compelling data visualizations',
      'Use data journalism tools and software',
      'Apply statistical analysis to reporting'
    ],
    syllabus: [
      { week: 1, topic: 'Data Sources and Collection', description: 'Finding and gathering reliable data' },
      { week: 2, topic: 'Data Cleaning and Analysis', description: 'Preparing data for analysis' },
      { week: 3, topic: 'Visualization Principles', description: 'Creating effective charts and graphs' },
      { week: 4, topic: 'Interactive Graphics', description: 'Building engaging data presentations' }
    ]
  }
];

export const courses = $state<Course[]>(initialCourses);

// Helper functions
export function enrollInCourse(courseId: string) {
  const courseIndex = courses.value.findIndex(course => course.id === courseId);
  if (courseIndex !== -1) {
    courses.value[courseIndex].isEnrolled = true;
  }
}

export function unenrollFromCourse(courseId: string) {
  const courseIndex = courses.value.findIndex(course => course.id === courseId);
  if (courseIndex !== -1) {
    courses.value[courseIndex].isEnrolled = false;
    courses.value[courseIndex].progress = 0;
    courses.value[courseIndex].completedLessons = 0;
  }
}

export function updateCourseProgress(courseId: string, progress: number, completedLessons: number) {
  const courseIndex = courses.value.findIndex(course => course.id === courseId);
  if (courseIndex !== -1) {
    courses.value[courseIndex].progress = progress;
    courses.value[courseIndex].completedLessons = completedLessons;
  }
}