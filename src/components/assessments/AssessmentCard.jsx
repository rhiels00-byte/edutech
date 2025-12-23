import React from 'react';
import {
  AssessmentCreationMethod,
  AssessmentKind,
  AssessmentStatus
} from '../../types/assessmentTypes';
import AssessmentStatusBadge from './AssessmentStatusBadge';

const CREATION_METHOD_LABELS = {
  [AssessmentCreationMethod.IMPORT]: '불러오기',
  [AssessmentCreationMethod.DIRECT]: '직접',
  [AssessmentCreationMethod.AI]: 'AI',
  [AssessmentCreationMethod.PRESCRIPTION]: '처방'
};

export default function AssessmentCard({ assessment, kind, onAction }) {
  const submissionRate = assessment.submissions.total > 0
    ? Math.round((assessment.submissions.submitted / assessment.submissions.total) * 100)
    : 0;

  const resolvedKind = kind || AssessmentKind.EXAM;
  const isHomework = resolvedKind === AssessmentKind.HOMEWORK;

  // 🎨 Nano Banana 디자인 시스템: 테마 설정
  const theme = isHomework
    ? {
        color: 'emerald',
        borderColor: 'border-emerald-500',
        bgColor: 'bg-emerald-50',
        textColor: 'text-emerald-700',
        hoverBorder: 'hover:border-emerald-300',
        icon: '📒',
        watermark: '📒'
      }
    : {
        color: 'indigo',
        borderColor: 'border-indigo-500',
        bgColor: 'bg-indigo-50',
        textColor: 'text-indigo-700',
        hoverBorder: 'hover:border-indigo-300',
        icon: '📝',
        watermark: '📝'
      };

  const btnBaseClass = `flex-1 px-3 py-2.5 rounded-lg bg-white border border-gray-200 text-sm font-bold text-gray-600 transition-all hover:bg-${theme.color}-50 hover:text-${theme.color}-600 hover:border-${theme.color}-200`;
  const primaryBtnClass = btnBaseClass;
  const secondaryBtnClass = btnBaseClass;

  const formatDate = (iso) => {
    if (!iso) return '-';
    const date = new Date(iso);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  const getDateText = () => {
    if (assessment.status === AssessmentStatus.DRAFT) {
      return `최근 저장 일자 ${formatDate(assessment.lastSavedAt || assessment.startsAt)}`;
    }

    if (assessment.status === AssessmentStatus.SCHEDULED) {
      if (resolvedKind === AssessmentKind.HOMEWORK) {
        return `시작 예정 일자 ${formatDate(assessment.startsAt)} ~ 종료 예정 일자 ${formatDate(assessment.endsAt)}`;
      }
      return '시작 전';
    }

    if (assessment.status === AssessmentStatus.LIVE) {
      return `시작 일자 ${formatDate(assessment.startsAt)}`;
    }

    if (assessment.status === AssessmentStatus.ENDED) {
      return `${formatDate(assessment.startsAt)} ~ ${formatDate(assessment.endsAt)}`;
    }

    return '';
  };

  const getButtons = () => {
    if (assessment.status === AssessmentStatus.DRAFT) {
      return (
        <>
          <button
            onClick={handleButtonClick('edit')}
            className={primaryBtnClass}
          >
            편집하기
          </button>
          <button
            onClick={handleButtonClick('delete')}
            className={secondaryBtnClass}
          >
            삭제하기
          </button>
        </>
      );
    }

    if (assessment.status === AssessmentStatus.SCHEDULED) {
      return (
        <>
          <button
            onClick={handleButtonClick('start')}
            className={primaryBtnClass}
          >
            시작하기
          </button>
          <button
            onClick={handleButtonClick('edit')}
            className={secondaryBtnClass}
          >
            편집하기
          </button>
        </>
      );
    }

    if (assessment.status === AssessmentStatus.LIVE) {
      return (
        <>
          <button
            onClick={handleButtonClick('status')}
            className={primaryBtnClass}
          >
            현황보기
          </button>
          <button
            onClick={handleButtonClick('resume')}
            className={secondaryBtnClass}
          >
            이어하기
          </button>
        </>
      );
    }

    if (assessment.status === AssessmentStatus.ENDED) {
      return (
        <>
          <button
            onClick={handleButtonClick('grade')}
            className={primaryBtnClass}
          >
            채점하기
          </button>
          <button
            onClick={handleButtonClick('results')}
            className={secondaryBtnClass}
          >
            결과보기
          </button>
        </>
      );
    }

    return null;
  };

  const getSubmissionLabel = () => {
    if (assessment.status === AssessmentStatus.LIVE) return '🔥 실시간 제출 현황';
    if (assessment.status === AssessmentStatus.ENDED) return '🏁 최종 제출 완료';
    return '📊 제출 현황';
  };

  const handleButtonClick = (action) => (event) => {
    event.stopPropagation();
    onAction(assessment, action);
  };

  const handleCardClick = (event) => {
    const target = event.target;
    if (target && target.closest && target.closest('button')) {
      return;
    }
    onAction(assessment, 'open');
  };

  return (
    <div
      onClick={handleCardClick}
      className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-all h-full group cursor-pointer"
    >
      {/* 정보 영역 */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${
                isHomework ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-indigo-50 text-indigo-600 border-indigo-100'
              }`}>
                {isHomework ? '숙제' : '시험'}
              </span>
              <span className="text-[10px] text-gray-500 border border-gray-100 bg-gray-50 px-1.5 py-0.5 rounded">
                {assessment.creationMethod === AssessmentCreationMethod.AI ? '✨ ' : ''}{CREATION_METHOD_LABELS[assessment.creationMethod]}
              </span>
            </div>
            <AssessmentStatusBadge status={assessment.status} subStatus={assessment.subStatus} />
          </div>
          <h3 className="text-base font-bold text-gray-900 line-clamp-2 leading-snug mb-1">
            {assessment.title}
          </h3>
          <div className="text-xs text-gray-500 line-clamp-1">
            📅 {getDateText()}
          </div>
          <div className="text-xs text-gray-500 line-clamp-1">
            ⏱️ {isHomework ? '숙제' : '시험'} 응시 시간 {assessment.timeLimitMinutes}분
          </div>
        </div>
        
        {/* 제출 현황 */}
        <div className="mt-auto">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className={`font-bold ${
              assessment.status === AssessmentStatus.LIVE
                ? (isHomework ? 'text-emerald-600' : 'text-indigo-600')
                : 'text-gray-500'
            }`}>
              {getSubmissionLabel()}
            </span>
            <div className="flex items-center gap-1">
              <span className="font-bold text-gray-900">{assessment.submissions.submitted}</span>
              <span className="text-gray-400">/</span>
              <span className="text-gray-500">{assessment.submissions.total}</span>
              <span className={`font-bold ml-1 ${
                assessment.status === AssessmentStatus.LIVE
                  ? (isHomework ? 'text-emerald-600' : 'text-indigo-600')
                  : 'text-gray-500'
              }`}>({submissionRate}%)</span>
            </div>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                assessment.status === AssessmentStatus.LIVE
                  ? (isHomework ? 'bg-emerald-500' : 'bg-indigo-500')
                  : 'bg-gray-400'
              }`}
              style={{ width: `${submissionRate}%` }}
            />
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex items-center gap-2 pt-3 border-t border-gray-50">
          {getButtons()}
        </div>
      </div>
    </div>
  );
}
