export interface GradeEntry {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  courseId: string;
  courseName: string;
  instructor: string;
  score: number;
  maxScore: number;
  percentage: number;
  letterGrade: string;
  gradeDate: string;
  feedback?: string;
  rubricScores?: {
    criteria: string;
    score: number;
    maxScore: number;
    feedback?: string;
  }[];
  category: 'assignment' | 'quiz' | 'exam' | 'project' | 'participation';
  weight: number; // Weight in final grade calculation
}

export interface CourseGradeSummary {
  courseId: string;
  courseName: string;
  instructor: string;
  currentGrade: number;
  letterGrade: string;
  totalPoints: number;
  earnedPoints: number;
  assignments: {
    completed: number;
    total: number;
    averageScore: number;
  };
  breakdown: {
    category: string;
    weight: number;
    currentScore: number;
    maxScore: number;
    percentage: number;
  }[];
}

const initialGradeEntries: GradeEntry[] = [
  {
    id: '1',
    assignmentId: '4',
    assignmentTitle: 'Data Analysis Project',
    courseId: '2',
    courseName: 'Investigative Reporting Masterclass',
    instructor: 'Sarah Williams',
    score: 105,
    maxScore: 120,
    percentage: 87.5,
    letterGrade: 'B+',
    gradeDate: '2024-01-22',
    feedback: 'Excellent analysis and compelling narrative. The visualizations effectively support your findings. Consider exploring the demographic breakdown further in future work.',
    rubricScores: [
      { criteria: 'Data Analysis', score: 35, maxScore: 40, feedback: 'Thorough and accurate analysis' },
      { criteria: 'Story Development', score: 26, maxScore: 30, feedback: 'Strong narrative structure' },
      { criteria: 'Visualizations', score: 28, maxScore: 30, feedback: 'Clear and effective charts' },
      { criteria: 'Documentation', score: 16, maxScore: 20, feedback: 'Good methodology, could be more detailed' }
    ],
    category: 'project',
    weight: 25
  },
  {
    id: '2',
    assignmentId: '5',
    assignmentTitle: 'Interview Transcript Analysis',
    courseId: '1',
    courseName: 'Digital Journalism Fundamentals',
    instructor: 'Dr. Michael Chen',
    score: 72,
    maxScore: 80,
    percentage: 90,
    letterGrade: 'A-',
    gradeDate: '2024-01-28',
    feedback: 'Good transcription accuracy and identification of key themes. Work on developing stronger lead angles from the interview content.',
    rubricScores: [
      { criteria: 'Transcription Accuracy', score: 23, maxScore: 25, feedback: 'Very accurate transcription' },
      { criteria: 'Key Quote Identification', score: 18, maxScore: 20, feedback: 'Good selection of impactful quotes' },
      { criteria: 'Story Angle Development', score: 22, maxScore: 25, feedback: 'Solid angles, could be more creative' },
      { criteria: 'Analysis Quality', score: 9, maxScore: 10, feedback: 'Insightful analysis' }
    ],
    category: 'assignment',
    weight: 15
  },
  {
    id: '3',
    assignmentId: '10',
    assignmentTitle: 'Digital Ethics Quiz',
    courseId: '1',
    courseName: 'Digital Journalism Fundamentals',
    instructor: 'Dr. Michael Chen',
    score: 88,
    maxScore: 100,
    percentage: 88,
    letterGrade: 'B+',
    gradeDate: '2024-02-05',
    feedback: 'Strong understanding of ethical principles. Review social media verification protocols.',
    category: 'quiz',
    weight: 10
  },
  {
    id: '4',
    assignmentId: '11',
    assignmentTitle: 'Research Methods Exam',
    courseId: '2',
    courseName: 'Investigative Reporting Masterclass',
    instructor: 'Sarah Williams',
    score: 92,
    maxScore: 100,
    percentage: 92,
    letterGrade: 'A-',
    gradeDate: '2024-02-10',
    feedback: 'Excellent grasp of investigative techniques. Outstanding work on FOIA procedures.',
    category: 'exam',
    weight: 30
  },
  {
    id: '5',
    assignmentId: '12',
    assignmentTitle: 'Class Participation - Week 4',
    courseId: '1',
    courseName: 'Digital Journalism Fundamentals',
    instructor: 'Dr. Michael Chen',
    score: 95,
    maxScore: 100,
    percentage: 95,
    letterGrade: 'A',
    gradeDate: '2024-02-02',
    feedback: 'Active participation in discussions. Thoughtful questions and insights.',
    category: 'participation',
    weight: 5
  }
];

