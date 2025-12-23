export const AssessmentStatus = {
  DRAFT: 'DRAFT',
  SCHEDULED: 'SCHEDULED',
  LIVE: 'LIVE',
  ENDED: 'ENDED'
};

export const AssessmentSubStatus = {
  NEEDS_GRADING: 'NEEDS_GRADING'
};

export const AssessmentRole = {
  TEACHER: 'teacher',
  STUDENT: 'student'
};

export const AssessmentKind = {
  EXAM: 'exam',
  HOMEWORK: 'homework'
};

export const AssessmentCreationMethod = {
  IMPORT: 'import',
  DIRECT: 'direct',
  AI: 'ai',
  PRESCRIPTION: 'prescription'
};

export const AssessmentSortOption = {
  LATEST: 'latest',
  DUE_SOON: 'dueSoon',
  LOW_SUBMISSION: 'lowSubmission'
};

export type SubmissionStats = {
  submitted: number;
  total: number;
};

export type Assessment = {
  id: string;
  kind: keyof typeof AssessmentKind;
  title: string;
  status: keyof typeof AssessmentStatus;
  subStatus: keyof typeof AssessmentSubStatus | null;
  creationMethod: keyof typeof AssessmentCreationMethod;
  lastSavedAt?: string;
  startsAt: string;
  endsAt: string;
  timeLimitMinutes: number;
  submissions: SubmissionStats;
  needsGrading: boolean;
};
