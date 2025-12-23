import { AssessmentRole, AssessmentStatus } from '../types/assessmentTypes';

export const getPrimaryCta = (status, role) => {
  if (status === AssessmentStatus.LIVE) {
    return role === AssessmentRole.TEACHER
      ? { label: '현황 보기', action: 'results' }
      : { label: '시작/계속하기', action: 'run' };
  }

  if (status === AssessmentStatus.SCHEDULED) {
    return role === AssessmentRole.TEACHER
      ? { label: '미리보기', action: 'preview' }
      : null;
  }

  if (status === AssessmentStatus.ENDED) {
    return { label: '결과 보기', action: 'results' };
  }

  if (status === AssessmentStatus.DRAFT) {
    return role === AssessmentRole.TEACHER
      ? { label: '설정 마무리', action: 'settings' }
      : null;
  }

  return null;
};

export const getSecondaryCta = (status, role) => {
  if (status === AssessmentStatus.ENDED && role === AssessmentRole.TEACHER) {
    return { label: '리포트 보기', action: 'report' };
  }

  return null;
};
