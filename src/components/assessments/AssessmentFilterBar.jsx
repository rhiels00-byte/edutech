import React from 'react';
import {
  AssessmentCreationMethod,
  AssessmentSortOption,
  AssessmentStatus
} from '../../types/assessmentTypes';

const STATUS_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: AssessmentStatus.DRAFT, label: '편집중' },
  { value: AssessmentStatus.SCHEDULED, label: '할 일' },
  { value: AssessmentStatus.LIVE, label: '하는 중' },
  { value: AssessmentStatus.ENDED, label: '끝' }
];

const METHOD_OPTIONS = [
  { value: 'all', label: '방식' },
  { value: AssessmentCreationMethod.DIRECT, label: '직접' },
  { value: AssessmentCreationMethod.AI, label: 'AI' },
  { value: AssessmentCreationMethod.PRESCRIPTION, label: '처방' }
];

const SORT_OPTIONS = [
  { value: AssessmentSortOption.LATEST, label: '최신순' },
  { value: AssessmentSortOption.DUE_SOON, label: '마감임박' },
  { value: AssessmentSortOption.LOW_SUBMISSION, label: '제출률 낮은 순' }
];

export default function AssessmentFilterBar({ filters, onChange }) {
  return (
    <div className="bg-white rounded-3xl p-3 flex flex-wrap gap-2 items-center justify-between shadow-sm">
      <div className="flex flex-wrap gap-2 items-center flex-1">
        <select
          value={filters.status}
          onChange={(event) => onChange({ ...filters, status: event.target.value })}
          className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <select
          value={filters.method}
          onChange={(event) => onChange({ ...filters, method: event.target.value })}
          className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {METHOD_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <select
          value={filters.sort}
          onChange={(event) => onChange({ ...filters, sort: event.target.value })}
          className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <input
        type="text"
        value={filters.search || ''}
        onChange={(event) => onChange({ ...filters, search: event.target.value })}
        placeholder="🔍 평가 검색"
        className="px-3 py-2 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 border border-gray-200"
      />
    </div>
  );
}