const initialCourseGradeSummaries: CourseGradeSummary[] = [
  {
    courseId: '1',
    courseName: 'Digital Journalism Fundamentals',
    instructor: 'Dr. Michael Chen',
    currentGrade: 89.2,
    letterGrade: 'B+',
    totalPoints: 380,
    earnedPoints: 339,
    assignments: {
      completed: 3,
      total: 8,
      averageScore: 85
    },
    breakdown: [
      { category: 'Assignments', weight: 40, currentScore: 160, maxScore: 180, percentage: 88.9 },
      { category: 'Quizzes', weight: 20, currentScore: 88, maxScore: 100, percentage: 88 },
      { category: 'Participation', weight: 10, currentScore: 95, maxScore: 100, percentage: 95 },
      { category: 'Final Project', weight: 30, currentScore: 0, maxScore: 100, percentage: 0 }
    ]
  },
  {
    courseId: '2',
    courseName: 'Investigative Reporting Masterclass',
    instructor: 'Sarah Williams',
    currentGrade: 91.5,
    letterGrade: 'A-',
    totalPoints: 320,
    earnedPoints: 293,
    assignments: {
      completed: 2,
      total: 6,
      averageScore: 89
    },
    breakdown: [
      { category: 'Projects', weight: 50, currentScore: 105, maxScore: 120, percentage: 87.5 },
      { category: 'Exams', weight: 30, currentScore: 92, maxScore: 100, percentage: 92 },
      { category: 'Research Papers', weight: 20, currentScore: 0, maxScore: 100, percentage: 0 }
    ]
  }
];

export const gradeEntries = $state<GradeEntry[]>(initialGradeEntries);
export const courseGradeSummaries = $state<CourseGradeSummary[]>(initialCourseGradeSummaries);

// Helper functions
export function addGrade(grade: GradeEntry) {
  gradeEntries.push(grade);
  updateCourseGradeSummary(grade.courseId);
}

export function updateGrade(gradeId: string, updates: Partial<GradeEntry>) {
  const gradeIndex = gradeEntries.findIndex(grade => grade.id === gradeId);
  if (gradeIndex !== -1) {
    gradeEntries[gradeIndex] = {
      ...gradeEntries[gradeIndex],
      ...updates
    };
  }
}

export function getGradesForCourse(courseId: string) {
  return gradeEntries.filter(grade => grade.courseId === courseId);
}

export function getCourseGradeSummary(courseId: string) {
  return courseGradeSummaries.find(summary => summary.courseId === courseId);
}

function updateCourseGradeSummary(courseId: string) {
  // This would recalculate the course grade summary
  // Implementation would depend on the specific grading logic
}

export function calculateLetterGrade(percentage: number): string {
  if (percentage >= 97) return 'A+';
  if (percentage >= 93) return 'A';
  if (percentage >= 90) return 'A-';
  if (percentage >= 87) return 'B+';
  if (percentage >= 83) return 'B';
  if (percentage >= 80) return 'B-';
  if (percentage >= 77) return 'C+';
  if (percentage >= 73) return 'C';
  if (percentage >= 70) return 'C-';
  if (percentage >= 67) return 'D+';
  if (percentage >= 63) return 'D';
  if (percentage >= 60) return 'D-';
  return 'F';
}

export function calculateGPA(letterGrade: string): number {
  const gradePoints: { [key: string]: number } = {
    'A+': 4.0, 'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D+': 1.3, 'D': 1.0, 'D-': 0.7,
    'F': 0.0
  };
  return gradePoints[letterGrade] || 0.0;
}