import { writable } from 'svelte/store';

export interface Assignment {
  id: string;
  title: string;
  description: string;
  courseId: string;
  courseName: string;
  instructor: string;
  dueDate: string;
  submissionDate?: string;
  status: 'pending' | 'submitted' | 'graded' | 'overdue';
  type: 'essay' | 'project' | 'quiz' | 'presentation' | 'research';
  maxScore: number;
  score?: number;
  feedback?: string;
  attachments: string[];
  submissionFormat: string[];
  instructions: string;
  rubric?: {
    criteria: string;
    points: number;
    description: string;
  }[];
}

const initialAssignments: Assignment[] = [
  {
    id: '1',
    title: 'Digital Media Ethics Case Study',
    description: 'Analyze a recent digital media ethics controversy and propose solutions based on journalistic principles.',
    courseId: '1',
    courseName: 'Digital Journalism Fundamentals',
    instructor: 'Dr. Michael Chen',
    dueDate: '2024-02-15T23:59:00',
    status: 'pending',
    type: 'essay',
    maxScore: 100,
    attachments: ['ethics_guidelines.pdf', 'case_study_template.docx'],
    submissionFormat: ['PDF', 'Word Document'],
    instructions: 'Write a 1500-word analysis examining the ethical implications of a recent digital media controversy. Include references to established journalistic ethics codes and propose actionable solutions.',
    rubric: [
      { criteria: 'Analysis Depth', points: 30, description: 'Thorough examination of ethical issues' },
      { criteria: 'Research Quality', points: 25, description: 'Use of credible sources and evidence' },
      { criteria: 'Writing Quality', points: 25, description: 'Clear, professional writing style' },
      { criteria: 'Solutions', points: 20, description: 'Practical and well-reasoned recommendations' }
    ]
  },
  {
    id: '2',
    title: 'Multimedia Story Package',
    description: 'Create a comprehensive multimedia story combining text, images, audio, and video elements.',
    courseId: '1',
    courseName: 'Digital Journalism Fundamentals',
    instructor: 'Dr. Michael Chen',
    dueDate: '2024-02-28T23:59:00',
    status: 'pending',
    type: 'project',
    maxScore: 150,
    attachments: ['multimedia_guidelines.pdf', 'technical_requirements.pdf'],
    submissionFormat: ['ZIP file with all media', 'Online portfolio link'],
    instructions: 'Develop a complete multimedia story package on a local news topic. Include written article (800-1000 words), photo gallery (5-8 images), audio interview (3-5 minutes), and video component (2-3 minutes).',
    rubric: [
      { criteria: 'Story Quality', points: 40, description: 'Compelling narrative and news value' },
      { criteria: 'Technical Execution', points: 35, description: 'Quality of multimedia elements' },
      { criteria: 'Integration', points: 35, description: 'How well elements work together' },
      { criteria: 'Presentation', points: 40, description: 'Professional presentation and organization' }
    ]
  },
  {
    id: '3',
    title: 'Source Protection Strategies',
    description: 'Research and present on advanced techniques for protecting confidential sources in investigative reporting.',
    courseId: '2',
    courseName: 'Investigative Reporting Masterclass',
    instructor: 'Sarah Williams',
    dueDate: '2024-03-10T23:59:00',
    status: 'pending',
    type: 'presentation',
    maxScore: 100,
    attachments: ['source_protection_readings.pdf', 'presentation_template.pptx'],
    submissionFormat: ['PowerPoint/PDF', 'Video recording of presentation'],
    instructions: 'Prepare a 15-minute presentation on modern source protection techniques, including digital security measures, legal considerations, and ethical frameworks.',
    rubric: [
      { criteria: 'Content Knowledge', points: 30, description: 'Demonstrates understanding of source protection' },
      { criteria: 'Research Quality', points: 25, description: 'Use of current and relevant sources' },
      { criteria: 'Presentation Skills', points: 25, description: 'Clear delivery and engagement' },
      { criteria: 'Practical Application', points: 20, description: 'Real-world applicability of strategies' }
    ]
  },
  {
    id: '4',
    title: 'Data Analysis Project',
    description: 'Complete analysis of provided dataset and create a data-driven news story with visualizations.',
    courseId: '2',
    courseName: 'Investigative Reporting Masterclass',
    instructor: 'Sarah Williams',
    dueDate: '2024-01-20T23:59:00',
    submissionDate: '2024-01-18T14:30:00',
    status: 'graded',
    type: 'project',
    maxScore: 120,
    score: 105,
    feedback: 'Excellent analysis and compelling narrative. The visualizations effectively support your findings. Consider exploring the demographic breakdown further in future work.',
    attachments: ['dataset.csv', 'analysis_template.xlsx'],
    submissionFormat: ['Excel workbook', 'Written report (PDF)', 'Visualization files'],
    instructions: 'Analyze the provided government spending dataset to identify newsworthy trends or anomalies. Create appropriate visualizations and write a 1000-word news story based on your findings.',
    rubric: [
      { criteria: 'Data Analysis', points: 40, description: 'Accuracy and depth of statistical analysis' },
      { criteria: 'Story Development', points: 30, description: 'News value and narrative structure' },
      { criteria: 'Visualizations', points: 30, description: 'Clarity and effectiveness of charts/graphs' },
      { criteria: 'Documentation', points: 20, description: 'Clear methodology and source citations' }
    ]
  },
  {
    id: '5',
    title: 'Interview Transcript Analysis',
    description: 'Transcribe and analyze a recorded interview, identifying key quotes and story angles.',
    courseId: '1',
    courseName: 'Digital Journalism Fundamentals',
    instructor: 'Dr. Michael Chen',
    dueDate: '2024-01-25T23:59:00',
    submissionDate: '2024-01-24T16:45:00',
    status: 'graded',
    type: 'research',
    maxScore: 80,
    score: 72,
    feedback: 'Good transcription accuracy and identification of key themes. Work on developing stronger lead angles from the interview content.',
    attachments: ['interview_audio.mp3', 'transcription_guidelines.pdf'],
    submissionFormat: ['Word document', 'Analysis summary'],
    instructions: 'Transcribe the provided 20-minute interview recording and write a 500-word analysis identifying the most newsworthy elements and potential story angles.',
    rubric: [
      { criteria: 'Transcription Accuracy', points: 25, description: 'Faithful reproduction of spoken content' },
      { criteria: 'Key Quote Identification', points: 20, description: 'Selection of most impactful quotes' },
      { criteria: 'Story Angle Development', points: 25, description: 'Recognition of news value and angles' },
      { criteria: 'Analysis Quality', points: 10, description: 'Depth of insight and understanding' }
    ]
  }
];

export const assignments = writable<Assignment[]>(initialAssignments);

// Helper functions
export function submitAssignment(assignmentId: string, submissionDate: string = new Date().toISOString()) {
  assignments.update(assignmentList => 
    assignmentList.map(assignment => 
      assignment.id === assignmentId 
        ? { ...assignment, status: 'submitted' as const, submissionDate }
        : assignment
    )
  );
}

export function gradeAssignment(assignmentId: string, score: number, feedback: string) {
  assignments.update(assignmentList => 
    assignmentList.map(assignment => 
      assignment.id === assignmentId 
        ? { ...assignment, status: 'graded' as const, score, feedback }
        : assignment
    )
  );
}

export function addAssignment(assignment: Assignment) {
  assignments.update(assignmentList => [...assignmentList, assignment]);
}

export function updateAssignment(assignmentId: string, updates: Partial<Assignment>) {
  assignments.update(assignmentList => 
    assignmentList.map(assignment => 
      assignment.id === assignmentId 
        ? { ...assignment, ...updates }
        : assignment
    )
  );
}