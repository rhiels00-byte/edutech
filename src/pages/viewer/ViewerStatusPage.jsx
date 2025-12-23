import React, { useMemo, useState } from 'react';
import RightPanel from '../../components/RightPanel';
import { textbookStudents } from '../../data/studentData';

// feature: viewer.status
// mappingStatus: Derived from textbook.submission.status
// apiCandidates (LMS mapping): GET /tch/eval/result/status
const ViewerStatusPage = ({ assessmentId, onBack }) => {
  const [submitFilter, setSubmitFilter] = useState('all');
  const [hideAnswer, setHideAnswer] = useState(true);

  const filteredStudents = useMemo(() => {
    if (submitFilter === 'submitted') return textbookStudents.filter((s) => s.submitted);
    if (submitFilter === 'not-submitted') return textbookStudents.filter((s) => !s.submitted);
    return textbookStudents;
  }, [submitFilter]);

  return (
    <div className="min-h-screen bg-gray-50 p-6" style={{ fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      <div className="mb-4">
        <button onClick={onBack} className="text-sm text-gray-500 hover:text-blue-500">
          ← 목록으로 돌아가기
        </button>
      </div>
      <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
        <RightPanel
          title="제출현황"
          icon="👥"
          onClose={onBack}
          width="w-full"
          headerActions={null}
          isCollapsed={false}
          onToggleCollapse={null}
        >
          <div className="flex border-b border-gray-200 bg-white">
            {[
              { id: 'all', label: `전체 ${textbookStudents.length}` },
              { id: 'submitted', label: `제출 ${textbookStudents.filter((s) => s.submitted).length}` },
              { id: 'not-submitted', label: `미제출 ${textbookStudents.filter((s) => !s.submitted).length}` }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSubmitFilter(tab.id)}
                className={`flex-1 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
                  submitFilter === tab.id ? 'text-blue-500 border-blue-500' : 'text-gray-500 border-transparent'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="px-3 py-2.5 border-b border-gray-200 flex items-center justify-between text-xs bg-white">
            <span className="text-gray-500">정오 숨기기</span>
            <button
              onClick={() => setHideAnswer(!hideAnswer)}
              className={`w-9 h-5 rounded-full relative cursor-pointer transition-colors ${hideAnswer ? 'bg-blue-500' : 'bg-gray-300'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform shadow ${hideAnswer ? 'translate-x-4' : 'translate-x-0.5'}`}></div>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                className={`px-4 py-3 flex items-center gap-3 border-b border-gray-100 ${
                  student.submitted ? '' : 'opacity-70'
                }`}
              >
                <span className="text-xl">{student.avatar}</span>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-800">{student.name}</div>
                  <div className="text-xs text-gray-400">
                    {student.submitted ? '제출 완료' : '미제출'}
                  </div>
                </div>
                {student.submitted ? (
                  <div className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold ${
                    hideAnswer ? 'bg-gray-100 text-gray-400' :
                    student.status === 'correct' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {hideAnswer ? '—' : student.status === 'correct' ? 'O' : 'X'}
                  </div>
                ) : (
                  <span className="text-xs text-gray-400">미제출</span>
                )}
              </div>
            ))}
          </div>
        </RightPanel>
      </div>

      <div className="mt-4 text-xs text-gray-400">
        평가 {assessmentId} 제출 현황 (피드백/판서/다시풀기 기능은 제외됨)
      </div>
    </div>
  );
};

export default ViewerStatusPage;
