import React from 'react';

// feature: assessment.edit
// mappingStatus: Placeholder
// apiCandidates (LMS mapping): GET /tch/eval/info, POST /tch/eval/time
const AssessmentEditPage = ({ assessmentId, onBack }) => {
  return (
    <div className="min-h-screen bg-gray-50 p-6" style={{ fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      <div className="bg-white rounded-3xl p-8 shadow-sm space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">재구성 edit</h2>
        <p className="text-sm text-gray-500">평가 {assessmentId}의 편집 페이지입니다.</p>
        <button
          onClick={onBack}
          className="text-sm text-blue-500 hover:text-blue-600"
        >
          목록으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default AssessmentEditPage;
