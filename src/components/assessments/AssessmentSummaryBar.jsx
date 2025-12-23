import React, { useState } from 'react';
import { AssessmentStatus } from '../../types/assessmentTypes';

const isDueSoon = (assessment) => {
  const diff = new Date(assessment.endsAt) - new Date();
  return diff > 0 && diff < 1000 * 60 * 60 * 48;
};

export default function AssessmentSummaryBar({ liveCount, needsGradingCount, dueSoonCount, assessments, onNavigate }) {
  const [openDropdown, setOpenDropdown] = useState(null);

  const needsGradingList = assessments.filter((item) => item.needsGrading);
  const dueSoonList = assessments.filter((item) => isDueSoon(item));
  const liveList = assessments.filter((item) => item.status === AssessmentStatus.LIVE);

  const handleItemClick = (assessment) => {
    setOpenDropdown(null);
    onNavigate('preview', assessment.id);
  };

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm">
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
        {/* 채점필요 */}
        <div className="relative">
          <button
            onClick={() => setOpenDropdown(openDropdown === 'grading' ? null : 'grading')}
            className="flex items-center gap-2 hover:bg-gray-50 px-3 py-2 rounded-xl transition-colors"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="font-medium">채점필요 {needsGradingCount}</span>
            {needsGradingCount > 0 && <span className="text-gray-400">▼</span>}
          </button>
          {openDropdown === 'grading' && needsGradingList.length > 0 && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-2xl shadow-lg z-10 max-h-64 overflow-y-auto">
              {needsGradingList.map((assessment) => (
                <button
                  key={assessment.id}
                  onClick={() => handleItemClick(assessment)}
                  className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                >
                  {assessment.title}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 마감임박 */}
        <div className="relative">
          <button
            onClick={() => setOpenDropdown(openDropdown === 'dueSoon' ? null : 'dueSoon')}
            className="flex items-center gap-2 hover:bg-gray-50 px-3 py-2 rounded-xl transition-colors"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="font-medium">마감임박 {dueSoonCount}</span>
            {dueSoonCount > 0 && <span className="text-gray-400">▼</span>}
          </button>
          {openDropdown === 'dueSoon' && dueSoonList.length > 0 && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-2xl shadow-lg z-10 max-h-64 overflow-y-auto">
              {dueSoonList.map((assessment) => (
                <button
                  key={assessment.id}
                  onClick={() => handleItemClick(assessment)}
                  className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                >
                  {assessment.title}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 진행중 */}
        <div className="relative">
          <button
            onClick={() => setOpenDropdown(openDropdown === 'live' ? null : 'live')}
            className="flex items-center gap-2 hover:bg-gray-50 px-3 py-2 rounded-xl transition-colors"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="font-medium">진행중 {liveCount}</span>
            {liveCount > 0 && <span className="text-gray-400">▼</span>}
          </button>
          {openDropdown === 'live' && liveList.length > 0 && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-2xl shadow-lg z-10 max-h-64 overflow-y-auto">
              {liveList.map((assessment) => (
                <button
                  key={assessment.id}
                  onClick={() => handleItemClick(assessment)}
                  className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                >
                  {assessment.title}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
