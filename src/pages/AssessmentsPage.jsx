import React, { useEffect, useMemo, useState } from 'react';
import AssessmentCard from '../components/assessments/AssessmentCard';
import AssessmentStatusBadge from '../components/assessments/AssessmentStatusBadge';
import AssessmentEditPage from './assessments/AssessmentEditPage';
import ViewerResultPage from './viewer/ViewerResultPage';
import ViewerStartPage from './viewer/ViewerStartPage';
import ViewerStatusPage from './viewer/ViewerStatusPage';
import ViewerTempPage from './viewer/ViewerTempPage';
import { assessmentService } from '../services/assessmentService';
import {
  AssessmentKind,
  AssessmentRole,
  AssessmentSortOption,
  AssessmentStatus
} from '../types/assessmentTypes';
import { getPrimaryCta, getSecondaryCta } from '../utils/assessmentCta';

const ROUTES = {
  LIST: '/assessments',
  HUB: '/assessments/:id',
  PREVIEW: '/assessments/:id/preview',
  RUN: '/assessments/:id/run',
  RESULTS: '/assessments/:id/results',
  REPORT: '/assessments/:id/report',
  EDIT: '/assessments/:id/edit',
  VIEWER_START: '/viewer-start',
  VIEWER_STATUS: '/viewer-status',
  VIEWER_TEMP: '/viewer-temp',
  VIEWER_RESULT: '/viewer-result'
};

const statusBannerCopy = {
  [AssessmentStatus.DRAFT]: '아직 공개되지 않았어요',
  [AssessmentStatus.SCHEDULED]: '아직 시작되지 않았어요',
  [AssessmentStatus.LIVE]: '진행중입니다',
  [AssessmentStatus.ENDED]: '종료되었어요'
};

const formatDateTime = (iso) => {
  const date = new Date(iso);
  return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()} ${String(
    date.getHours()
  ).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

const getTimeUntil = (iso) => {
  const diff = new Date(iso) - new Date();
  if (diff <= 0) return '곧 시작됩니다';
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    return `${days}일 후 시작`;
  }
  return `${hours}시간 ${minutes}분 후 시작`;
};

const isDueSoon = (assessment) => {
  const diff = new Date(assessment.endsAt) - new Date();
  return diff > 0 && diff < 1000 * 60 * 60 * 48;
};

const getActionHubCtas = (assessment, role) => {
  if (!assessment) return { primary: null, secondary: null, notice: null };

  if (assessment.status === AssessmentStatus.DRAFT) {
    return {
      primary: role === AssessmentRole.TEACHER ? { label: '설정 마무리', action: 'settings' } : null,
      secondary: null,
      notice:
        role === AssessmentRole.TEACHER
          ? '학생에게 공개하기 전에 설정을 완료해주세요.'
          : '교사만 접근 가능한 평가입니다.'
    };
  }

  if (assessment.status === AssessmentStatus.SCHEDULED) {
    return {
      primary:
        role === AssessmentRole.TEACHER ? { label: '미리보기', action: 'preview' } : null,
      secondary: null,
      notice:
        role === AssessmentRole.TEACHER
          ? `시작 예정: ${formatDateTime(assessment.startsAt)}`
          : `${getTimeUntil(assessment.startsAt)} · 시작 시간까지 기다려주세요.`
    };
  }

  if (assessment.status === AssessmentStatus.LIVE) {
    return {
      primary: getPrimaryCta(assessment.status, role),
      secondary: null,
      notice: '진행중인 평가입니다. 현재 상태를 바로 확인하세요.'
    };
  }

  if (assessment.status === AssessmentStatus.ENDED) {
    return {
      primary: getPrimaryCta(assessment.status, role),
      secondary: getSecondaryCta(assessment.status, role),
      notice: assessment.needsGrading
        ? '채점이 완료되지 않았습니다. 결과 확정 전 확인이 필요합니다.'
        : '평가가 종료되었습니다.'
    };
  }

  return { primary: null, secondary: null, notice: null };
};

