import { writable } from 'svelte/store';

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorAvatar: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  thumbnail: string;
  price: number;
  rating: number;
  studentsEnrolled: number;
  lessons: Lesson[];
  syllabus: string[];
  progress?: number;
  isEnrolled?: boolean;
  completionDate?: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'reading' | 'quiz' | 'assignment';
  videoUrl?: string;
  content?: string;
  isCompleted?: boolean;
  resources?: Resource[];
}

export interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'doc' | 'link' | 'video';
  url: string;
  size?: string;
}

const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Digital Journalism Fundamentals',
    description: 'Master the basics of digital journalism, from research to publication in the digital age.',
    instructor: 'Dr. Michael Chen',
    instructorAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    duration: '8 weeks',
    level: 'Beginner',
    category: 'Digital Media',
    thumbnail: 'https://images.pexels.com/photos/97080/pexels-photo-97080.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1',
    price: 299,
    rating: 4.8,
    studentsEnrolled: 1247,
    progress: 65,
    isEnrolled: true,
    lessons: [
      {
        id: '1',
        title: 'Introduction to Digital Journalism',
        duration: '45 min',
        type: 'video',
        videoUrl: 'https://example.com/video1',
        isCompleted: true,
        resources: [
          {
            id: '1',
            title: 'Course Syllabus',
            type: 'pdf',
            url: '/resources/syllabus.pdf',
            size: '2.3 MB'
          }
        ]
      },
      {
        id: '2',
        title: 'Research Techniques',
        duration: '60 min',
        type: 'video',
        videoUrl: 'https://example.com/video2',
        isCompleted: true
      },
      {
        id: '3',
        title: 'Writing for Digital Platforms',
        duration: '50 min',
        type: 'video',
        videoUrl: 'https://example.com/video3',
        isCompleted: false
      }
    ],
    syllabus: [
      'Introduction to Digital Journalism',
      'Research and Fact-Checking',
      'Writing for Digital Platforms',
      'Multimedia Storytelling',
      'Social Media Integration',
      'Ethics in Digital Journalism',
      'SEO for Journalists',
      'Final Project'
    ]
  },
  {
    id: '2',
    title: 'Investigative Reporting Masterclass',
    description: 'Advanced techniques for investigative journalism, including data analysis and source protection.',
    instructor: 'Sarah Williams',
    instructorAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    duration: '12 weeks',
    level: 'Advanced',
    category: 'Investigative',
    thumbnail: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1',
    price: 599,
    rating: 4.9,
    studentsEnrolled: 543,
    progress: 30,
    isEnrolled: true,
    lessons: [
      {
        id: '1',
        title: 'Investigative Methodology',
        duration: '75 min',
        type: 'video',
        isCompleted: true
      },
      {
        id: '2',
        title: 'Source Protection',
        duration: '60 min',
        type: 'video',
        isCompleted: false
      }
    ],
    syllabus: [
      'Investigative Methodology',
      'Source Development and Protection',
      'Data Analysis Techniques',
      'Legal Considerations',
      'Digital Security',
      'Interview Techniques',
      'Story Structure',
      'Publication Ethics'
    ]
  },
  {
    id: '3',
    title: 'Broadcast Journalism Essentials',
    description: 'Learn the fundamentals of television and radio journalism, from scriptwriting to on-air presentation.',
    instructor: 'James Rodriguez',
    instructorAvatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    duration: '10 weeks',
    level: 'Intermediate',
    category: 'Broadcast',
    thumbnail: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1',
    price: 449,
    rating: 4.7,
    studentsEnrolled: 892,
    isEnrolled: false,
    lessons: [],
    syllabus: [
      'Broadcast Writing Fundamentals',
      'Voice and Delivery',
      'Camera Presence',
      'Interview Techniques',
      'Live Reporting',
      'News Production',
      'Ethics in Broadcasting',
      'Career Development'
    ]
  }
];

export const courses = writable<Course[]>(mockCourses);
export const selectedCourse = writable<Course | null>(null);