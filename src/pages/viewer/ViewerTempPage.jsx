import React from 'react';

// feature: viewer.temp
// mappingStatus: Placeholder
// apiCandidates (LMS mapping): POST /stnt/eval/save, POST /stnt/eval/time/usage
const ViewerTempPage = ({ assessmentId, onBack }) => {
  return (
    <div className="min-h-screen bg-gray-50 p-6" style={{ fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      <div className="bg-white rounded-3xl p-8 shadow-sm space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">뷰어-임시저장 viewer-temp</h2>
        <p className="text-sm text-gray-500">
          평가 {assessmentId}의 임시저장 내용을 이어서 풉니다. (학생용 플로우 준비 중)
        </p>
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

export default ViewerTempPage;