export function AssessmentListPage({
  role,
  onNavigate,
  activeSubMenu,
  statusFilter,
  onGoToSummary,
  assessmentKind,
  pageLabel
}) {
  const [assessments, setAssessments] = useState([]);
  const [filters, setFilters] = useState({
    status: 'all',
    method: 'all',
    period: 'all',
    sort: AssessmentSortOption.LATEST,
    search: ''
  });

  useEffect(() => {
    assessmentService.list({ kind: assessmentKind }).then(setAssessments);
  }, [assessmentKind]);

  const summary = useMemo(() => {
    const liveCount = assessments.filter((item) => item.status === AssessmentStatus.LIVE).length;
    const needsGradingCount = assessments.filter((item) => item.needsGrading).length;
    const dueSoonCount = assessments.filter((item) => isDueSoon(item)).length;
    const draftCount = assessments.filter((item) => item.status === AssessmentStatus.DRAFT).length;
    const scheduledCount = assessments.filter((item) => item.status === AssessmentStatus.SCHEDULED).length;
    const endedCount = assessments.filter((item) => item.status === AssessmentStatus.ENDED).length;
    return { liveCount, needsGradingCount, dueSoonCount, draftCount, scheduledCount, endedCount, total: assessments.length };
  }, [assessments]);

  const filtered = useMemo(() => {
    const now = new Date();
    let result = assessments;

    // statusFilter가 있으면 우선 적용 (LNB 서브메뉴)
    if (statusFilter) {
      result = result.filter((item) => item.status === statusFilter);
    }

    // 검색 필터
    if (filters.search && filters.search.trim()) {
      result = result.filter((item) =>
        item.title.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.status !== 'all') {
      result = result.filter((item) => item.status === filters.status);
    }

    if (filters.method !== 'all') {
      result = result.filter((item) => item.creationMethod === filters.method);
    }

    if (filters.period !== 'all') {
      const days = Number(filters.period);
      result = result.filter((item) => {
        const diff = now - new Date(item.startsAt);
        return diff <= 1000 * 60 * 60 * 24 * days;
      });
    }

    if (filters.sort === AssessmentSortOption.DUE_SOON) {
      result = [...result].sort((a, b) => new Date(a.endsAt) - new Date(b.endsAt));
    }

    if (filters.sort === AssessmentSortOption.LOW_SUBMISSION) {
      result = [...result].sort((a, b) => {
        const aRate = a.submissions.submitted / a.submissions.total;
        const bRate = b.submissions.submitted / b.submissions.total;
        return aRate - bRate;
      });
    }

    if (filters.sort === AssessmentSortOption.LATEST) {
      result = [...result].sort((a, b) => new Date(b.startsAt) - new Date(a.startsAt));
    }

    return result;
  }, [assessments, filters, statusFilter]);

  const handleCardAction = (assessment, action) => {
    if (action === 'delete') {
      const confirmed = window.confirm('정말 삭제하시겠습니까?');
      if (!confirmed) return;
      setAssessments((prev) => prev.filter((item) => item.id !== assessment.id));
      return;
    }

    onNavigate(action, assessment.id);
  };

  // 브레드크럼 표시
  const getBreadcrumb = () => {
    if (!activeSubMenu) return '요약';
    return activeSubMenu;
  };

  // 요약 페이지 여부
  const isSummaryPage = !activeSubMenu;

  return (
    <div className="space-y-6">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <button
          onClick={onGoToSummary}
          className="hover:text-blue-500 transition-colors"
        >
          {pageLabel}
        </button>
        {activeSubMenu && (
          <>
            <span>/</span>
            <span className="text-gray-800 font-medium">{getBreadcrumb()}</span>
          </>
        )}
      </nav>

      {isSummaryPage && (
        <>
          {/* 요약 - Top 3 카드 */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">⚠️</span>
              <span className="font-bold text-gray-800">요약</span>
              <span className="text-xs text-gray-400 ml-2">주의가 필요한 평가</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 채점필요 top3 */}
              <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-8 h-8 bg-amber-100 rounded-xl flex items-center justify-center text-lg">⚠️</span>
                  <span className="font-semibold text-gray-700 text-sm">채점 필요</span>
                </div>
                <div className="space-y-2">
                  {assessments
                    .filter((item) => item.needsGrading)
                    .sort((a, b) => new Date(a.endsAt) - new Date(b.endsAt))
                    .slice(0, 3)
                    .map((assessment, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-amber-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700 truncate flex-1 mr-2">{assessment.title}</span>
                        <button
                          onClick={() => onNavigate('grade', assessment.id)}
                          className="text-xs text-amber-600 hover:text-amber-700 font-medium whitespace-nowrap"
                        >
                          채점하기 →
                        </button>
                      </div>
                    ))}
                  {assessments.filter((item) => item.needsGrading).length === 0 && (
                    <p className="text-xs text-gray-400 text-center py-4">채점 필요한 평가 없음</p>
                  )}
                </div>
              </div>

              {/* 마감임박 top3 */}
              <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-8 h-8 bg-rose-100 rounded-xl flex items-center justify-center text-lg">⏰</span>
                  <span className="font-semibold text-gray-700 text-sm">마감 임박</span>
                </div>
                <div className="space-y-2">
                  {assessments
                    .filter((item) => isDueSoon(item))
                    .sort((a, b) => new Date(a.endsAt) - new Date(b.endsAt))
                    .slice(0, 3)
                    .map((assessment, idx) => {
                      const hoursLeft = Math.floor((new Date(assessment.endsAt) - new Date()) / (1000 * 60 * 60));
                      return (
                        <div key={idx} className="flex items-center justify-between p-2 bg-rose-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-700 truncate flex-1 mr-2">{assessment.title}</span>
                          <button
                            onClick={() => onNavigate('preview', assessment.id)}
                            className="text-xs text-rose-600 hover:text-rose-700 font-medium whitespace-nowrap"
                          >
                            {hoursLeft}시간 후 →
                          </button>
                        </div>
                      );
                    })}
                  {assessments.filter((item) => isDueSoon(item)).length === 0 && (
                    <p className="text-xs text-gray-400 text-center py-4">마감 임박 평가 없음</p>
                  )}
                </div>
              </div>

              {/* 진행중 top3 (제출율 낮은 순) */}
              <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center text-lg">📊</span>
                  <span className="font-semibold text-gray-700 text-sm">진행중 (제출율 낮음)</span>
                </div>
                <div className="space-y-2">
                  {assessments
                    .filter((item) => item.status === AssessmentStatus.LIVE)
                    .sort((a, b) => {
                      const aRate = a.submissions.submitted / a.submissions.total;
                      const bRate = b.submissions.submitted / b.submissions.total;
                      return aRate - bRate;
                    })
                    .slice(0, 3)
                    .map((assessment, idx) => {
                      const rate = Math.round((assessment.submissions.submitted / assessment.submissions.total) * 100);
                      return (
                        <div key={idx} className="flex items-center justify-between p-2 bg-emerald-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-700 truncate flex-1 mr-2">{assessment.title}</span>
                          <button
                            onClick={() => onNavigate('status', assessment.id)}
                            className="text-xs text-emerald-600 hover:text-emerald-700 font-medium whitespace-nowrap"
                          >
                            {rate}% →
                          </button>
                        </div>
                      );
                    })}
                  {assessments.filter((item) => item.status === AssessmentStatus.LIVE).length === 0 && (
                    <p className="text-xs text-gray-400 text-center py-4">진행중인 평가 없음</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 전체 요약 */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4">전체</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <button
                onClick={() => setFilters({ ...filters, status: 'all' })}
                className="bg-gray-50 rounded-2xl p-4 text-center hover:bg-gray-100 transition-colors"
              >
                <p className="text-xs text-gray-500 mb-1">전체</p>
                <p className="text-2xl font-bold text-gray-800">{summary.total}</p>
              </button>
              <button
                onClick={() => setFilters({ ...filters, status: AssessmentStatus.DRAFT })}
                className="bg-blue-50 rounded-2xl p-4 text-center hover:bg-blue-100 transition-colors"
              >
                <p className="text-xs text-blue-600 mb-1">편집중</p>
                <p className="text-2xl font-bold text-blue-600">{summary.draftCount}</p>
              </button>
              <button
                onClick={() => setFilters({ ...filters, status: AssessmentStatus.SCHEDULED })}
                className="bg-purple-50 rounded-2xl p-4 text-center hover:bg-purple-100 transition-colors"
              >
                <p className="text-xs text-purple-600 mb-1">할 일</p>
                <p className="text-2xl font-bold text-purple-600">{summary.scheduledCount}</p>
              </button>
              <button
                onClick={() => setFilters({ ...filters, status: AssessmentStatus.LIVE })}
                className="bg-emerald-50 rounded-2xl p-4 text-center hover:bg-emerald-100 transition-colors"
              >
                <p className="text-xs text-emerald-600 mb-1">하는 중</p>
                <p className="text-2xl font-bold text-emerald-600">{summary.liveCount}</p>
              </button>
              <button
                onClick={() => setFilters({ ...filters, status: AssessmentStatus.ENDED })}
                className="bg-gray-50 rounded-2xl p-4 text-center hover:bg-gray-100 transition-colors"
              >
                <p className="text-xs text-gray-600 mb-1">끝</p>
                <p className="text-2xl font-bold text-gray-800">{summary.endedCount}</p>
              </button>
            </div>
          </div>
        </>
      )}

      {/* 검색바 + 필터 (요약 페이지에서도 항상 표시) */}
      <div className="bg-white rounded-3xl p-3 flex flex-wrap gap-2 items-center shadow-sm">
        <input
          type="text"
          value={filters.search || ''}
          onChange={(event) => setFilters({ ...filters, search: event.target.value })}
          placeholder="🔍 평가 검색"
          className="px-3 py-2 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 min-w-48 border border-gray-200"
        />
        <div className="flex flex-wrap gap-2 items-center">
          <select
            value={filters.status}
            onChange={(event) => setFilters({ ...filters, status: event.target.value })}
            className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">전체</option>
            <option value="DRAFT">편집중</option>
            <option value="SCHEDULED">할 일</option>
            <option value="LIVE">하는 중</option>
            <option value="ENDED">끝</option>
          </select>
          <select
            value={filters.method}
            onChange={(event) => setFilters({ ...filters, method: event.target.value })}
            className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">방식</option>
            <option value="DIRECT">직접</option>
            <option value="AI">AI</option>
            <option value="PRESCRIPTION">처방</option>
          </select>
          <select
            value={filters.sort}
            onChange={(event) => setFilters({ ...filters, sort: event.target.value })}
            className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="LATEST">최신순</option>
            <option value="DUE_SOON">마감임박</option>
            <option value="LOW_SUBMISSION">제출률 낮은 순</option>
          </select>
        </div>
      </div>

      {/* 요약 페이지에서는 전체 카드 표시, 검색/필터 적용 시에도 결과 표시 */}
      {(isSummaryPage || filters.search || filters.status !== 'all' || filters.method !== 'all') && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((assessment) => (
          <AssessmentCard
            key={assessment.id}
            assessment={assessment}
            kind={assessmentKind}
            onAction={handleCardAction}
          />
          ))}
        </div>
      )}
    </div>
  );
}

export function AssessmentActionHubPage({ assessmentId, role, onNavigate }) {
  const [assessment, setAssessment] = useState(null);

  useEffect(() => {
    if (!assessmentId) return;
    assessmentService.get(assessmentId).then(setAssessment);
  }, [assessmentId]);

  const actionConfig = getActionHubCtas(assessment, role);
  const notSubmitted = assessment
    ? assessment.submissions.total - assessment.submissions.submitted
    : 0;

  if (!assessment) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-sm text-center text-gray-400">
        평가 정보를 불러오는 중입니다...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => onNavigate(ROUTES.LIST)}
        className="text-sm text-gray-500 hover:text-blue-500"
      >
        ← 평가 목록
      </button>
      <div className="bg-white rounded-3xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="mb-2">
              <AssessmentStatusBadge status={assessment.status} subStatus={assessment.subStatus} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">{assessment.title}</h2>
            <p className="text-sm text-gray-500">
              {formatDateTime(assessment.startsAt)} ~ {formatDateTime(assessment.endsAt)} · 제한 {assessment.timeLimitMinutes}분
            </p>
          </div>
          <div className="px-4 py-2 bg-blue-50 text-blue-600 text-sm font-semibold rounded-full">
            {statusBannerCopy[assessment.status]}
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
          <h3 className="text-sm font-semibold text-gray-700">핵심 CTA</h3>
          <div className="flex flex-wrap gap-3 items-center">
            {actionConfig.primary ? (
              <button
                onClick={() => onNavigate(actionConfig.primary.action, assessment.id)}
                className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold"
              >
                {actionConfig.primary.label}
              </button>
            ) : (
              <button
                className="px-4 py-2 rounded-xl bg-gray-200 text-gray-500 text-sm font-semibold cursor-not-allowed"
              >
                사용 불가
              </button>
            )}
            {actionConfig.secondary && (
              <button
                onClick={() => onNavigate(actionConfig.secondary.action, assessment.id)}
                className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50"
              >
                {actionConfig.secondary.label}
              </button>
            )}
          </div>
          {actionConfig.notice && (
            <p className="text-xs text-gray-500">{actionConfig.notice}</p>
          )}
        </div>

        {role === AssessmentRole.TEACHER && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-white border border-gray-200 rounded-2xl p-4">
              <p className="text-xs text-gray-400">제출</p>
              <p className="text-lg font-semibold text-gray-800">
                {assessment.submissions.submitted}명
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-4">
              <p className="text-xs text-gray-400">미응시</p>
              <p className="text-lg font-semibold text-gray-800">{notSubmitted}명</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-4">
              <p className="text-xs text-gray-400">채점 필요</p>
              <p className="text-lg font-semibold text-gray-800">
                {assessment.needsGrading ? '있음' : '없음'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function AssessmentPreviewPage({ assessmentId, onNavigate }) {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">미리보기</h2>
      <p className="text-sm text-gray-500">평가 {assessmentId}의 문항 구성을 확인합니다.</p>
      <button
        onClick={() => onNavigate(ROUTES.HUB, assessmentId)}
        className="text-sm text-blue-500 hover:text-blue-600"
      >
        액션 허브로 돌아가기
      </button>
    </div>
  );
}

export function AssessmentRunPage({ assessmentId, onNavigate }) {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">응시/시작</h2>
      <p className="text-sm text-gray-500">평가 {assessmentId}을(를) 응시하는 화면입니다.</p>
      <button
        onClick={() => onNavigate(ROUTES.HUB, assessmentId)}
        className="text-sm text-blue-500 hover:text-blue-600"
      >
        액션 허브로 돌아가기
      </button>
    </div>
  );
}

export function AssessmentResultsPage({ assessmentId, onNavigate }) {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">결과</h2>
      <p className="text-sm text-gray-500">평가 {assessmentId}의 결과 요약을 보여줍니다.</p>
      <button
        onClick={() => onNavigate(ROUTES.HUB, assessmentId)}
        className="text-sm text-blue-500 hover:text-blue-600"
      >
        액션 허브로 돌아가기
      </button>
    </div>
  );
}

