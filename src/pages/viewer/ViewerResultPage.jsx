import React, { useMemo, useState } from 'react';
import ViewerStartPage from './ViewerStartPage';

// feature: viewer.result
// mappingStatus: Placeholder
// apiCandidates (LMS mapping): GET /stnt/eval/result, GET /tch/eval/result/status
// apiCandidates (LMS mapping): GET /stnt/report/eval/result/summary, GET /stnt/report/eval/result/insite
const ViewerResultPage = ({ assessmentId, onBack }) => {
  const [activeSlide, setActiveSlide] = useState(1);
  const [activeTab, setActiveTab] = useState('summary');
  // NOTE: 학생용은 본인 데이터만 노출되어야 함 (추후 분기 필요)
  const questions = [
    {
      id: 1,
      title: '1번. 1차 방정식 풀이',
      correctRate: 82,
      summary: '정답률 82% · 2번 보기 선택 18명',
      options: [
        { label: '1번', count: 3 },
        { label: '2번', count: 18 },
        { label: '3번', count: 2 },
        { label: '4번', count: 1 }
      ]
    },
    {
      id: 2,
      title: '2번. 그래프 해석',
      correctRate: 64,
      summary: '정답률 64% · 2번 보기 선택 10명',
      options: [
        { label: '1번', count: 6 },
        { label: '2번', count: 10 },
        { label: '3번', count: 5 },
        { label: '4번', count: 3 }
      ]
    },
    {
      id: 3,
      title: '3번. 도형 넓이 계산',
      correctRate: 91,
      summary: '정답률 91% · 2번 보기 선택 22명',
      options: [
        { label: '1번', count: 1 },
        { label: '2번', count: 22 },
        { label: '3번', count: 0 },
        { label: '4번', count: 1 }
      ]
    }
  ];

  const currentQuestion = useMemo(
    () => questions.find((question) => question.id === activeSlide) || questions[0],
    [activeSlide, questions]
  );

  return (
    <div className="relative h-screen">
      <ViewerStartPage
        assessmentId={assessmentId}
        onClose={onBack}
        onSlideChange={setActiveSlide}
        analysisPanelOverride={{
          title: '분석',
          icon: '📊',
          content: (
            <>
              <div className="flex border-b border-gray-200 bg-white">
                {[
                  { id: 'summary', label: '정답률' },
                  { id: 'distribution', label: '분포' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
                      activeTab === tab.id ? 'text-blue-500 border-blue-500' : 'text-gray-500 border-transparent'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              {activeTab === 'summary' && (
                <div className="p-4 space-y-3">
                  <div className="text-xs font-semibold text-gray-500">문제 {currentQuestion?.id}</div>
                  <div className="text-3xl font-bold text-gray-900">{currentQuestion?.correctRate}%</div>
                  <div className="text-xs text-gray-400">요약 {currentQuestion?.summary}</div>
                </div>
              )}
              {activeTab === 'distribution' && (
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-semibold text-gray-700">객관식 선택 분포</div>
                    <div className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-semibold">
                      교사용
                    </div>
                  </div>
                  <div className="space-y-2">
                    {currentQuestion?.options.map((option) => (
                      <div key={option.label} className="flex items-center gap-3">
                        <div className="w-10 text-[10px] font-semibold text-gray-500">{option.label}</div>
                        <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full bg-blue-500"
                            style={{ width: `${(option.count / 24) * 100}%` }}
                          />
                        </div>
                        <div className="text-[10px] text-gray-600 w-10 text-right">{option.count}명</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )
        }}
      />
    </div>
  );
};

export default ViewerResultPage;
