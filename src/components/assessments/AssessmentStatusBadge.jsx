import React from 'react';
import { AssessmentStatus, AssessmentSubStatus } from '../../types/assessmentTypes';

const STATUS_STYLES = {
  [AssessmentStatus.DRAFT]: 'bg-slate-100 text-slate-600',
  [AssessmentStatus.SCHEDULED]: 'bg-indigo-100 text-indigo-600',
  [AssessmentStatus.LIVE]: 'bg-emerald-100 text-emerald-600',
  [AssessmentStatus.ENDED]: 'bg-gray-100 text-gray-600'
};

const STATUS_LABELS = {
  [AssessmentStatus.DRAFT]: '편집중',
  [AssessmentStatus.SCHEDULED]: '할 일',
  [AssessmentStatus.LIVE]: '하는 중',
  [AssessmentStatus.ENDED]: '끝'
};

export default function AssessmentStatusBadge({ status, subStatus }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[status]}`}>
        {STATUS_LABELS[status]}
      </span>
      {subStatus === AssessmentSubStatus.NEEDS_GRADING && (
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-600">
          채점필요
        </span>
      )}
    </div>
  );
}