export function AssessmentReportPage({ assessmentId, onNavigate }) {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">리포트</h2>
      <p className="text-sm text-gray-500">평가 {assessmentId}의 상세 리포트입니다.</p>
      <button
        onClick={() => onNavigate(ROUTES.HUB, assessmentId)}
        className="text-sm text-blue-500 hover:text-blue-600"
      >
        액션 허브로 돌아가기
      </button>
    </div>
  );
}

export default function AssessmentsPage({ activeSubMenu, onBackToSummary, onViewerModeChange }) {
  const [route, setRoute] = useState(ROUTES.LIST);
  const [activeId, setActiveId] = useState('a-101');
  const [role, setRole] = useState(AssessmentRole.TEACHER);
  const [autoStartClass, setAutoStartClass] = useState(false);
  const isViewerRoute = [
    ROUTES.VIEWER_START,
    ROUTES.VIEWER_RESULT,
    ROUTES.VIEWER_STATUS,
    ROUTES.VIEWER_TEMP
  ].includes(route);

  const handleNavigate = (nextRoute, id, nextRole) => {
    if (nextRole) {
      setRole(nextRole);
      return;
    }

    const resolvedId = id || activeId;
    setActiveId(resolvedId);

    switch (nextRoute) {
      case 'open':
        setAutoStartClass(false);
        setRoute(ROUTES.VIEWER_START);
        break;
      case 'preview':
        setRoute(ROUTES.PREVIEW);
        break;
      case 'run':
        setRoute(ROUTES.RUN);
        break;
      case 'start':
        setAutoStartClass(true);
        setRoute(ROUTES.VIEWER_START);
        break;
      case 'resume':
        setRoute(ROUTES.VIEWER_START);
        break;
      case 'results':
        setRoute(ROUTES.VIEWER_RESULT);
        break;
      case 'status':
        setRoute(ROUTES.VIEWER_STATUS);
        break;
      case 'grade':
        setRoute(ROUTES.REPORT);
        break;
      case 'report':
        setRoute(ROUTES.REPORT);
        break;
      case 'edit':
      case 'settings':
        setRoute(ROUTES.EDIT);
        break;
      case ROUTES.LIST:
        setRoute(ROUTES.LIST);
        break;
      case ROUTES.HUB:
        setRoute(ROUTES.HUB);
        break;
      default:
        setRoute(ROUTES.HUB);
    }
  };

  useEffect(() => {
    if (!onViewerModeChange) return;
    onViewerModeChange(isViewerRoute);
  }, [onViewerModeChange, route]);

  // activeSubMenu에 따라 상태 필터 결정
  const getStatusFilter = () => {
    if (!activeSubMenu) return null;
    if (activeSubMenu === '할 일') return AssessmentStatus.SCHEDULED;
    if (activeSubMenu === '하는 중') return AssessmentStatus.LIVE;
    if (activeSubMenu === '끝') return AssessmentStatus.ENDED;
    return null;
  };

  const handleGoToSummary = () => {
    if (onBackToSummary) {
      onBackToSummary();
    }
  };

  return (
    <div
      className={`${isViewerRoute ? 'p-0 bg-gray-100 h-screen overflow-hidden' : 'p-6 bg-indigo-50 min-h-screen'}`}
      style={{ fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif" }}
    >
      {route === ROUTES.LIST && (
        <AssessmentListPage
          role={role}
          onNavigate={handleNavigate}
          activeSubMenu={activeSubMenu}
          statusFilter={getStatusFilter()}
          onGoToSummary={handleGoToSummary}
          assessmentKind={AssessmentKind.EXAM}
          pageLabel="시험"
        />
      )}
      {route === ROUTES.HUB && (
        <AssessmentActionHubPage assessmentId={activeId} role={role} onNavigate={handleNavigate} />
      )}
      {route === ROUTES.EDIT && (
        <AssessmentEditPage
          assessmentId={activeId}
          onBack={() => setRoute(ROUTES.LIST)}
        />
      )}
      {route === ROUTES.PREVIEW && (
        <AssessmentPreviewPage assessmentId={activeId} onNavigate={handleNavigate} />
      )}
      {route === ROUTES.RUN && (
        <AssessmentRunPage assessmentId={activeId} onNavigate={handleNavigate} />
      )}
      {route === ROUTES.VIEWER_START && (
        <ViewerStartPage
          onClose={() => setRoute(ROUTES.LIST)}
          assessmentId={activeId}
          autoStart={autoStartClass}
        />
      )}
      {route === ROUTES.VIEWER_STATUS && (
        <ViewerStatusPage assessmentId={activeId} onBack={() => setRoute(ROUTES.LIST)} />
      )}
      {route === ROUTES.VIEWER_TEMP && (
        <ViewerTempPage assessmentId={activeId} onBack={() => setRoute(ROUTES.LIST)} />
      )}
      {route === ROUTES.VIEWER_RESULT && (
        <ViewerResultPage assessmentId={activeId} onBack={() => setRoute(ROUTES.LIST)} />
      )}
      {route === ROUTES.RESULTS && (
        <AssessmentResultsPage assessmentId={activeId} onNavigate={handleNavigate} />
      )}
      {route === ROUTES.REPORT && (
        <AssessmentReportPage assessmentId={activeId} onNavigate={handleNavigate} />
      )}
    </div>
  );
}
