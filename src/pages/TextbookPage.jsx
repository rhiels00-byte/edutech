import React, { useState, useRef } from 'react';
import { ReactSketchCanvas } from 'react-sketch-canvas';
import { textbookSlides, textbookStudents } from '../data/studentData';

const TextbookPage = ({ onClose }) => {
  // 상태 관리
  const [focusMode, setFocusMode] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('textbook'); // textbook, ai, ai2, test, workbook, game
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hideAnswer, setHideAnswer] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [viewMode, setViewMode] = useState('web'); // web, ebook
  const [isClassStarted, setIsClassStarted] = useState(false);
  const [showCurriculum, setShowCurriculum] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);

  // 사이드 패널 상태
  const [activePanel, setActivePanel] = useState(null); // submit, gather, activity, bookmark, best, question
  const [showActivityModal, setShowActivityModal] = useState(false);

  const collapsedSideWidth = 'w-14';

  // 토스트 알림 상태
  const [toast, setToast] = useState(null);

  // 제출현황 관련 상태
  const [selectedStudent, setSelectedStudent] = useState(0);
  const [showStudentAnswer, setShowStudentAnswer] = useState(false);
  const [checkedStudents, setCheckedStudents] = useState(new Set());
  const [bestStudent, setBestStudent] = useState(-1);
  const [showFeedback, setShowFeedback] = useState(false);
  const [submitFilter, setSubmitFilter] = useState('all'); // all, submitted, not-submitted

  // 수업 도구 그룹 상태
  const [openToolGroups, setOpenToolGroups] = useState({ operation: false, activity: false, subject: false, support: false });

  // 판서 도구 상태
  const [drawColor, setDrawColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [drawTool, setDrawTool] = useState('pen'); // pen, highlighter, eraser
  const canvasRef = useRef(null);

  // 함께 보기 상태
  const [isTogetherMode, setIsTogetherMode] = useState(false);
  const [isTogetherPanelCollapsed, setIsTogetherPanelCollapsed] = useState(false);
  const [studentPermissions, setStudentPermissions] = useState(
    textbookStudents.map(s => ({ ...s, canDraw: false }))
  );

  // 토스트 표시 함수
  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  };

  // 키보드 단축키
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeAllPanels();
        setShowCurriculum(false);
        setShowActivityModal(false);
      }
      if (e.key === 'ArrowLeft' && !showCurriculum && !activePanel) {
        setCurrentSlide(s => Math.max(1, s - 1));
      }
      if (e.key === 'ArrowRight' && !showCurriculum && !activePanel) {
        setCurrentSlide(s => Math.min(textbookSlides.length, s + 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showCurriculum, activePanel]);

  // 수업 집중 모드 토글 (패널 자동 접힘/펼침)
  const handleFocusModeToggle = () => {
    const newFocusMode = !focusMode;
    setFocusMode(newFocusMode);
    setLeftCollapsed(newFocusMode);
    setRightCollapsed(newFocusMode);
    showToast(newFocusMode ? '수업 집중 모드 ON' : '수업 집중 모드 OFF');
  };

  // 학생 체크박스 토글
  const toggleStudentCheck = (idx) => {
    const newChecked = new Set(checkedStudents);
    if (newChecked.has(idx)) newChecked.delete(idx);
    else newChecked.add(idx);
    setCheckedStudents(newChecked);
  };

  // 필터링된 학생 목록
  const getFilteredStudents = () => {
    if (submitFilter === 'submitted') return textbookStudents.filter(s => s.submitted);
    if (submitFilter === 'not-submitted') return textbookStudents.filter(s => !s.submitted);
    return textbookStudents;
  };

  // 탭 데이터
  const tabs = [
    { id: 'textbook', label: '교과서' },
    { id: 'ai', label: 'AI 맞춤학습' },
    { id: 'test', label: '대단원 학습 평가' },
    { id: 'workbook', label: '수학 익힘책' },
  ];

  // 현재 탭 인덱스
  const currentTabIndex = tabs.findIndex(t => t.id === activeTab);

  // 탭 이동 함수
  const handlePrevTab = () => {
    if (currentTabIndex > 0) {
      setActiveTab(tabs[currentTabIndex - 1].id);
      setCurrentSlide(1);
    }
  };

  const handleNextTab = () => {
    if (currentTabIndex < tabs.length - 1) {
      setActiveTab(tabs[currentTabIndex + 1].id);
      setCurrentSlide(1);
    }
  };

  // 커리큘럼 데이터 (트리 구조)
  const curriculum = [
    { id: 'intro', title: '수학 왜 배울까?', type: 'special', icon: '◈' },
    {
      id: 'ch1', title: 'I. 수와 연산', type: 'chapter',
      children: [
        { id: 'ch1-1', title: '1. 소인수분해', type: 'section', children: [
          { id: 'ch1-1-1', title: '01. 소수와 합성수', type: 'lesson' },
          { id: 'ch1-1-2', title: '02. 거듭제곱', type: 'lesson' },
        ]},
      ]
    },
    { id: 'ch2', title: 'II. 문자와 식', type: 'chapter', children: [] },
    { id: 'ch3', title: 'III. 좌표평면과 그래프', type: 'chapter', children: [] },
    { id: 'ch4', title: 'IV. 기본 도형', type: 'chapter', children: [] },
    { id: 'ch5', title: 'V. 평면도형과 입체도형', type: 'chapter', children: [] },
    {
      id: 'ch6', title: 'VI. 통계', type: 'chapter', isActive: true,
      children: [
        {
          id: 'ch6-1', title: '1. 자료의 정리와 해석', type: 'section', isActive: true,
          children: [
            { id: 'ch6-1-0', title: '진단평가', type: 'special', icon: '◐' },
            { id: 'ch6-1-1', title: '01. 대푯값', type: 'lesson', isActive: true },
            { id: 'ch6-1-2', title: '02. 줄기와 잎 그림, 도수분포표', type: 'lesson' },
            { id: 'ch6-1-3', title: '03. 히스토그램과 도수분포다각형', type: 'lesson' },
            { id: 'ch6-1-4', title: '04. 상대도수와 그 그래프', type: 'lesson' },
            { id: 'ch6-1-5', title: '중단원 학습 점검', type: 'special', icon: '·' },
            { id: 'ch6-1-6', title: '수학 익힘책', type: 'special', icon: '·' },
            { id: 'ch6-1-7', title: '창의 수행 과제', type: 'special', icon: '·' },
          ]
        },
        { id: 'ch6-2', title: '2. 통계적 문제해결', type: 'section', children: [] },
        { id: 'ch6-3', title: '대단원 학습 평가', type: 'special', icon: '·' },
        { id: 'ch6-4', title: '궁금한 수학 이야기', type: 'special', icon: '·' },
      ]
    },
    { id: 'extra1', title: '수학 꼭 필요해!', type: 'special', icon: '◈' },
    { id: 'extra2', title: '부록', type: 'special', icon: '◈' },
  ];

  // 트리 확장 상태
  const [expandedNodes, setExpandedNodes] = useState(['ch6', 'ch6-1']);

  const toggleNode = (nodeId) => {
    if (expandedNodes.includes(nodeId)) {
      setExpandedNodes(expandedNodes.filter(id => id !== nodeId));
    } else {
      setExpandedNodes([...expandedNodes, nodeId]);
    }
  };

  // 제출 현황
  const submittedCount = textbookStudents.filter(s => s.submitted).length;
  const totalCount = textbookStudents.length;

  const toggleToolGroup = (groupId) => {
    setOpenToolGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const openPanel = (panelId) => {
    setActivePanel(activePanel === panelId ? null : panelId);
  };

  const closeAllPanels = () => {
    setActivePanel(null);
  };

  // 전체화면 토글
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  // 확대/축소
  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 10, 50));
  const handleZoomReset = () => setZoomLevel(100);

  // 슬라이드 배경색
  const getSlideBackground = (type) => {
    switch(type) {
      case 'concept': return 'from-amber-100 to-amber-200';
      case 'problem': return 'from-blue-100 to-blue-200';
      case 'example': return 'from-green-100 to-green-200';
      case 'review': return 'from-purple-100 to-purple-200';
      case 'summary': return 'from-gray-100 to-gray-200';
      default: return 'from-gray-100 to-gray-200';
    }
  };

  // 커리큘럼 트리 렌더링
  const renderCurriculumTree = (nodes, depth = 0) => {
    return nodes.map((node) => {
      const hasChildren = node.children && node.children.length > 0;
      const isExpanded = expandedNodes.includes(node.id);
      const paddingLeft = depth * 16 + 16;

      return (
        <div key={node.id}>
          <div
            onClick={() => hasChildren ? toggleNode(node.id) : setShowCurriculum(false)}
            className={`flex items-center gap-2 py-3 px-4 cursor-pointer transition-all hover:bg-blue-50 ${
              node.isActive ? 'bg-blue-50 border-l-4 border-blue-500' : ''
            }`}
            style={{ paddingLeft }}
          >
            {node.icon && <span className="text-blue-500">{node.icon}</span>}
            {hasChildren && (
              <span className={`text-gray-400 text-xs transition-transform ${isExpanded ? 'rotate-90' : ''}`}>▶</span>
            )}
            {node.isActive && !node.icon && <span className="text-blue-500">✓</span>}
            <span className={`text-sm ${node.isActive ? 'font-semibold text-blue-600' : 'text-gray-700'}`}>
              {node.title}
            </span>
          </div>
          {hasChildren && isExpanded && (
            <div>{renderCurriculumTree(node.children, depth + 1)}</div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100 overflow-hidden" style={{ fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      {/* 목차 사이드 패널 (왼쪽에서 슬라이드) */}
      {showCurriculum && (
        <>
          <div className="fixed inset-0 bg-black/30 z-50" onClick={() => setShowCurriculum(false)}></div>
          <div className="fixed top-0 left-0 w-80 h-full bg-white shadow-2xl z-50 flex flex-col">
            {/* 헤더 */}
            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📚</span>
                <span className="font-bold text-base">목차</span>
              </div>
              <button
                onClick={() => setShowCurriculum(false)}
                className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
              >
                ✕
              </button>
            </div>
            {/* 트리 목록 */}
            <div className="flex-1 overflow-y-auto">
              {renderCurriculumTree(curriculum)}
            </div>
          </div>
        </>
      )}

      {/* 상단바 */}
      <div className={`h-11 flex items-center justify-between px-3 shrink-0 transition-all border-b ${
        focusMode
          ? 'bg-slate-800/95 backdrop-blur-md border-transparent shadow-sm'
          : 'bg-white border-gray-200'
      }`}>
        {/* 왼쪽 */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onClose}
            className={`w-8 h-8 rounded-lg flex items-center justify-center text-base transition-all ${
              focusMode
                ? 'bg-white/10 text-white hover:bg-white/15'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            🏠
          </button>
          <button
            onClick={() => setShowCurriculum(true)}
            className={`w-8 h-8 rounded-lg flex items-center justify-center text-base transition-all ${
              focusMode
                ? 'bg-white/10 text-white hover:bg-white/15'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            ☰
          </button>
          {!focusMode && (
            <div className="flex items-center gap-1 text-xs text-gray-500 ml-1.5">
              <span className="font-medium text-gray-700">중등 수학1</span>
              <span className="text-gray-300">›</span>
              <span>VI. 통계</span>
              <span className="text-gray-300">›</span>
              <span className="text-blue-500 font-medium">대푯값</span>
            </div>
          )}
        </div>

        {/* 중앙 - 탭 (포커스 모드에서 숨김) */}
        {!focusMode && (
          <div className="flex items-center gap-0.5">
            <button
              onClick={handlePrevTab}
              disabled={currentTabIndex === 0}
              className={`w-6 h-6 rounded flex items-center justify-center text-gray-400 text-sm hover:bg-gray-100 ${currentTabIndex === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}
            >
              ‹
            </button>
            <div className="flex gap-0.5 px-1 py-0.5 bg-gray-100 rounded-lg">
              {/* 현재 탭 기준으로 앞뒤로 총 3개만 표시 */}
              {tabs.slice(
                Math.max(0, Math.min(currentTabIndex - 1, tabs.length - 3)),
                Math.max(3, Math.min(currentTabIndex + 2, tabs.length))
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setCurrentSlide(1); }}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-white text-blue-500 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <button
              onClick={handleNextTab}
              disabled={currentTabIndex === tabs.length - 1}
              className={`w-6 h-6 rounded flex items-center justify-center text-gray-400 text-sm hover:bg-gray-100 ${currentTabIndex === tabs.length - 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
            >
              ›
            </button>
          </div>
        )}

        {/* 오른쪽 */}
        <div className="flex items-center gap-2">
          {!focusMode && (
            <>
              {/* 웹/이북 토글 (이미지 스타일) */}
              <div className="flex bg-gray-100 rounded-full p-0.5 gap-0.5">
                <button
                  onClick={() => setViewMode('web')}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${viewMode === 'web' ? 'bg-blue-500 text-white' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  웹
                </button>
                <button
                  onClick={() => setViewMode('ebook')}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${viewMode === 'ebook' ? 'bg-blue-500 text-white' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  ebook
                </button>
              </div>
              {/* 수업 집중 토글 */}
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <span>수업 집중</span>
                <button
                  onClick={handleFocusModeToggle}
                  className="w-9 h-5 rounded-full bg-gray-300 relative cursor-pointer transition-colors"
                >
                  <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 left-0.5 shadow transition-transform"></div>
                </button>
              </div>
              {/* 수업 상태 표시 */}
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <span className={`w-1.5 h-1.5 rounded-full ${isClassStarted ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                <span>{isClassStarted ? '온라인' : '오프라인'}</span>
              </div>
              {/* 수업 시작/종료 버튼 */}
              <button
                onClick={() => {
                  setIsClassStarted(!isClassStarted);
                  showToast(isClassStarted ? '수업이 종료되었습니다.' : '수업이 시작되었습니다!');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isClassStarted
                    ? 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {isClassStarted ? '수업 종료' : '수업 시작'}
              </button>
            </>
          )}
          {focusMode && (
            <>
              {/* 수업 집중 토글 (ON 상태) */}
              <div className="flex items-center gap-1.5 text-xs text-white/80">
                <span>수업 집중</span>
                <button
                  onClick={handleFocusModeToggle}
                  className="w-9 h-5 rounded-full bg-blue-500 relative cursor-pointer transition-colors"
                >
                  <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 right-0.5 shadow transition-transform"></div>
                </button>
              </div>
              {/* 수업 상태 표시 */}
              <div className="flex items-center gap-1 text-xs text-white/80">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                <span>수업 중</span>
              </div>
              {/* 수업 종료 버튼 */}
              <button
                onClick={handleFocusModeToggle}
                className="px-3 py-1.5 bg-white/20 text-white rounded-lg text-xs font-medium hover:bg-white/30"
              >
                수업 종료
              </button>
            </>
          )}
        </div>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div className="flex-1 flex gap-3 p-3 min-h-0 relative">
        {/* 왼쪽 패널 - 슬라이드 목록 */}
        <div className={`bg-white rounded-2xl border border-gray-200 flex flex-col shrink-0 transition-all overflow-hidden ${
          leftCollapsed ? 'w-12' : 'w-44'
        }`} style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          {/* 접힌 상태 */}
          {leftCollapsed && (
            <div className="flex flex-col h-full">
              {/* 상단 펼침 버튼 */}
              <div className="p-1.5 flex justify-center">
                <button
                  onClick={() => setLeftCollapsed(false)}
                  className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center text-white text-sm hover:bg-slate-600"
                >
                  ▶
                </button>
              </div>
              {/* 슬라이드 번호 목록 */}
              <div className="flex-1 overflow-y-auto py-1 flex flex-col items-center gap-1">
                {textbookSlides.map((slide) => (
                  <button
                    key={slide.id}
                    onClick={() => setCurrentSlide(slide.id)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-all ${
                      currentSlide === slide.id
                        ? 'bg-blue-50 text-blue-600 border-2 border-blue-400'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {slide.id}
                  </button>
                ))}
              </div>
            </div>
          )}
          {/* 펼쳐진 상태 */}
          {!leftCollapsed && (
            <>
              {/* 헤더 */}
              <div className="px-3 py-2.5 border-b border-gray-200 flex items-center justify-between shrink-0">
                <span className="font-bold text-sm text-gray-800">슬라이드</span>
                <button
                  onClick={() => setLeftCollapsed(true)}
                  className="w-6 h-6 bg-slate-700 rounded flex items-center justify-center text-white text-xs hover:bg-slate-600"
                >
                  ◀
                </button>
              </div>
              {/* 슬라이드 목록 */}
              <div className="flex-1 overflow-y-auto p-2.5 flex flex-col gap-2">
                {textbookSlides.map((slide) => (
                  <button
                    key={slide.id}
                    onClick={() => setCurrentSlide(slide.id)}
                    className={`rounded-xl h-20 flex items-center justify-center text-base font-medium transition-all ${
                      currentSlide === slide.id
                        ? 'bg-blue-50 text-blue-600 border-2 border-blue-400'
                        : 'bg-gray-100 text-gray-500 border-2 border-transparent hover:bg-gray-200'
                    }`}
                  >
                    {slide.id}
                  </button>
                ))}
              </div>
              {/* 하단 페이지네이션 */}
              <div className="p-2 border-t border-gray-200 flex items-center justify-center gap-2 shrink-0">
                <button
                  onClick={() => setCurrentSlide(Math.max(1, currentSlide - 1))}
                  disabled={currentSlide === 1}
                  className={`w-7 h-7 rounded-lg border border-gray-200 bg-white text-sm hover:bg-gray-50 ${currentSlide === 1 ? 'opacity-30' : ''}`}
                >
                  ‹
                </button>
                <span className="text-xs font-medium text-gray-600 min-w-[40px] text-center">{currentSlide}/{textbookSlides.length}</span>
                <button
                  onClick={() => setCurrentSlide(Math.min(textbookSlides.length, currentSlide + 1))}
                  disabled={currentSlide === textbookSlides.length}
                  className={`w-7 h-7 rounded-lg border border-gray-200 bg-white text-sm hover:bg-gray-50 ${currentSlide === textbookSlides.length ? 'opacity-30' : ''}`}
                >
                  ›
                </button>
              </div>
            </>
          )}
        </div>

        {/* 메인 패널 */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-200 flex flex-col min-w-0 overflow-hidden relative" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          {/* 판서 도구바 */}
          {isDrawing && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-white border border-gray-200 rounded-2xl px-4 py-2 flex items-center gap-2 z-50" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
              <button
                onClick={() => setDrawTool('pen')}
                className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg ${drawTool === 'pen' ? 'bg-blue-50 border border-blue-500' : 'hover:bg-gray-100'}`}
              >✏️</button>
              <button
                onClick={() => setDrawTool('highlighter')}
                className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg ${drawTool === 'highlighter' ? 'bg-blue-50 border border-blue-500' : 'hover:bg-gray-100'}`}
              >🖍️</button>
              <button
                onClick={() => setDrawTool('eraser')}
                className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg ${drawTool === 'eraser' ? 'bg-blue-50 border border-blue-500' : 'hover:bg-gray-100'}`}
              >🧽</button>
              <div className="w-px h-6 bg-gray-200 mx-1"></div>
              <button
                onClick={() => setDrawColor('#000000')}
                className={`w-6 h-6 rounded-full bg-black cursor-pointer border-2 ${drawColor === '#000000' ? 'border-blue-500' : 'border-white'}`}
              ></button>
              <button
                onClick={() => setDrawColor('#ef4444')}
                className={`w-6 h-6 rounded-full bg-red-500 cursor-pointer border-2 ${drawColor === '#ef4444' ? 'border-blue-500' : 'border-white'}`}
              ></button>
              <button
                onClick={() => setDrawColor('#3b82f6')}
                className={`w-6 h-6 rounded-full bg-blue-500 cursor-pointer border-2 ${drawColor === '#3b82f6' ? 'border-blue-500' : 'border-white'}`}
              ></button>
              <div className="w-px h-6 bg-gray-200 mx-1"></div>
              <button
                onClick={() => setStrokeWidth(Math.max(2, strokeWidth - 2))}
                className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600"
              >-</button>
              <span className="text-xs text-gray-500 w-4 text-center">{strokeWidth}</span>
              <button
                onClick={() => setStrokeWidth(Math.min(20, strokeWidth + 2))}
                className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600"
              >+</button>
              <div className="w-px h-6 bg-gray-200 mx-1"></div>
              <button
                onClick={() => canvasRef.current?.undo()}
                className="w-9 h-9 rounded-lg hover:bg-gray-100 flex items-center justify-center text-lg"
              >↩️</button>
              <button
                onClick={() => canvasRef.current?.redo()}
                className="w-9 h-9 rounded-lg hover:bg-gray-100 flex items-center justify-center text-lg"
              >↪️</button>
              <button
                onClick={() => canvasRef.current?.clearCanvas()}
                className="w-9 h-9 rounded-lg hover:bg-gray-100 flex items-center justify-center text-lg"
                title="전체 지우기"
              >🗑️</button>
              <div className="w-px h-6 bg-gray-200 mx-1"></div>
              <button
                onClick={() => {
                  setIsDrawing(false);
                  setIsTogetherMode(false);
                  showToast(isTogetherMode ? '함께 보기가 종료되었습니다.' : '판서 모드가 종료되었습니다.');
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg text-sm font-semibold hover:bg-gray-600"
              >종료</button>
            </div>
          )}

          {/* AI 맞춤학습 콘텐츠 */}
          {activeTab === 'ai' ? (
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              <div className="flex gap-6 h-full">
                {/* 왼쪽 - 설정 패널 */}
                <div className="w-80 bg-white rounded-2xl border border-gray-200 p-5 flex flex-col shrink-0">
                  {/* 탭 */}
                  <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
                    <button className="flex-1 py-2.5 px-4 bg-white rounded-lg text-sm font-semibold text-gray-800 shadow-sm">
                      수업 중 풀기
                    </button>
                    <button className="flex-1 py-2.5 px-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                      과제로 내기
                    </button>
                  </div>

                  {/* 문제 구성 */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">문제 구성</h3>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 p-3 bg-blue-50 border-2 border-blue-200 rounded-xl cursor-pointer">
                        <div className="w-5 h-5 rounded-full border-2 border-blue-500 flex items-center justify-center">
                          <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                        </div>
                        <span className="text-sm font-medium text-gray-700">개인별 맞춤 문제</span>
                        <span className="ml-auto w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">i</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                        <span className="text-sm font-medium text-gray-700">모두 같은 문제</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex-1"></div>

                  {/* 하단 버튼 */}
                  <div className="flex gap-2 pt-4 border-t border-gray-200">
                    <button className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-200">
                      문제 미리보기
                    </button>
                    <button className="flex-1 py-3 bg-gray-200 text-gray-500 rounded-xl text-sm font-medium">
                      출제하기
                    </button>
                  </div>
                </div>

                {/* 오른쪽 - 출제 대상 */}
                <div className="flex-1 bg-white rounded-2xl border border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-gray-800">
                      출제 대상 <span className="text-blue-500">0</span>/10 명
                    </h3>
                    <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                      전체 선택
                    </label>
                  </div>

                  {/* 학생 그룹 테이블 */}
                  <div className="flex gap-3">
                    {/* 상 학생 */}
                    <div className="flex-1 border border-gray-200 rounded-xl overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-2.5 bg-blue-50 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-blue-400 text-white text-xs font-bold flex items-center justify-center">상</span>
                          <span className="text-sm font-medium text-gray-700">학생</span>
                        </div>
                        <span className="text-sm text-gray-500">0/0 명</span>
                      </div>
                      <div className="p-3">
                        <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                          전체 선택
                        </label>
                      </div>
                    </div>

                    {/* 중 학생 */}
                    <div className="flex-1 border border-gray-200 rounded-xl overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-2.5 bg-yellow-50 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-yellow-400 text-white text-xs font-bold flex items-center justify-center">중</span>
                          <span className="text-sm font-medium text-gray-700">학생</span>
                        </div>
                        <span className="text-sm text-gray-500">0/0 명</span>
                      </div>
                      <div className="p-3">
                        <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                          전체 선택
                        </label>
                      </div>
                    </div>

                    {/* 하 학생 */}
                    <div className="flex-1 border border-gray-200 rounded-xl overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-2.5 bg-red-50 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-red-400 text-white text-xs font-bold flex items-center justify-center">하</span>
                          <span className="text-sm font-medium text-gray-700">학생</span>
                        </div>
                        <span className="text-sm text-gray-500">0/0 명</span>
                      </div>
                      <div className="p-3">
                        <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                          전체 선택
                        </label>
                      </div>
                    </div>

                    {/* 학습 전 */}
                    <div className="w-48 border border-gray-200 rounded-xl overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-200">
                        <span className="text-sm font-medium text-gray-700">학습 전</span>
                        <span className="text-sm text-gray-500">0/10 명</span>
                      </div>
                      <div className="p-3">
                        <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer mb-2">
                          <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                          전체 선택
                        </label>
                        <div className="space-y-1.5 max-h-48 overflow-y-auto">
                          {['김지우', '이도윤', '최하율', '김서아', '임지아', '박예린', '최민서', '남하윤', '박시은', '심아린'].map((name, idx) => (
                            <label key={idx} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-50 p-1 rounded">
                              <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                              {name}
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : isDrawing ? (
            /* 판서 모드 - 전체 캔버스 + 문제 배경 */
            <div className="flex-1 flex pt-16 overflow-hidden relative">
              {/* 배경: 문제 화면 (왼쪽 절반) */}
              <div className="absolute inset-0 pt-16 flex pointer-events-none">
                <div className="w-1/2 p-4 bg-gradient-to-b from-white to-gray-50">
                  <div
                    className="bg-white rounded-2xl border border-gray-200 p-5"
                    style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.06)', transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top left' }}
                  >
                    {/* 문제 헤더 */}
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg font-bold text-sm">
                        문제 {currentSlide}
                      </span>
                      <span className="text-sm text-gray-500">난이도: 중</span>
                    </div>

                    {/* 문제 제목 */}
                    <h2 className="text-lg font-bold text-gray-800 mb-4">
                      다음 자료의 평균을 구하시오.
                    </h2>

                    {/* 문제 박스 */}
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-3">
                      <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-500">(1)</span>
                          <span className="font-medium text-sm">다음 숫자들의 평균을 구하세요</span>
                        </div>
                        <span className="text-xs text-gray-500">(단위: 개)</span>
                      </div>
                      <div className="flex gap-4 flex-wrap justify-center px-4 py-4 bg-white border border-gray-200 rounded-lg text-lg font-bold">
                        <span>45</span>
                        <span>52</span>
                        <span>48</span>
                        <span>55</span>
                        <span>60</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* 오른쪽 빈 영역 */}
                <div className="w-1/2 bg-white border-l border-gray-100"></div>
              </div>

              {/* 전체 캔버스 (투명 배경으로 위에 덮음) */}
              <div className="absolute inset-0 pt-16 z-10">
                <ReactSketchCanvas
                  ref={canvasRef}
                  strokeWidth={drawTool === 'eraser' ? 20 : strokeWidth}
                  strokeColor={drawTool === 'eraser' ? '#ffffff' : (drawTool === 'highlighter' ? `${drawColor}40` : drawColor)}
                  canvasColor="transparent"
                  style={{ border: 'none' }}
                  className="w-full h-full"
                />
              </div>

              {/* 함께 보기 모드: 학생 패널 (전체 높이, 최상위 레이어) */}
              {isTogetherMode && (
                <div
                  className={`absolute right-0 top-0 bottom-0 ${isTogetherPanelCollapsed ? collapsedSideWidth : 'w-80'} ${isTogetherPanelCollapsed ? 'bg-blue-50 border-blue-200' : 'bg-white border-blue-200'} z-50 flex flex-col rounded-2xl overflow-hidden transition-all duration-300`}
                  style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                >
                  {isTogetherPanelCollapsed ? (
                    <div className="h-full flex flex-col items-center py-4 gap-3">
                      <button
                        onClick={() => setIsTogetherPanelCollapsed(false)}
                        className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 text-xs font-semibold hover:bg-blue-200"
                      >
                        펼침
                      </button>
                      <div className="flex-1 flex items-center">
                        <div className="text-xs text-gray-500 tracking-widest rotate-90 whitespace-nowrap">함께 보기</div>
                      </div>
                      <button
                        onClick={() => {
                          setIsDrawing(false);
                          setIsTogetherMode(false);
                          setIsTogetherPanelCollapsed(false);
                          showToast('함께 보기가 종료되었습니다.');
                        }}
                        className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* 헤더 */}
                      <div className="px-5 py-4 flex items-center justify-between border-b border-blue-100 bg-blue-50/60">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">👁️</span>
                          <span className="font-bold text-gray-800">함께 보기</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setIsTogetherPanelCollapsed(true)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200"
                          >
                            접힘
                          </button>
                          <button
                            onClick={() => {
                              setIsDrawing(false);
                              setIsTogetherMode(false);
                              setIsTogetherPanelCollapsed(false);
                              showToast('함께 보기가 종료되었습니다.');
                            }}
                            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600"
                          >
                            ✕
                          </button>
                        </div>
                      </div>

                      {/* 현재 문제로 모으기 설명 */}
                      <div className="px-5 py-4 bg-blue-50 border-b border-blue-100">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">👋</span>
                          <div>
                            <div className="font-bold text-gray-800">현재 문제로 함께 보기</div>
                            <div className="text-sm text-gray-500 mt-0.5">학생들과 함께 판서할 수 있습니다</div>
                          </div>
                        </div>
                      </div>

                      {/* 진행률 바 */}
                      <div className="px-5 py-3 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all"
                              style={{ width: `${(studentPermissions.filter(s => s.canDraw).length / studentPermissions.length) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-bold">
                            <span className="text-green-500">{studentPermissions.filter(s => s.canDraw).length}</span>
                            <span className="text-gray-400">/{studentPermissions.length}명</span>
                          </span>
                        </div>
                      </div>

                      {/* 학생 아바타 그리드 */}
                      <div className="px-5 py-4 border-b border-gray-100">
                        <div className="flex flex-wrap gap-2">
                          {studentPermissions.map((student, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                if (student.submitted) {
                                  const updated = [...studentPermissions];
                                  updated[idx].canDraw = !updated[idx].canDraw;
                                  setStudentPermissions(updated);
                                }
                              }}
                              disabled={!student.submitted}
                              className={`w-11 h-11 rounded-full flex items-center justify-center text-2xl transition-all ${
                                !student.submitted
                                  ? 'opacity-40 cursor-not-allowed'
                                  : student.canDraw
                                    ? 'ring-2 ring-green-500 ring-offset-2 bg-green-50'
                                    : 'hover:bg-gray-100'
                              }`}
                              title={`${student.name} ${student.submitted ? (student.canDraw ? '(허용됨)' : '(불가)') : '(오프라인)'}`}
                            >
                              {student.avatar}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 학생 리스트 */}
                      <div className="flex-1 overflow-y-auto">
                        {studentPermissions.map((student, idx) => (
                          <div
                            key={idx}
                            className={`px-5 py-3 flex items-center justify-between border-b border-gray-100 ${
                              student.canDraw ? 'bg-green-50' : ''
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                className="w-5 h-5 rounded border-gray-300"
                                checked={student.canDraw}
                                onChange={() => {
                                  if (student.submitted) {
                                    const updated = [...studentPermissions];
                                    updated[idx].canDraw = !updated[idx].canDraw;
                                    setStudentPermissions(updated);
                                  }
                                }}
                                disabled={!student.submitted}
                              />
                              <span className="text-2xl">{student.avatar}</span>
                              <div>
                                <div className="text-sm font-medium text-gray-800">{student.name}</div>
                                <div className={`text-xs ${student.submitted ? 'text-green-500' : 'text-gray-400'}`}>
                                  {student.submitted ? '● 접속 중' : '○ 오프라인'}
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                if (student.submitted) {
                                  const updated = [...studentPermissions];
                                  updated[idx].canDraw = !updated[idx].canDraw;
                                  setStudentPermissions(updated);
                                  showToast(updated[idx].canDraw ? `${student.name} 학생에게 판서 권한을 부여했습니다.` : `${student.name} 학생의 판서 권한을 해제했습니다.`);
                                }
                              }}
                              disabled={!student.submitted}
                              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                !student.submitted
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : student.canDraw
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                              }`}
                            >
                              {student.canDraw ? '허용' : '불가'}
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* 하단 버튼 */}
                      <div className="px-5 py-4 border-t border-gray-200 bg-gray-50">
                        <button
                          onClick={() => {
                            const allAllowed = studentPermissions.filter(s => s.submitted).every(s => s.canDraw);
                            const updated = studentPermissions.map(s => ({ ...s, canDraw: s.submitted ? !allAllowed : false }));
                            setStudentPermissions(updated);
                            showToast(allAllowed ? '모든 학생의 판서 권한을 해제했습니다.' : '접속 중인 모든 학생에게 판서 권한을 부여했습니다.');
                          }}
                          className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-sm font-semibold hover:from-blue-600 hover:to-blue-700 flex items-center justify-center gap-2"
                        >
                          <span>👋</span>
                          <span>{studentPermissions.filter(s => s.submitted).every(s => s.canDraw) ? '전체 권한 해제' : '전체 허용하기'}</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* 기본 문제 콘텐츠 (교과서 탭 등) */
            <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-white to-gray-50">
              <div
                className="max-w-3xl mx-auto bg-white rounded-3xl border border-gray-200 p-7 transition-transform origin-top"
                style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.06)', transform: `scale(${zoomLevel / 100})` }}
              >
                {/* 문제 헤더 */}
                <div className="flex items-center gap-3 mb-5">
                  <span className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl font-bold text-sm">
                    문제 {currentSlide}
                  </span>
                  <span className="text-sm text-gray-500">난이도: 중</span>
                </div>

                {/* 문제 제목 */}
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                  다음 자료의 평균을 구하시오.
                </h2>

                {/* 문제 박스 */}
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 mb-4">
                  <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-500">(1)</span>
                      <span className="font-medium">다음 숫자들의 평균을 구하세요</span>
                    </div>
                    <span className="text-sm text-gray-500">(단위: 개)</span>
                  </div>
                  <div className="flex gap-6 flex-wrap justify-center px-6 py-5 bg-white border border-gray-200 rounded-xl mb-3 text-xl font-bold">
                    <span>45</span>
                    <span>52</span>
                    <span>48</span>
                    <span>55</span>
                    <span>60</span>
                  </div>
                  <div className="flex items-center justify-end gap-2.5">
                    <div className={`px-4 py-2 bg-green-100 border-2 border-green-300 rounded-xl text-lg font-bold text-green-600 ${hideAnswer ? 'hidden' : ''}`}>
                      52
                    </div>
                    <input
                      type="text"
                      placeholder="정답 입력"
                      className="w-24 px-3 py-3 border-2 border-gray-200 rounded-xl text-lg font-semibold text-right focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* 힌트/해설 아코디언 */}
                <div className="flex flex-col gap-3 mt-6">
                  <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white">
                    <button
                      onClick={() => setShowHint(!showHint)}
                      className="w-full px-5 py-3.5 flex items-center justify-center gap-3 cursor-pointer bg-sky-50 hover:bg-sky-100 transition-colors"
                    >
                      <span className="text-sm font-semibold text-amber-500 flex items-center gap-2">💡 힌트 보기</span>
                      <span className={`text-gray-400 ml-auto transition-transform ${showHint ? 'rotate-180' : ''}`}>▼</span>
                    </button>
                    {showHint && (
                      <div className="px-5 py-4 border-t border-gray-200 text-sm leading-relaxed">
                        평균 = (모든 값의 합) ÷ (값의 개수)<br/>
                        먼저 모든 숫자를 더해보세요: 45 + 52 + 48 + 55 + 60 = ?
                      </div>
                    )}
                  </div>
                  <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white">
                    <button
                      onClick={() => setShowSolution(!showSolution)}
                      className="w-full px-5 py-3.5 flex items-center justify-center gap-3 cursor-pointer bg-sky-50 hover:bg-sky-100 transition-colors"
                    >
                      <span className="text-sm font-semibold text-blue-500 flex items-center gap-2">📘 해설 보기</span>
                      <span className={`text-gray-400 ml-auto transition-transform ${showSolution ? 'rotate-180' : ''}`}>▼</span>
                    </button>
                    {showSolution && (
                      <div className="px-5 py-4 border-t border-gray-200 text-sm leading-relaxed">
                        <strong>풀이:</strong><br/>
                        1. 모든 값의 합: 45 + 52 + 48 + 55 + 60 = <span className="inline-flex items-center justify-center w-8 h-8 bg-red-100 rounded-full font-bold text-red-500">260</span><br/>
                        2. 값의 개수: 5개<br/>
                        3. 평균 = 260 ÷ 5 = <strong className="text-blue-500">52</strong>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 함께 보기 FAB */}
          {activeTab !== 'ai' && !isDrawing && (
            <div className="absolute bottom-6 right-6">
              <div className="bg-slate-800 text-white px-3.5 py-2 rounded-xl text-xs font-semibold mb-2">
                함께 보기
              </div>
              <button
                onClick={() => {
                  setIsDrawing(true);
                  setIsTogetherMode(true);
                  setIsTogetherPanelCollapsed(false);
                  setLeftCollapsed(true);
                  setRightCollapsed(true);
                  showToast('선생님과 학생 모두 함께 보기를 시작합니다.');
                }}
                className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-lg shadow-red-500/40 hover:scale-110 transition-transform"
              >
                <div className="flex gap-2">
                  <div className="w-4 h-5 bg-white rounded-full flex items-center justify-center">
                    <div className="w-2 h-2.5 bg-gray-800 rounded-full"></div>
                  </div>
                  <div className="w-4 h-5 bg-white rounded-full flex items-center justify-center">
                    <div className="w-2 h-2.5 bg-gray-800 rounded-full"></div>
                  </div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* 오른쪽 패널 - 수업 도구 */}
        <div className={`bg-white rounded-2xl border border-gray-200 flex flex-col shrink-0 overflow-hidden transition-all duration-300 ${
          rightCollapsed ? collapsedSideWidth : 'w-52'
        }`} style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          {/* 접힌 상태 */}
          {rightCollapsed && (
            <div className="flex flex-col h-full">
              {/* 상단 - 펼치기 버튼 */}
              <div className="p-2 flex justify-center border-b border-gray-100">
                <button
                  onClick={() => setRightCollapsed(false)}
                  className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center text-white text-sm hover:bg-slate-600"
                >
                  ‹
                </button>
              </div>

              {/* 고정 도구 아이콘 */}
              <div className="flex-1 flex flex-col items-center py-2 gap-1">
                <button
                  onClick={() => showToast('학습현황을 확인합니다.')}
                  className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors"
                  title="학습 현황"
                >
                  <span className="text-xl">👥</span>
                </button>
                <button
                  onClick={() => {
                    setIsDrawing(true);
                    setLeftCollapsed(true);
                    setRightCollapsed(true);
                    showToast('판서 모드가 시작되었습니다.');
                  }}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isDrawing ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
                  title="판서"
                >
                  <span className="text-xl">✏️</span>
                </button>
                <button
                  onClick={() => showToast('📣 학생들의 주목을 요청했습니다!')}
                  className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors"
                  title="주목"
                >
                  <span className="text-xl">📣</span>
                </button>

                <div className="w-8 h-px bg-gray-200 my-1"></div>

                {/* 수업 운영 */}
                <button
                  onClick={() => showToast('화면 제어가 활성화되었습니다.')}
                  className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors"
                  title="화면 제어"
                >
                  <span className="text-xl">🖥️</span>
                </button>
                <button
                  onClick={() => showToast('소리 제어가 활성화되었습니다.')}
                  className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors"
                  title="소리 제어"
                >
                  <span className="text-xl">🔊</span>
                </button>
              </div>

              {/* 하단 컨트롤 */}
              <div className="p-2 border-t border-gray-200 bg-gray-50 flex flex-col items-center gap-1">
                <button
                  onClick={toggleFullscreen}
                  className="w-9 h-9 rounded-lg border border-gray-200 bg-white text-sm hover:bg-gray-50"
                  title="전체화면"
                >
                  ⛶
                </button>
                <button
                  onClick={handleZoomIn}
                  className="w-9 h-9 rounded-lg border border-gray-200 bg-white text-sm hover:bg-gray-50"
                  title="확대"
                >
                  +
                </button>
                <button
                  onClick={handleZoomOut}
                  className="w-9 h-9 rounded-lg border border-gray-200 bg-white text-sm hover:bg-gray-50"
                  title="축소"
                >
                  -
                </button>
                <button
                  onClick={handleZoomReset}
                  className="w-9 h-9 rounded-lg border border-gray-200 bg-white text-[10px] font-semibold hover:bg-gray-50"
                  title="원본 크기"
                >
                  1:1
                </button>
              </div>
            </div>
          )}

          {/* 펼쳐진 상태 */}
          {!rightCollapsed && (
            <div className="flex flex-col h-full">
              {/* 상단 헤더 */}
              <div className="px-3 py-2.5 flex items-center justify-between border-b border-gray-100">
                <span className="text-sm font-bold text-gray-700">도구</span>
                <button
                  onClick={() => setRightCollapsed(true)}
                  className="w-7 h-7 bg-slate-700 rounded-md flex items-center justify-center text-white text-sm hover:bg-slate-600"
                >
                  ›
                </button>
              </div>

              {/* 고정 도구 - 학습 현황, 판서, 주목 */}
              <div className="px-3 py-2 border-b border-gray-100">
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => showToast('학습현황을 확인합니다.')}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-lg">👥</span>
                    <span className="text-sm text-gray-700">학습 현황</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsDrawing(true);
                      setLeftCollapsed(true);
                      setRightCollapsed(true);
                      showToast('판서 모드가 시작되었습니다.');
                    }}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-colors ${isDrawing ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
                  >
                    <span className="text-lg">✏️</span>
                    <span className="text-sm text-gray-700">판서</span>
                  </button>
                  <button
                    onClick={() => showToast('📣 학생들의 주목을 요청했습니다!')}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-lg">📣</span>
                    <span className="text-sm text-gray-700">주목</span>
                  </button>
                </div>
              </div>

              {/* 아코디언 그룹 */}
              <div className="flex-1 overflow-y-auto">
                {/* 수업 운영 */}
                <div className="border-b border-gray-100">
                  <button
                    onClick={() => setOpenToolGroups(prev => ({ ...prev, operation: !prev.operation }))}
                    className="w-full px-3 py-2 flex items-center justify-between hover:bg-gray-50"
                  >
                    <span className="text-xs font-semibold text-gray-500">수업 운영</span>
                    <span className={`text-gray-400 text-xs transition-transform ${openToolGroups.operation ? 'rotate-180' : ''}`}>▼</span>
                  </button>
                  {openToolGroups.operation && (
                    <div className="px-3 pb-2 flex flex-col gap-1">
                      <div className="flex items-center justify-between px-2.5 py-2 rounded-lg hover:bg-gray-50">
                        <div className="flex items-center gap-2.5">
                          <span className="text-lg">🖥️</span>
                          <span className="text-sm text-gray-700">화면 제어</span>
                        </div>
                        <button
                          onClick={() => showToast('화면 제어가 활성화되었습니다.')}
                          className="w-10 h-5 rounded-full bg-gray-200 relative transition-colors"
                        >
                          <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 left-0.5 shadow-sm"></div>
                        </button>
                      </div>
                      <div className="flex items-center justify-between px-2.5 py-2 rounded-lg hover:bg-gray-50">
                        <div className="flex items-center gap-2.5">
                          <span className="text-lg">🔊</span>
                          <span className="text-sm text-gray-700">소리 제어</span>
                        </div>
                        <button
                          onClick={() => showToast('소리 제어가 활성화되었습니다.')}
                          className="w-10 h-5 rounded-full bg-gray-200 relative transition-colors"
                        >
                          <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 left-0.5 shadow-sm"></div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 참여 활동 */}
                <div className="border-b border-gray-100">
                  <button
                    onClick={() => setOpenToolGroups(prev => ({ ...prev, activity: !prev.activity }))}
                    className="w-full px-3 py-2 flex items-center justify-between hover:bg-gray-50"
                  >
                    <span className="text-xs font-semibold text-gray-500">참여 활동</span>
                    <span className={`text-gray-400 text-xs transition-transform ${openToolGroups.activity ? 'rotate-180' : ''}`}>▼</span>
                  </button>
                  {openToolGroups.activity && (
                    <div className="px-3 pb-2 flex flex-col gap-1">
                      <button
                        onClick={() => showToast('의견 보드가 열렸습니다.')}
                        className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-lg">💬</span>
                        <span className="text-sm text-gray-700">의견 보드</span>
                      </button>
                      <button
                        onClick={() => showToast('화이트 보드가 열렸습니다.')}
                        className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-lg">📝</span>
                        <span className="text-sm text-gray-700">화이트 보드</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* 과목 도구 */}
                <div className="border-b border-gray-100">
                  <button
                    onClick={() => setOpenToolGroups(prev => ({ ...prev, subject: !prev.subject }))}
                    className="w-full px-3 py-2 flex items-center justify-between hover:bg-gray-50"
                  >
                    <span className="text-xs font-semibold text-gray-500">과목 도구</span>
                    <span className={`text-gray-400 text-xs transition-transform ${openToolGroups.subject ? 'rotate-180' : ''}`}>▼</span>
                  </button>
                  {openToolGroups.subject && (
                    <div className="px-3 pb-2 flex flex-col gap-1">
                      <button
                        onClick={() => showToast('수학 도구가 열렸습니다.')}
                        className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-lg">📐</span>
                        <span className="text-sm text-gray-700">수학 도구</span>
                      </button>
                      <button
                        onClick={() => showToast('Math Canvas가 열렸습니다.')}
                        className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-5 h-5 bg-gray-100 rounded flex items-center justify-center">
                          <span className="text-[8px] font-bold text-gray-500">MC</span>
                        </div>
                        <span className="text-sm text-gray-700">Math Canvas</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* 수업 지원 */}
                <div className="border-b border-gray-100">
                  <button
                    onClick={() => setOpenToolGroups(prev => ({ ...prev, support: !prev.support }))}
                    className="w-full px-3 py-2 flex items-center justify-between hover:bg-gray-50"
                  >
                    <span className="text-xs font-semibold text-gray-500">수업 지원</span>
                    <span className={`text-gray-400 text-xs transition-transform ${openToolGroups.support ? 'rotate-180' : ''}`}>▼</span>
                  </button>
                  {openToolGroups.support && (
                    <div className="px-3 pb-2 flex flex-col gap-1">
                      <button
                        onClick={() => showToast('게임이 시작됩니다.')}
                        className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-lg">🎮</span>
                        <span className="text-sm text-gray-700">게임</span>
                      </button>
                      <button
                        onClick={() => showToast('스마트 수업도구가 열렸습니다.')}
                        className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-lg">⭐</span>
                        <span className="text-sm text-gray-700">스마트 수업도구</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* 하단 컨트롤 */}
              <div className="p-2 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between gap-1">
                  <button
                    onClick={() => showToast('도구 편집 모드입니다.')}
                    className="flex-1 h-8 rounded-lg border border-gray-200 bg-white text-xs text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-1"
                  >
                    <span>⚙️</span>
                    <span>도구 편집</span>
                  </button>
                  <button
                    onClick={toggleFullscreen}
                    className="w-8 h-8 rounded-lg border border-gray-200 bg-white text-sm hover:bg-gray-50 flex items-center justify-center"
                    title="전체화면"
                  >
                    ⛶
                  </button>
                  <button
                    onClick={handleZoomOut}
                    className="w-8 h-8 rounded-lg border border-gray-200 bg-white text-sm hover:bg-gray-50 flex items-center justify-center"
                    title="축소"
                  >
                    -
                  </button>
                  <button
                    onClick={handleZoomIn}
                    className="w-8 h-8 rounded-lg border border-gray-200 bg-white text-sm hover:bg-gray-50 flex items-center justify-center"
                    title="확대"
                  >
                    +
                  </button>
                  <button
                    onClick={handleZoomReset}
                    className="w-8 h-8 rounded-lg border border-gray-200 bg-white text-[10px] font-semibold hover:bg-gray-50 flex items-center justify-center"
                    title="원본 크기"
                  >
                    1:1
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 하단바 - 3영역 구분 */}
      <div className="h-18 bg-white border-t border-gray-200 flex items-center justify-between px-4 shrink-0 gap-3">
        {/* 응답 영역 */}
        <div className="flex items-center gap-2 px-3.5 py-2 bg-gray-50 rounded-2xl border border-gray-200">
          <span className="text-xs font-bold text-gray-500 pr-2.5 border-r border-gray-200 mr-1">응답</span>
          <button
            onClick={() => openPanel('submit')}
            className="flex items-center gap-2.5 px-3 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50"
          >
            <span className="text-lg">👥</span>
            <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full" style={{ width: `${(submittedCount/totalCount)*100}%` }}></div>
            </div>
            <span className="text-sm font-bold"><strong className="text-blue-500 text-base">{submittedCount}</strong>/{totalCount}</span>
          </button>
          <button
            onClick={() => setHideAnswer(!hideAnswer)}
            className={`px-4 py-2.5 rounded-xl text-sm font-bold ${hideAnswer ? 'bg-blue-500 text-white' : 'bg-gray-500 text-white'}`}
          >
            ✓ {hideAnswer ? '정오 숨김' : '정오 표시'}
          </button>
        </div>

        {/* 활동 영역 */}
        <div className="flex items-center gap-2 px-3.5 py-2 bg-amber-50 rounded-2xl border border-amber-200">
          <span className="text-xs font-bold text-gray-500 pr-2.5 border-r border-amber-300 mr-1">활동</span>
          {[
            { icon: '👋', label: '모으기', panel: 'gather' },
            { icon: '🎯', label: '활동', isModal: true },
            { icon: '🔖', label: '북마크', panel: 'bookmark', active: isBookmarked },
            { icon: '👍', label: '우수답안', panel: 'best' },
            { icon: '💬', label: '질문', panel: 'question' },
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (item.isModal) {
                  setShowActivityModal(true);
                } else if (item.panel === 'bookmark') {
                  setIsBookmarked(!isBookmarked);
                  showToast(isBookmarked ? '북마크가 해제되었습니다.' : '북마크에 추가되었습니다!');
                } else {
                  openPanel(item.panel);
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-2 bg-white border rounded-lg text-xs hover:bg-blue-50 hover:border-blue-500 hover:text-blue-500 transition-all ${
                item.active ? 'bg-blue-500 text-white border-blue-500' : 'border-gray-200'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* 이동 영역 */}
        <div className="flex items-center gap-2 px-3.5 py-2 bg-sky-50 rounded-2xl border border-sky-200">
          <span className="text-xs font-bold text-gray-500 pr-2.5 border-r border-sky-300 mr-1">이동</span>
          <button className="px-3.5 py-2 border border-gray-200 rounded-lg bg-white text-xs hover:bg-gray-50">‹ 이전차시</button>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentSlide(Math.max(1, currentSlide - 1))}
              className="w-9 h-9 rounded-lg border border-gray-200 bg-white text-sm font-semibold hover:bg-gray-50"
            >
              ‹
            </button>
            <span className="min-w-10 text-center font-bold text-sm">{currentSlide}/{textbookSlides.length}</span>
            <button
              onClick={() => setCurrentSlide(Math.min(textbookSlides.length, currentSlide + 1))}
              className="w-9 h-9 rounded-lg border border-gray-200 bg-white text-sm font-semibold hover:bg-gray-50"
            >
              ›
            </button>
          </div>
          <button className="px-3.5 py-2 border border-gray-200 rounded-lg bg-white text-xs hover:bg-gray-50">다음차시 ›</button>
        </div>
      </div>

      {/* 사이드 패널들 */}
      {/* 제출현황 패널 */}
      <div className={`fixed top-0 right-0 w-96 h-full bg-white shadow-2xl flex flex-col z-50 transition-transform duration-300 ${
        activePanel === 'submit' ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="px-5 py-4 border-b border-gray-200 bg-gray-50 flex items-center gap-3">
          <h3 className="font-bold text-base flex-1">👥 제출현황</h3>
          <button onClick={closeAllPanels} className="w-8 h-8 bg-white border border-gray-200 rounded-lg text-sm text-gray-500 hover:bg-gray-100">✕</button>
        </div>
        {/* 탭 필터 */}
        <div className="flex border-b border-gray-200 bg-white">
          {[
            { id: 'all', label: `전체 ${textbookStudents.length}` },
            { id: 'submitted', label: `제출 ${textbookStudents.filter(s => s.submitted).length}` },
            { id: 'not-submitted', label: `미제출 ${textbookStudents.filter(s => !s.submitted).length}` },
          ].map(tab => (
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
        {/* 학생 답안 보기 모드 */}
        {showStudentAnswer ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* 학생 답안 헤더 */}
            <div className="p-3 border-b border-gray-200 bg-white">
              <button
                onClick={() => setShowStudentAnswer(false)}
                className="text-xs text-blue-500 hover:underline mb-2"
              >
                ← 목록으로 돌아가기
              </button>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full">
                  <span className="text-xl">{textbookStudents[selectedStudent]?.avatar}</span>
                  <div>
                    <div className="text-sm font-bold">{textbookStudents[selectedStudent]?.name}</div>
                    <div className="text-xs text-blue-500">
                      {textbookStudents[selectedStudent]?.submitted ? '제출 완료' : '미제출'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 ml-auto">
                  <button
                    onClick={() => setSelectedStudent(Math.max(0, selectedStudent - 1))}
                    className="px-2 py-1 border border-gray-200 rounded text-xs"
                  >
                    ‹ 이전
                  </button>
                  <span className="text-xs text-gray-500 px-2">{selectedStudent + 1}/{textbookStudents.length}</span>
                  <button
                    onClick={() => setSelectedStudent(Math.min(textbookStudents.length - 1, selectedStudent + 1))}
                    className="px-2 py-1 border border-gray-200 rounded text-xs"
                  >
                    다음 ›
                  </button>
                </div>
              </div>
            </div>
            {/* 학생 답안 내용 */}
            <div className="flex-1 overflow-y-auto p-4">
              {textbookStudents[selectedStudent]?.submitted ? (
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-sm font-semibold mb-3">문제 {currentSlide} 답안</div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="text-2xl font-bold text-blue-500 text-center">
                      {textbookStudents[selectedStudent]?.answer}
                    </div>
                  </div>
                  {/* 피드백 영역 */}
                  {showFeedback && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <textarea
                        className="w-full p-2 border border-gray-200 rounded-lg text-sm resize-none"
                        placeholder={`${textbookStudents[selectedStudent]?.name} 학생에게 피드백을 입력하세요...`}
                        rows={3}
                      />
                      <div className="flex gap-2 mt-2 justify-end">
                        <button
                          onClick={() => setShowFeedback(false)}
                          className="px-3 py-1.5 bg-gray-200 rounded-lg text-xs"
                        >
                          취소
                        </button>
                        <button
                          onClick={() => {
                            setShowFeedback(false);
                            showToast('피드백이 저장되었습니다.');
                          }}
                          className="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-xs"
                        >
                          저장
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <span className="text-4xl mb-3">📭</span>
                  <p className="text-sm font-medium">아직 제출하지 않았습니다</p>
                </div>
              )}
            </div>
            {/* 학생 답안 푸터 */}
            {textbookStudents[selectedStudent]?.submitted && (
              <div className="p-3 border-t border-gray-200 bg-white flex gap-2">
                <button
                  onClick={() => {
                    if (selectedStudent === bestStudent) {
                      setBestStudent(-1);
                      showToast('우수 답안 선정이 취소되었습니다.');
                    } else {
                      setBestStudent(selectedStudent);
                      showToast(`${textbookStudents[selectedStudent]?.name} 학생이 우수 답안으로 선정되었습니다!`);
                    }
                  }}
                  className={`flex-1 py-2.5 rounded-lg text-xs font-semibold ${
                    selectedStudent === bestStudent
                      ? 'bg-yellow-400 text-yellow-900'
                      : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                  }`}
                >
                  👍 {selectedStudent === bestStudent ? '우수 답안 선정됨' : '우수 답안 선정'}
                </button>
                <button
                  onClick={() => setShowFeedback(!showFeedback)}
                  className="flex-1 py-2.5 bg-blue-500 text-white rounded-lg text-xs font-semibold"
                >
                  ✏️ 피드백 작성
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* 학생 목록 */}
            <div className="flex-1 overflow-y-auto">
              {getFilteredStudents().map((student) => {
                const realIdx = textbookStudents.indexOf(student);
                return (
                  <div
                    key={student.id}
                    onClick={() => {
                      setSelectedStudent(realIdx);
                      setShowStudentAnswer(true);
                    }}
                    className={`px-3 py-2.5 flex items-center gap-2.5 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                      !student.submitted ? 'opacity-60' : ''
                    } ${realIdx === selectedStudent ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}
                  >
                    <div
                      onClick={(e) => { e.stopPropagation(); toggleStudentCheck(realIdx); }}
                      className={`w-4 h-4 border-2 rounded flex items-center justify-center text-xs cursor-pointer ${
                        checkedStudents.has(realIdx) ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-300'
                      }`}
                    >
                      {checkedStudents.has(realIdx) && '✓'}
                    </div>
                    <span className="text-xl">{student.avatar}</span>
                    <span className="flex-1 text-sm font-medium">{student.name}</span>
                    {realIdx === bestStudent && <span className="text-xs">👍</span>}
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
                );
              })}
            </div>
            {/* 하단 버튼 */}
            <div className="p-2.5 border-t border-gray-200 bg-white flex flex-col gap-1.5">
              {submitFilter === 'not-submitted' ? (
                <button
                  onClick={() => showToast('미제출 학생들에게 알람을 보냈습니다.')}
                  className="w-full py-2.5 bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-xs font-medium"
                >
                  📢 제출 알람 보내기
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      if (checkedStudents.size === 0) {
                        showToast('학생을 선택해주세요.');
                      } else {
                        showToast(`${checkedStudents.size}명의 학생에게 다시 풀기를 요청했습니다.`);
                      }
                    }}
                    className="w-full py-2.5 border border-gray-200 rounded-lg bg-white text-xs font-medium hover:bg-gray-50"
                  >
                    선택 학생 다시풀기 요청 {checkedStudents.size > 0 && `(${checkedStudents.size}명)`}
                  </button>
                  <button
                    onClick={() => {
                      const wrongCount = textbookStudents.filter(s => s.status === 'wrong').length;
                      showToast(`오답 학생 ${wrongCount}명에게 다시 풀기를 요청했습니다.`);
                    }}
                    className="w-full py-2.5 bg-blue-500 text-white rounded-lg text-xs font-medium"
                  >
                    오답 학생 다시풀기 요청
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>

      {/* 모으기 패널 */}
      <div className={`fixed top-0 right-0 w-80 h-full bg-white shadow-2xl flex flex-col z-50 transition-transform duration-300 ${
        activePanel === 'gather' ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="px-5 py-4 border-b border-gray-200 bg-gray-50 flex items-center gap-3">
          <h3 className="font-bold text-base flex-1">👋 모으기</h3>
          <button onClick={closeAllPanels} className="w-8 h-8 bg-white border border-gray-200 rounded-lg text-sm text-gray-500 hover:bg-gray-100">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex items-center gap-4 p-5 bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl mb-5">
            <span className="text-4xl">👋</span>
            <div>
              <strong className="block text-base mb-1">현재 문제로 모으기</strong>
              <p className="text-xs text-gray-600 m-0">학생들을 이 페이지로 이동시킵니다</p>
            </div>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full" style={{ width: '60%' }}></div>
            </div>
            <span className="text-sm font-semibold"><strong className="text-green-500 text-lg">6</strong>/10명</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {textbookStudents.slice(0, 10).map((student, idx) => (
              <div
                key={student.id}
                className={`w-10 h-10 flex items-center justify-center text-xl rounded-full ${
                  idx < 6 ? 'bg-green-100 opacity-100' : 'bg-gray-100 opacity-40'
                }`}
              >
                {student.avatar}
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={() => {
              showToast('학생들을 현재 페이지로 모았습니다!');
              closeAllPanels();
            }}
            className="w-full py-3 bg-blue-500 text-white rounded-xl text-sm font-semibold"
          >
            👋 지금 모으기
          </button>
        </div>
      </div>

      {/* 질문 패널 */}
      <div className={`fixed top-0 right-0 w-96 h-full bg-white shadow-2xl flex flex-col z-50 transition-transform duration-300 ${
        activePanel === 'question' ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-bold text-base">💬 질문하기</h3>
          <div className="flex items-center gap-2 text-sm">
            <span>실명 공개</span>
            <button className="w-9 h-5 rounded-full bg-gray-300 relative cursor-pointer">
              <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 left-0.5 shadow"></div>
            </button>
          </div>
          <button onClick={closeAllPanels} className="w-8 h-8 bg-gray-100 rounded-lg text-base hover:bg-gray-200">✕</button>
        </div>
        <div className="flex-1 p-5 bg-sky-100 flex flex-col items-center justify-center text-gray-500">
          <div className="text-center">
            <p className="text-base font-semibold mb-2 text-gray-700">질문이 없습니다</p>
            <span className="text-sm">학생들의 질문이 여기에 표시됩니다</span>
          </div>
        </div>
        <div className="p-4 border-t border-gray-200 flex gap-2">
          <input type="text" placeholder="선생님도 질문 남기기..." className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm" />
          <button
            onClick={() => showToast('질문이 등록되었습니다.')}
            className="px-5 py-3 bg-blue-500 text-white rounded-xl font-semibold"
          >
            보내기
          </button>
        </div>
      </div>

      {/* 활동하기 모달 */}
      {showActivityModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowActivityModal(false)}>
          <div className="w-[650px] bg-white rounded-3xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-5 bg-blue-500 text-white flex items-center justify-between">
              <h3 className="text-lg font-bold">🎯 활동하기</h3>
              <button onClick={() => setShowActivityModal(false)} className="w-9 h-9 bg-white/20 rounded-full text-lg text-white hover:bg-white/30">✕</button>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-500 mb-3">진행 방식</h4>
                <div className="flex gap-4">
                  <button className="flex-1 p-5 border-2 border-blue-500 bg-blue-50 rounded-2xl flex items-center gap-4">
                    <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center text-2xl">👤</div>
                    <div>
                      <h5 className="text-base font-bold mb-1">개인별 활동</h5>
                      <p className="text-sm text-gray-500">각자 문제를 풉니다</p>
                    </div>
                  </button>
                  <button className="flex-1 p-5 border-2 border-gray-200 rounded-2xl flex items-center gap-4 hover:border-blue-500 hover:bg-blue-50">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">👥</div>
                    <div>
                      <h5 className="text-base font-bold mb-1">짝꿍 활동</h5>
                      <p className="text-sm text-gray-500">짝과 함께 문제를 풉니다</p>
                    </div>
                  </button>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-500 mb-3">활동 유형</h4>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: '🎬', title: '녹화', desc: '영상 촬영 제출' },
                    { icon: '📷', title: '사진', desc: '사진 촬영 제출' },
                    { icon: '🎤', title: '녹음', desc: '음성 녹음 제출' },
                    { icon: '✏️', title: '그리기', desc: '펜으로 그리기' },
                    { icon: '⌨️', title: '키보드', desc: '텍스트 입력' },
                  ].map((type, idx) => (
                    <button key={idx} className="p-4 border border-gray-200 rounded-xl flex items-center gap-3 hover:border-blue-500 hover:bg-blue-50">
                      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-xl">{type.icon}</div>
                      <div className="text-left">
                        <h5 className="text-sm font-semibold">{type.title}</h5>
                        <p className="text-xs text-gray-500">{type.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-2">
              <button onClick={() => setShowActivityModal(false)} className="px-5 py-2.5 bg-gray-200 rounded-xl text-sm font-semibold">취소</button>
              <button
                onClick={() => {
                  setShowActivityModal(false);
                  showToast('활동이 시작되었습니다!');
                }}
                className="px-5 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-semibold"
              >
                시작하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 배경 오버레이 */}
      {activePanel && (
        <div className="fixed inset-0 bg-black/30 z-40" onClick={closeAllPanels}></div>
      )}

      {/* 토스트 알림 */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-6 py-3 rounded-2xl shadow-xl z-[500] animate-pulse">
          {toast}
        </div>
      )}
    </div>
  );
};


export default TextbookPage;
