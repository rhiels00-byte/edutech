import React, { useState } from 'react';
import { studentsData, rewardHistory, studentMemos, initialMessages } from '../data/studentData';

// feature: home.note.board
// mappingStatus: Existing (memo studentFilter needs API param if missing)
// apiCandidates: GET /tch/dsbd/notice/list, POST /tch/dsbd/notice/save, POST /tch/dsbd/notice/delete, POST /tch/dsbd/notice/pin/update,
// apiCandidates: GET /tch/dsbd/memo/list, POST /tch/dsbd/memo/save, POST /tch/dsbd/memo/update, POST /tch/dsbd/memo/delete
const NoticeAndMemoBoard = ({ onClose, initialTab = 'notice', initialStudentFilter = null }) => {
  const [activeTab, setActiveTab] = useState(initialTab); // 'notice' or 'memo'
  const [studentFilter, setStudentFilter] = useState(initialStudentFilter); // 특정 학생 필터
  const [notices, setNotices] = useState([
    { id: 1, content: '4단원 스스로 학습 풀기', date: '2025-12-19', editDate: '2025-12-19', isPinned: true },
    { id: 2, content: '다음 주 월요일은 현장학습입니다', date: '2025-12-18', editDate: '2025-12-18', isPinned: false },
    { id: 3, content: '수학 교과서 꼭 챙겨오세요', date: '2025-12-17', editDate: '2025-12-17', isPinned: false },
  ]);
  const [memos, setMemos] = useState([
    { id: 1, content: '이하은 학생 숙제 미제출 2회 연속 - 상담 필요', date: '2025-12-19', editDate: '2025-12-19', isPinned: true, student: '이하은' },
    { id: 2, content: '정예준 학생 기분 상태 주시 필요', date: '2025-12-18', editDate: '2025-12-18', isPinned: false, student: '정예준' },
    { id: 3, content: '김서준 학생 방정식 개념 보충 필요', date: '2025-12-17', editDate: '2025-12-17', isPinned: false, student: '김서준' },
  ]);
  const [editingItem, setEditingItem] = useState(null);
  const [newContent, setNewContent] = useState('');

  const currentItems = activeTab === 'notice' ? notices : memos;
  const setCurrentItems = activeTab === 'notice' ? setNotices : setMemos;

  const handleAdd = () => {
    if (!newContent.trim()) return;
    const today = new Date().toISOString().split('T')[0];
    setCurrentItems([{ id: Date.now(), content: newContent, date: today, editDate: today, isPinned: false }, ...currentItems]);
    setNewContent('');
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setNewContent(item.content);
  };

  const handleUpdate = () => {
    if (!newContent.trim()) return;
    const today = new Date().toISOString().split('T')[0];
    setCurrentItems(currentItems.map(n => n.id === editingItem.id ? { ...n, content: newContent, editDate: today } : n));
    setNewContent('');
    setEditingItem(null);
  };

  const handleDelete = (id) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      setCurrentItems(currentItems.filter(n => n.id !== id));
    }
  };

  const handleTogglePin = (id) => {
    setCurrentItems(currentItems.map(n => n.id === id ? { ...n, isPinned: !n.isPinned } : n));
  };

  // 메모 필터링 (학생 필터가 있는 경우)
  const filteredMemos = studentFilter
    ? memos.filter(m => m.student === studentFilter)
    : memos;

  return (
    <div className="p-6 bg-gray-50 min-h-screen overflow-auto" style={{ fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      {/* 브레드크럼 + 헤더 */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
          <button onClick={onClose} className="hover:text-blue-500">홈</button>
          <span>/</span>
          <span className="text-blue-500">노트</span>
          {studentFilter && (
            <>
              <span>/</span>
              <span className="text-blue-500">{studentFilter}</span>
            </>
          )}
        </div>
        <h1 className="text-2xl font-bold text-gray-800">📝 노트</h1>
      </div>

      {/* 탭 카드 */}
      <div className="bg-white rounded-3xl" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
        {/* 탭 헤더 */}
        <div className="flex gap-1 border-b border-gray-200 px-6 pt-4">
          <button
            onClick={() => { setActiveTab('notice'); setEditingItem(null); setNewContent(''); setStudentFilter(null); }}
            className={`px-4 py-3 text-sm font-medium transition-all relative ${
              activeTab === 'notice'
                ? 'text-gray-800'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="flex items-center gap-2">
              🚩 알림장
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">{notices.length}</span>
            </span>
            {activeTab === 'notice' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>
            )}
          </button>
          <button
            onClick={() => { setActiveTab('memo'); setEditingItem(null); setNewContent(''); }}
            className={`px-4 py-3 text-sm font-medium transition-all relative ${
              activeTab === 'memo'
                ? 'text-gray-800'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="flex items-center gap-2">
              🔒 메모장
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{filteredMemos.length}</span>
            </span>
            {activeTab === 'memo' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>
            )}
          </button>
        </div>

        {/* 공개 범위 안내 */}
        <div className={`px-6 py-3 ${activeTab === 'notice' ? 'bg-blue-50' : 'bg-yellow-50'}`}>
          <div className="flex items-center gap-2 text-sm">
            {activeTab === 'notice' ? (
              <>
                <span className="text-blue-500">👁️</span>
                <span className="text-blue-700">알림장은 <strong>학생에게 공개</strong>됩니다.</span>
              </>
            ) : (
              <>
                <span className="text-yellow-600">🔒</span>
                <span className="text-yellow-800">메모장은 <strong>선생님만</strong> 볼 수 있습니다. (학생 비공개)</span>
                {studentFilter && (
                  <span className="ml-2 px-2 py-0.5 bg-yellow-200 text-yellow-800 rounded-full text-xs">
                    {studentFilter} 학생 필터
                    <button onClick={() => setStudentFilter(null)} className="ml-1 hover:text-yellow-900">✕</button>
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        {/* 본문 */}
        <div className="p-6">
          {/* 새 글 등록/수정 영역 */}
          <div className={`rounded-2xl p-5 mb-6 ${activeTab === 'notice' ? 'bg-blue-50' : 'bg-gray-50'}`}>
            <h3 className="font-semibold text-gray-700 mb-3">
              {editingItem ? (activeTab === 'notice' ? '알림장 수정' : '메모 수정') : (activeTab === 'notice' ? '새 알림장 등록' : '새 메모 등록')}
            </h3>
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder={activeTab === 'notice' ? '학생들에게 전달할 알림장 내용을 입력하세요...' : '비공개 메모를 입력하세요...'}
              className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3 resize-none bg-white"
              rows={3}
            />
            <div className="flex gap-2">
              <button
                onClick={editingItem ? handleUpdate : handleAdd}
                className="px-6 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all font-medium">
                {editingItem ? '수정 완료' : '등록하기'}
              </button>
              {editingItem && (
                <button
                  onClick={() => { setEditingItem(null); setNewContent(''); }}
                  className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all font-medium">
                  취소
                </button>
              )}
            </div>
          </div>

          {/* 목록 - 노션 카드 스타일 */}
          <div className="space-y-3">
            {(activeTab === 'memo' ? filteredMemos : currentItems).sort((a, b) => b.isPinned - a.isPinned).map((item) => (
              <div key={item.id} className={`p-5 rounded-2xl border transition-all hover:shadow-md ${
                item.isPinned
                  ? (activeTab === 'notice' ? 'bg-blue-50 border-blue-200' : 'bg-yellow-50 border-yellow-200')
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {item.isPinned && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        activeTab === 'notice' ? 'bg-blue-200 text-blue-700' : 'bg-yellow-200 text-yellow-700'
                      }`}>
                        📌 고정됨
                      </span>
                    )}
                    {activeTab === 'memo' && item.student && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-gray-200 text-gray-700">
                        👤 {item.student}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleTogglePin(item.id)}
                      className="text-sm text-gray-500 hover:text-gray-700 font-medium transition-all">
                      {item.isPinned ? '고정 해제' : '📌 고정'}
                    </button>
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-sm text-blue-500 hover:text-blue-600 font-medium transition-all">
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-sm text-red-500 hover:text-red-600 font-medium transition-all">
                      삭제
                    </button>
                  </div>
                </div>
                <p className="text-gray-800 font-medium mb-3 text-lg">{item.content}</p>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span>📅 등록: {item.date}</span>
                  <span>✏️ 수정: {item.editDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// feature: home.reward.history
// mappingStatus: Existing
// apiCandidates: GET /tch/reward/list, GET /tch/reward/status, POST /tch/reward/update
// 리워드 히스토리 전체 화면 페이지
const RewardHistoryPage = ({ onClose }) => {
  const [studentRewards, setStudentRewards] = useState(
    studentsData.map(student => ({
      ...student,
      history: rewardHistory[student.name] || []
    }))
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('no'); // 'no', 'name', 'reward-asc', 'reward-desc'

  const updateReward = (studentName, delta) => {
    setStudentRewards(prev =>
      prev.map(student =>
        student.name === studentName
          ? { ...student, reward: Math.max(0, student.reward + delta) }
          : student
      )
    );
  };

  // 필터 및 정렬된 학생 목록
  const filteredStudents = studentRewards
    .filter(s => s.name.includes(searchQuery))
    .sort((a, b) => {
      if (sortOrder === 'name') return a.name.localeCompare(b.name);
      if (sortOrder === 'reward-asc') return a.reward - b.reward;
      if (sortOrder === 'reward-desc') return b.reward - a.reward;
      return a.no - b.no;
    });

  return (
    <div className="p-6 bg-gray-50 min-h-screen overflow-auto" style={{ fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      {/* 브레드크럼 + 헤더 */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
          <button onClick={onClose} className="hover:text-blue-500">홈</button>
          <span>/</span>
          <button onClick={onClose} className="hover:text-blue-500">우리 반</button>
          <span>/</span>
          <span className="text-blue-500">리워드 관리</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-gray-800">🏆 리워드 관리</h1>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="🔍 학생 검색"
              className="px-4 py-2 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-44 border border-gray-200"
            />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-4 py-2 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200"
            >
              <option value="no">번호순</option>
              <option value="name">이름순</option>
              <option value="reward-desc">리워드 높은순</option>
              <option value="reward-asc">리워드 낮은순</option>
            </select>
            <div className="text-sm text-gray-500">전체 {studentsData.length}명</div>
          </div>
        </div>
      </div>

      {/* 본문 */}
      <div className="space-y-4">
          {filteredStudents.map((student) => (
            <div key={student.no} className="bg-white rounded-2xl border border-gray-200 overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)' }}>
              {/* 학생 기본 정보 */}
              <div className="flex items-center justify-between p-5 bg-gray-50">
                <div className="flex items-center gap-4">
                  <span className="text-gray-400 font-medium">No.{student.no}</span>
                  <span className="text-lg font-bold text-gray-800">{student.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateReward(student.name, -1)}
                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-white hover:bg-gray-100 text-gray-600 font-bold border border-gray-300 transition-all">
                    -
                  </button>
                  <span className="text-red-400 font-bold text-xl min-w-[100px] text-center">❤️ {student.reward}</span>
                  <button
                    onClick={() => updateReward(student.name, 1)}
                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-bold transition-all">
                    +
                  </button>
                </div>
              </div>

              {/* 히스토리 */}
              <div className="p-5">
                {student.history.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 px-3 text-sm font-semibold text-gray-400">날짜</th>
                          <th className="text-left py-2 px-3 text-sm font-semibold text-gray-400">내용</th>
                          <th className="text-right py-2 px-3 text-sm font-semibold text-gray-400">포인트</th>
                        </tr>
                      </thead>
                      <tbody>
                        {student.history.map((item, idx) => (
                          <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-3 text-sm text-gray-500">{item.date}</td>
                            <td className="py-3 px-3 text-sm text-gray-700">{item.action}</td>
                            <td className={`py-3 px-3 text-sm text-right font-bold ${item.points > 0 ? 'text-blue-500' : 'text-red-500'}`}>
                              {item.points > 0 ? '+' : ''}{item.points}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">리워드 히스토리가 없습니다</div>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

// feature: home.class.studentMemo
// mappingStatus: Existing (student filter param needed)
// apiCandidates: GET /tch/dsbd/memo/list, POST /tch/dsbd/memo/save
// 학생별 메모 페이지 - 노트 페이지(메모장 탭)와 연동
const StudentMemoPage = ({ student, onClose, onOpenNotePage }) => {
  const [memos, setMemos] = useState(studentMemos[student.name] || []);
  const [isAdding, setIsAdding] = useState(false);
  const [newMemo, setNewMemo] = useState('');

  const handleAddMemo = () => {
    if (!newMemo.trim()) return;
    const today = new Date().toISOString().split('T')[0];
    setMemos([{ date: today, content: newMemo }, ...memos]);
    setNewMemo('');
    setIsAdding(false);
  };

  // 📌 클릭 시 노트 페이지의 메모장 탭으로 이동 (해당 학생 필터)
  const handleGoToNotePage = () => {
    if (onOpenNotePage) {
      onOpenNotePage('memo', student.name);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen overflow-auto" style={{ fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      {/* 브레드크럼 + 헤더 */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
          <button onClick={onClose} className="hover:text-blue-500">홈</button>
          <span>/</span>
          <button onClick={onClose} className="hover:text-blue-500">우리 반</button>
          <span>/</span>
          <span className="text-blue-500">{student.name} 메모</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">📝 {student.name}</h1>
            <p className="text-sm text-gray-500 mt-1">1학년 3반 · {student.no}번</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleGoToNotePage}
              className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-medium text-sm">
              📌 노트 페이지에서 보기
            </button>
            <button
              onClick={() => setIsAdding(true)}
              className="px-5 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all font-medium">
              + 메모 추가
            </button>
          </div>
        </div>
      </div>

      {/* 안내 메시지 */}
      <div className="bg-yellow-50 rounded-xl px-4 py-3 mb-6">
        <p className="text-sm text-yellow-700">
          🔒 이 메모는 선생님만 볼 수 있으며, 학생에게 공개되지 않습니다.
        </p>
      </div>

      {/* 본문 */}
      <div className="bg-white rounded-3xl p-6" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
        {isAdding ? (
          <div className="bg-blue-50 rounded-2xl p-6 mb-6">
            <h3 className="font-semibold text-gray-700 mb-3">새 메모 작성</h3>
            <textarea
              value={newMemo}
              onChange={(e) => setNewMemo(e.target.value)}
              placeholder="메모 내용을 입력하세요..."
              className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3 resize-none"
              rows={5}
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddMemo}
                className="px-6 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all font-medium">
                저장하기
              </button>
              <button
                onClick={() => { setIsAdding(false); setNewMemo(''); }}
                className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all font-medium">
                취소
              </button>
            </div>
          </div>
        ) : null}

        {/* 메모 목록 */}
        <div className="space-y-4">
          {memos.length > 0 ? (
            memos.map((memo, idx) => (
              <div key={idx} className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-400">📅 {memo.date}</span>
                </div>
                <p className="text-gray-800 whitespace-pre-wrap">{memo.content}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📝</div>
              <div className="text-gray-500 font-medium">아직 메모가 없습니다</div>
              <div className="text-gray-400 text-sm mt-2">{student.name} 학생에 대한 메모를 작성해보세요</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// feature: home.calendar.month
// mappingStatus: Existing
// apiCandidates: GET /tch/dsbd/calendar/list, GET /tch/dsbd/calendar/detail
// 한 달 캘린더 모달
const MonthCalendar = ({ onClose }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  /*
    NOTE: detail 값 표시 정책
    - "수업" 타입만 detail 값 표시 (단원 정보/목차만 표시)
    - 예: "1. 큰 수 > 십만, 백만 알아보기"
    - 숙제, 시험 등 다른 타입은 detail 값 없음
  */
  const events = [
    { id: 1, date: 17, title: '수학 4-1', type: '수업', status: '완료', color: 'bg-blue-50 text-blue-600', detail: '1. 큰 수 > 십만, 백만 알아보기' },
    { id: 2, date: 19, title: '독후감 마감', type: '숙제', status: 'D-Day', color: 'bg-emerald-50 text-emerald-600' },
    { id: 3, date: 20, title: '수학 단원시험', type: '시험', status: 'D-1', color: 'bg-indigo-50 text-indigo-600' },
    { id: 4, date: 15, title: '과제 제출', type: '숙제', status: '완료', color: 'bg-emerald-50 text-emerald-600' },
    { id: 5, date: 30, title: '학부모 상담', type: '기타', status: '할 일', color: 'bg-gray-100 text-gray-600' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{ fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      <div className="bg-white rounded-3xl w-full max-w-6xl h-[90vh] flex flex-col" style={{ boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)' }}>
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📅</span>
            <h2 className="text-2xl font-bold text-gray-800">2025년 8월</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">✕</button>
        </div>

        {/* 본문 */}
        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['일', '월', '화', '수', '목', '금', '토'].map((day, idx) => (
              <div key={idx} className="text-center font-semibold text-gray-400 py-2">{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }, (_, i) => {
              const date = i - 3 + 1; // 8월 1일이 금요일이므로 4칸 뒤에 시작
              const isValidDate = date >= 1 && date <= 31;
              const dayEvents = events.filter(e => e.date === date);

              return (
                <div key={i} className={`min-h-28 p-2 rounded-xl border ${isValidDate ? 'bg-white border-gray-200 hover:border-blue-300' : 'bg-gray-50 border-transparent'}`}>
                  {isValidDate && (
                    <>
                      <div className={`text-sm font-semibold mb-2 ${date === 19 ? 'text-blue-500' : 'text-gray-600'}`}>{date}</div>
                      <div className="space-y-1">
                        {dayEvents.map((event) => (
                          <button
                            key={event.id}
                            onClick={() => setSelectedEvent(event)}
                            className={`w-full text-xs px-2 py-1 rounded-lg text-left ${event.color} hover:opacity-80 transition-all`}>
                            {event.title}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* 상세 정보 */}
          {selectedEvent && (
            <div className="mt-6 p-5 bg-blue-50 rounded-2xl">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-800">{selectedEvent.title}</h3>
                <button onClick={() => setSelectedEvent(null)} className="text-gray-400 hover:text-gray-600">✕</button>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">날짜:</span>
                  <span>8월 {selectedEvent.date}일</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">유형:</span>
                  <span>{selectedEvent.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">상태:</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${selectedEvent.color}`}>{selectedEvent.status}</span>
                </div>
                {selectedEvent.detail && (
                  <div className="flex items-start gap-2 pt-2">
                    <span className="font-semibold">상세:</span>
                    <span>{selectedEvent.detail}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// feature: home.recentActivity.calendar
// mappingStatus: Existing
// apiCandidates: GET /tch/dsbd/calendar/list, GET /tch/dsbd/calendar/detail
// 최근 활동 전체화면 페이지 (캘린더 UI)
const RecentActivityPage = ({ onClose }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  /*
    NOTE: detail 값 표시 정책
    - "수업" 타입만 detail 값 표시 (단원 정보/목차만 표시)
    - 예: "1. 큰 수 > 십만, 백만 알아보기", "3. 물질의 상태 > 물의 상태 변화"
    - 숙제, 시험 등 다른 타입은 detail 값 없음
  */
  const events = [
    { id: 1, date: 17, title: '수학 4-1', type: '수업', status: '완료', color: 'bg-blue-50 text-blue-600', detail: '1. 큰 수 > 십만, 백만 알아보기', icon: '📚' },
    { id: 2, date: 18, title: '국어 3-2', type: '수업', status: '완료', color: 'bg-blue-50 text-blue-600', detail: '2. 마음을 전하는 글 > 시 감상하기', icon: '📚' },
    { id: 3, date: 18, title: '독후감 제출', type: '숙제', status: '하는 중', color: 'bg-emerald-50 text-emerald-600', icon: '✏️' },
    { id: 4, date: 19, title: '독후감 마감', type: '숙제', status: 'D-Day', color: 'bg-emerald-50 text-emerald-600', icon: '✏️' },
    { id: 5, date: 20, title: '수학 단원시험', type: '시험', status: 'D-1', color: 'bg-indigo-50 text-indigo-600', icon: '📝' },
    { id: 6, date: 15, title: '1단원 형성평가', type: '시험', status: '완료', color: 'bg-indigo-50 text-indigo-600', icon: '📝' },
    { id: 7, date: 12, title: '수학 문제풀이', type: '숙제', status: '할 일', color: 'bg-emerald-50 text-emerald-600', icon: '✏️' },
    { id: 8, date: 12, title: '과학 3-1', type: '수업', status: '완료', color: 'bg-blue-50 text-blue-600', detail: '3. 물질의 상태 > 물의 상태 변화', icon: '🔬' },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen overflow-auto" style={{ fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      {/* 브레드크럼 + 헤더 */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
          <button onClick={onClose} className="hover:text-blue-500">홈</button>
          <span>/</span>
          <span className="text-blue-500">최근 활동</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            📅 최근 활동
          </h1>
          <div className="text-sm text-gray-500">전체 {events.length}개</div>
        </div>
      </div>

      {/* 캘린더 */}
      <div className="bg-white rounded-3xl p-6" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
        {/* 월 표시 */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">2025년 12월</h2>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-gray-500 hover:bg-gray-100 rounded-lg">◀ 이전</button>
            <button className="px-3 py-1.5 text-gray-500 hover:bg-gray-100 rounded-lg">다음 ▶</button>
          </div>
        </div>

        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['일', '월', '화', '수', '목', '금', '토'].map((day, idx) => (
            <div key={idx} className={`text-center font-semibold py-2 ${idx === 0 ? 'text-red-400' : idx === 6 ? 'text-blue-400' : 'text-gray-400'}`}>{day}</div>
          ))}
        </div>

        {/* 캘린더 그리드 */}
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 35 }, (_, i) => {
            const date = i - 0 + 1; // 12월 1일이 월요일이므로 1칸 뒤에 시작
            const isValidDate = date >= 1 && date <= 31;
            const dayEvents = events.filter(e => e.date === date);
            const isToday = date === 19;

            return (
              <div key={i} className={`min-h-28 p-2 rounded-xl border transition-all ${
                isValidDate
                  ? isToday
                    ? 'bg-blue-50 border-blue-300'
                    : 'bg-white border-gray-200 hover:border-blue-300'
                  : 'bg-gray-50 border-transparent'
              }`}>
                {isValidDate && (
                  <>
                    <div className={`text-sm font-semibold mb-2 ${isToday ? 'text-blue-500' : 'text-gray-600'}`}>
                      {date}
                      {isToday && <span className="ml-1 text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded">오늘</span>}
                    </div>
                    <div className="space-y-1">
                      {dayEvents.slice(0, 2).map((event) => (
                        <button
                          key={event.id}
                          onClick={() => setSelectedEvent(event)}
                          className={`w-full text-xs px-2 py-1 rounded-lg text-left ${event.color} hover:opacity-80 transition-all truncate`}>
                          {event.icon} {event.title}
                        </button>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-gray-400 pl-2">+{dayEvents.length - 2}개 더</div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* 상세 정보 */}
        {selectedEvent && (
          <div className="mt-6 p-5 bg-blue-50 rounded-2xl">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <span className="text-2xl">{selectedEvent.icon}</span>
                {selectedEvent.title}
              </h3>
              <button onClick={() => setSelectedEvent(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="font-semibold">날짜:</span>
                <span>12월 {selectedEvent.date}일</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">유형:</span>
                <span>{selectedEvent.type}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">상태:</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${selectedEvent.color}`}>{selectedEvent.status}</span>
              </div>
              {selectedEvent.detail && (
                <div className="flex items-start gap-2 pt-2">
                  <span className="font-semibold">상세:</span>
                  <span>{selectedEvent.detail}</span>
                </div>
              )}
            </div>
            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all text-sm font-medium">
              바로 가기 →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// feature: home.class.chat.detail
// mappingStatus: Needs new API
// [Needs new API] UI/UX 검증용 임시 기능 (API 없음)
const StudentChatPage = ({ student, onBack, onViewAll, messages, setMessages }) => {
  const [newMessage, setNewMessage] = useState('');
  const studentMessages = messages[student.name] || [];

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    const now = new Date();
    const timeStr = `${now.getMonth() + 1}/${now.getDate()} ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const newMsg = {
      id: Date.now(),
      text: newMessage,
      time: timeStr,
      from: 'teacher'
    };
    
    setMessages({
      ...messages,
      [student.name]: [...studentMessages, newMsg]
    });
    setNewMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50" style={{ fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      {/* 헤더 */}
      <div className="bg-white px-6 py-4" style={{ boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-xl transition-all"
            >
              ← 뒤로
            </button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg"
                style={{ boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)' }}>
                {student.name.charAt(0)}
              </div>
              <div>
                <div className="font-bold text-gray-800 text-lg">{student.name}</div>
                <div className="text-sm text-gray-500">1학년 3반 · {student.no}번</div>
              </div>
            </div>
          </div>
          <button 
            onClick={onViewAll}
            className="px-5 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all font-medium"
            style={{ boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }}
          >
            📋 전체 보기
          </button>
        </div>
      </div>

      {/* 채팅 영역 */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl mx-auto space-y-4">
          {studentMessages.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-7xl mb-4">💬</div>
              <div className="text-gray-500 font-medium">아직 메시지가 없습니다</div>
              <div className="text-gray-400 text-sm mt-2">{student.name} 학생에게 첫 메시지를 보내보세요!</div>
            </div>
          ) : (
            studentMessages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.from === 'teacher' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md`}>
                  <div className={`px-4 py-3 rounded-2xl ${
                    msg.from === 'teacher' 
                      ? 'bg-blue-500 text-white rounded-br-md' 
                      : 'bg-white text-gray-800 rounded-bl-md'
                  }`}
                  style={{ boxShadow: msg.from === 'teacher' ? '0 4px 12px rgba(59, 130, 246, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.06)' }}>
                    {msg.text}
                  </div>
                  <div className={`text-xs text-gray-400 mt-1.5 ${msg.from === 'teacher' ? 'text-right' : 'text-left'}`}>
                    {msg.time}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 입력 영역 */}
      <div className="bg-white px-6 py-4" style={{ boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.05)' }}>
        <div className="max-w-2xl mx-auto flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`${student.name} 학생에게 메시지 보내기...`}
            className="flex-1 px-5 py-3.5 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
          <button 
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="px-6 py-3.5 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }}
          >
            보내기
          </button>
        </div>
      </div>
    </div>
  );
};

// feature: home.class.chat.list
// mappingStatus: Needs new API
// [Needs new API] UI/UX 검증용 임시 기능 (API 없음)
// 전체 메시지 히스토리 페이지
const AllMessagesPage = ({ onBack, onSelectStudent, messages }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const getLastMessage = (studentName) => {
    const msgs = messages[studentName] || [];
    return msgs[msgs.length - 1];
  };

  // 검색 필터 적용
  const filteredStudents = studentsData.filter(s => s.name.includes(searchQuery));
  const studentsWithMessages = filteredStudents.filter(s => messages[s.name] && messages[s.name].length > 0);
  const studentsWithoutMessages = filteredStudents.filter(s => !messages[s.name] || messages[s.name].length === 0);

  return (
    <div className="p-6 bg-gray-50 min-h-screen overflow-auto" style={{ fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      {/* 브레드크럼 + 헤더 */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
          <button onClick={onBack} className="hover:text-blue-500">홈</button>
          <span>/</span>
          <button onClick={onBack} className="hover:text-blue-500">우리 반</button>
          <span>/</span>
          <span className="text-blue-500">메시지</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">💬 메시지</h1>
            <p className="text-sm text-gray-500 mt-1">1학년 3반 학생들과의 대화</p>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="🔍 학생 검색"
              className="px-4 py-2 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-44 border border-gray-200"
            />
            <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-xl border border-gray-200">
              대화 중인 학생: <span className="font-bold text-blue-500">{studentsWithMessages.length}명</span> / 전체 {filteredStudents.length}명
            </div>
          </div>
        </div>
      </div>

      {/* 메시지 목록 */}
      <div className="max-w-3xl">
          {/* 대화 있는 학생 */}
          {studentsWithMessages.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-400 mb-3 px-2">최근 대화</h3>
              <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)' }}>
                {studentsWithMessages.map((student, idx) => {
                  const lastMsg = getLastMessage(student.name);
                  return (
                    <button
                      key={student.no}
                      onClick={() => onSelectStudent(student)}
                      className={`w-full flex items-center gap-4 px-5 py-4 hover:bg-blue-50 transition-all text-left ${
                        idx !== studentsWithMessages.length - 1 ? 'border-b border-gray-100' : ''
                      }`}
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center text-blue-600 font-bold">
                        {student.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-gray-800">{student.name}</span>
                          <span className="text-xs text-gray-400">{lastMsg?.time}</span>
                        </div>
                        <div className="text-sm text-gray-500 truncate">
                          {lastMsg?.from === 'teacher' && <span className="text-blue-500">나: </span>}
                          {lastMsg?.text}
                        </div>
                      </div>
                      <div className="text-gray-300 text-lg">→</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 대화 없는 학생 */}
          {studentsWithoutMessages.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-400 mb-3 px-2">새 대화 시작</h3>
              <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)' }}>
                {studentsWithoutMessages.map((student, idx) => (
                  <button
                    key={student.no}
                    onClick={() => onSelectStudent(student)}
                    className={`w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-all text-left ${
                      idx !== studentsWithoutMessages.length - 1 ? 'border-b border-gray-100' : ''
                    }`}
                  >
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 font-bold">
                      {student.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">{student.name}</div>
                      <div className="text-sm text-gray-400">대화 시작하기</div>
                    </div>
                    <div className="text-gray-200 text-lg">→</div>
                  </button>
                ))}
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

// feature: home.today
// mappingStatus: Compose
// apiCandidates: GET /tch/dsbd/status/leaningSummary/statistics/math, GET /tch/dsbd/calendar/list, GET /tch/dsbd/notice/list
// 오늘 페이지 - Nano Banana 스타일
const TodayPage = ({ onOpenNotePage, onOpenRecentActivityPage }) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [activitySlide, setActivitySlide] = useState(0);

  // 활동 현황 데이터
  const activityStatusData = [
    { title: '1단원 팝업퀴즈', deadline: '~12/26', rate: 75, completed: 21, total: 28, hasIssue: true, issueCount: 7, issueNames: '이하은, 정예준 외 5명' },
    { title: '독후감 제출', deadline: '~12/24', rate: 100, completed: 28, total: 28, hasIssue: false },
    { title: '수학 단원시험', deadline: '~12/27', rate: 60, completed: 17, total: 28, hasIssue: true, issueCount: 11, issueNames: '박도윤, 윤서연 외 9명' },
  ];

  // 바로가기 드롭다운 데이터
  const todoDropdowns = {
    grading: [
      { label: '수학 4-1 수업 채점', type: '시험' },
      { label: '독후감 채점', type: '숙제' },
    ],
    deadline: [
      { label: '수학 단원시험 마감 연장', type: '시험' },
    ],
    today: [
      { label: '독후감 마감 관리', type: '숙제' },
    ],
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen overflow-auto" style={{ fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      {/* 헤더 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
        <div>
          <div className="text-sm text-gray-400 mb-1">홈 / <span className="text-blue-500">오늘</span></div>
          <h1 className="text-2xl font-bold text-gray-800">안녕하세요, 윤지명 선생님! 👋</h1>
        </div>
        <div className="flex items-center gap-2 text-gray-500 bg-white px-4 py-2.5 rounded-xl" style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)' }}>
          <span>📅</span>
          <span className="font-medium">2025.12.19 (금)</span>
        </div>
      </div>

      {/* 오늘의 할 일 */}
      {/* [Needs new API] UI/UX 검증용 임시 기능 (API 없음) */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">📌</span>
          <span className="font-bold text-gray-800">오늘의 할 일</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl cursor-pointer hover:shadow-lg transition-all relative" style={{ boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)' }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-3 h-3 bg-red-400 rounded-full"></span>
              <span className="font-medium text-gray-600">채점 필요</span>
            </div>
            <div className="text-4xl font-bold text-gray-800 mb-3">2<span className="text-lg font-normal text-gray-400 ml-1">건</span></div>
            <div className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'grading' ? null : 'grading')}
                className="text-sm text-blue-500 hover:text-blue-600 font-medium">
                바로가기 →
              </button>
              {openDropdown === 'grading' && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 z-10 overflow-hidden">
                  {todoDropdowns.grading.map((item, idx) => (
                    <button key={idx} className="w-full text-left px-4 py-3 hover:bg-blue-50 flex items-center gap-2 text-sm border-b border-gray-50 last:border-0">
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">{item.type}</span>
                      <span className="text-gray-700">{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl cursor-pointer hover:shadow-lg transition-all relative" style={{ boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)' }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-3 h-3 bg-orange-400 rounded-full"></span>
              <span className="font-medium text-gray-600">마감 임박</span>
            </div>
            <div className="text-4xl font-bold text-gray-800 mb-3">1<span className="text-lg font-normal text-gray-400 ml-1">건</span></div>
            <div className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'deadline' ? null : 'deadline')}
                className="text-sm text-blue-500 hover:text-blue-600 font-medium">
                바로가기 →
              </button>
              {openDropdown === 'deadline' && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 z-10 overflow-hidden">
                  {todoDropdowns.deadline.map((item, idx) => (
                    <button key={idx} className="w-full text-left px-4 py-3 hover:bg-blue-50 flex items-center gap-2 text-sm border-b border-gray-50 last:border-0">
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">{item.type}</span>
                      <span className="text-gray-700">{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl cursor-pointer hover:shadow-lg transition-all relative" style={{ boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)' }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-3 h-3 bg-blue-400 rounded-full"></span>
              <span className="font-medium text-gray-600">오늘 활동</span>
            </div>
            <div className="text-4xl font-bold text-gray-800 mb-3">1<span className="text-lg font-normal text-gray-400 ml-1">건</span></div>
            <div className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'today' ? null : 'today')}
                className="text-sm text-blue-500 hover:text-blue-600 font-medium">
                바로가기 →
              </button>
              {openDropdown === 'today' && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 z-10 overflow-hidden">
                  {todoDropdowns.today.map((item, idx) => (
                    <button key={idx} className="w-full text-left px-4 py-3 hover:bg-blue-50 flex items-center gap-2 text-sm border-b border-gray-50 last:border-0">
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">{item.type}</span>
                      <span className="text-gray-700">{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 활동 현황 - 슬라이드 형태 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">📊</span>
            <span className="font-bold text-gray-800">활동 현황</span>
            <span className="text-sm text-gray-400 ml-2">{activitySlide + 1} / {activityStatusData.length}</span>
          </div>
          {activityStatusData.length > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActivitySlide(prev => Math.max(0, prev - 1))}
                disabled={activitySlide === 0}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                ←
              </button>
              <button
                onClick={() => setActivitySlide(prev => Math.min(activityStatusData.length - 1, prev + 1))}
                disabled={activitySlide === activityStatusData.length - 1}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                →
              </button>
            </div>
          )}
        </div>
        <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)' }}>
          {activityStatusData[activitySlide] && (
            <>
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-gray-700">{activityStatusData[activitySlide].title}</span>
                <span className="text-xs text-gray-400">{activityStatusData[activitySlide].deadline}</span>
              </div>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">제출률</span>
                  <span className={`font-bold text-lg ${activityStatusData[activitySlide].rate === 100 ? 'text-green-500' : 'text-blue-500'}`}>
                    {activityStatusData[activitySlide].rate}%
                  </span>
                </div>
                <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${activityStatusData[activitySlide].rate === 100 ? 'bg-gradient-to-r from-green-400 to-green-500' : 'bg-gradient-to-r from-blue-400 to-blue-500'}`}
                    style={{ width: `${activityStatusData[activitySlide].rate}%` }}
                  ></div>
                </div>
                <div className="text-right text-sm text-gray-400 mt-2">
                  {activityStatusData[activitySlide].completed}/{activityStatusData[activitySlide].total}명 제출 완료
                </div>
              </div>
              {activityStatusData[activitySlide].hasIssue ? (
                <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl">
                  <div>
                    <span className="text-red-500 font-medium text-sm">⚠️ 미제출 {activityStatusData[activitySlide].issueCount}명</span>
                    <p className="text-xs text-red-400 mt-1">{activityStatusData[activitySlide].issueNames}</p>
                  </div>
                  <button
                    onClick={() => alert('알림 발송이 완료되었습니다.')}
                    className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 transition-all"
                    style={{ boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)' }}>
                    알림 보내기
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center p-4 bg-green-50 rounded-xl">
                  <span className="text-green-600 font-medium text-sm">✅ 전체 제출 완료</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* 중간 영역 */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
        {/* 이번 주 일정 */}
        <div className="col-span-1 md:col-span-3 bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)' }}>
          <div className="flex items-center gap-2 mb-4">
            <span>📅</span>
            <span className="font-semibold text-gray-700">이번 주 일정</span>
          </div>
          <div className="flex justify-between mb-5 px-2">
            {[
              { day: '월', date: 16, event: null },
              { day: '화', date: 17, event: 'blue' },
              { day: '수', date: 18, event: 'yesterday' },
              { day: '목', date: 19, event: 'today' },
              { day: '금', date: 20, event: 'tomorrow' },
            ].map((d, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="text-sm text-gray-400 mb-2">{d.day}</div>
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-semibold ${
                    d.event === 'today' ? 'bg-blue-500 text-white' :
                    d.event === 'yesterday' || d.event === 'tomorrow' ? 'bg-blue-100 text-blue-500' :
                    d.event === 'blue' ? 'bg-blue-100 text-blue-500' :
                    'bg-gray-50 text-gray-400'
                  }`}>
                  {d.date}
                </div>
              </div>
            ))}
          </div>
          {/* -1, 오늘, +1 일정 고정 노출 */}
          <div className="space-y-2 border-t border-gray-100 pt-4">
            <div className="text-xs text-gray-400 mb-2">조회일 기준 ±1일 일정</div>
            <button
              onClick={() => {/* TODO: 어제 일정 상세 */}}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all">
              <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
              <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-medium">어제</span>
              <span className="text-sm text-gray-500">수 12/18</span>
              <span className="font-medium text-gray-600">수학 4-1 수업 완료</span>
              <span className="ml-auto text-sm text-blue-500 font-medium">바로 가기</span>
            </button>
            <button
              onClick={() => {/* TODO: 오늘 일정 상세 */}}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-green-50 hover:bg-green-100 transition-all">
              <span className="w-3 h-3 bg-green-400 rounded-full"></span>
              <span className="text-xs bg-green-200 text-green-700 px-2 py-0.5 rounded-full font-medium">오늘</span>
              <span className="text-sm text-gray-500">목 12/19</span>
              <span className="font-medium text-gray-700">독후감 마감</span>
              <span className="ml-auto text-sm text-blue-500 font-medium">바로 가기</span>
            </button>
            <button
              onClick={() => {/* TODO: 내일 일정 상세 */}}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-orange-50 hover:bg-orange-100 transition-all">
              <span className="w-3 h-3 bg-orange-400 rounded-full"></span>
              <span className="text-xs bg-orange-200 text-orange-700 px-2 py-0.5 rounded-full font-medium">내일</span>
              <span className="text-sm text-gray-500">금 12/20</span>
              <span className="font-medium text-gray-700">수학 단원시험</span>
              <span className="ml-auto text-sm text-blue-500 font-medium">바로 가기</span>
            </button>
          </div>
        </div>

        {/* 알림장 */}
        <div className="col-span-1 md:col-span-2 bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)' }}>
          <div className="flex items-center gap-2 mb-4">
            <span>🚩</span>
            <span className="font-semibold text-gray-700">알림장</span>
          </div>
          <div className="bg-yellow-50 rounded-2xl p-5 mb-4 flex flex-col items-center justify-center min-h-32">
            <span className="text-3xl mb-2">📝</span>
            <p className="text-gray-700 font-medium text-center">"4단원 스스로 학습 풀기"</p>
            <p className="text-sm text-gray-400 mt-1">오늘 등록됨</p>
          </div>
          <button
            onClick={() => onOpenNotePage && onOpenNotePage('notice')}
            className="w-full py-3 text-sm text-blue-500 hover:text-blue-600 font-medium border border-blue-200 rounded-xl hover:bg-blue-50 transition-all flex items-center justify-center gap-1">
            ✏️ 수정하기
          </button>
        </div>
      </div>

      {/* 하단 영역 - 최근 활동 (유튜브 스타일) */}
      {/* [Needs new API] UI/UX 검증용 임시 기능 (API 없음) */}
      <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span>🕐</span>
            <span className="font-semibold text-gray-700">최근 활동</span>
          </div>
          <button
            onClick={() => onOpenRecentActivityPage && onOpenRecentActivityPage()}
            className="text-sm text-blue-500 hover:text-blue-600 font-medium">더보기 →</button>
        </div>
        {/* 유튜브 스타일 카드 그리드 */}
        {/*
          NOTE: sub 값 표시 정책
          - "교과서", "수업" 타입만 sub 값 표시 (단원 정보/목차만 표시)
          - 예: "1. 큰 수 > 십만, 백만 알아보기"
          - 숙제, 시험 등 다른 타입은 sub 값 없음
        */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
                { icon: '📚', type: '교과서', time: '어제', actionStatus: '수업', scheduleStatus: '끝', title: '수학 4-1', sub: '1. 큰 수 > 십만, 백만 알아보기', theme: 'blue' },
                { icon: '✏️', type: '숙제', time: '3일 전', actionStatus: '출제', scheduleStatus: '하는 중', title: '독후감 제출', theme: 'emerald' },
                { icon: '📝', type: '시험', time: '1주 전', actionStatus: '채점', scheduleStatus: '끝', title: '1단원 형성평가', theme: 'indigo' },
                { icon: '✏️', type: '숙제', time: '4일 전', actionStatus: '편집', scheduleStatus: '할 일', title: '수학 문제풀이', theme: 'emerald' },
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => {/* TODO: 상세 정보 보기 */}}
              className="flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-all text-left group p-4">
              {/* 정보 영역 */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{item.icon}</span>
                  <div className="font-bold text-gray-800 text-sm group-hover:text-blue-600 transition-colors line-clamp-1">
                    {item.title}
                  </div>
                </div>
                {item.sub && <div className="text-xs text-gray-500 mb-2 line-clamp-1">{item.sub}</div>}
                {/* 메타 정보 - [이모지/자료유형/날짜/자료상태/일정상태] */}
                <div className={`flex flex-wrap items-center gap-1 text-xs ${!item.sub ? 'mt-2' : ''}`}>
                  <span className="bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">{item.type}</span>
                  <span className="text-gray-400">{item.time}</span>
                  <span className={`px-1.5 py-0.5 rounded ${
                        item.actionStatus === '수업' ? 'bg-blue-50 text-blue-600' :
                        item.actionStatus === '출제' ? 'bg-emerald-50 text-emerald-600' :
                        item.actionStatus === '채점' ? 'bg-indigo-50 text-indigo-600' :
                        'bg-gray-100 text-gray-600'
                  }`}>{item.actionStatus}</span>
                  <span className={`px-1.5 py-0.5 rounded ${
                    item.scheduleStatus === '끝' ? 'bg-gray-100 text-gray-500' :
                        item.scheduleStatus === '하는 중' ? 'bg-blue-50 text-blue-600' :
                        'bg-amber-50 text-amber-600'
                  }`}>{item.scheduleStatus}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};

// feature: home.class
// mappingStatus: Compose
// apiCandidates: GET /v1/teacher/classInfo, GET /v1/teacher/classMemberInfo, GET /etc/tdymd/stnt/last/detail, GET /etc/meta/tc/need
// 우리 반 페이지 - Nano Banana 스타일
const ClassPage = ({ onOpenChat, onOpenAllMessages, onOpenNotePage, onOpenRewardPage }) => {

  return (
    <div className="p-6 bg-gray-50 min-h-screen overflow-auto" style={{ fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      {/* 헤더 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
        <div>
          <div className="text-sm text-gray-400 mb-1">홈 / <span className="text-blue-500">우리 반</span></div>
          <h1 className="text-2xl font-bold text-gray-800">우리 반 👨‍👩‍👧‍👦</h1>
        </div>
        <div className="flex items-center gap-2 text-gray-500 bg-white px-4 py-2.5 rounded-xl" style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)' }}>
          <span>🏫</span>
          <span className="font-medium">1학년 3반 (28명)</span>
        </div>
      </div>

        {/* 빠른 도구 */}
        {/* [Needs new API] UI/UX 검증용 임시 기능 (API 없음) */}
      <div className="bg-white rounded-3xl p-6 mb-6" style={{ boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)' }}>
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          <span className="text-sm font-medium text-gray-500">빠른 도구</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <button className="flex flex-col items-center justify-center gap-2 p-5 rounded-2xl bg-white border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all group">
            <span className="text-3xl group-hover:scale-110 transition-transform">🧠</span>
            <div className="text-center">
              <div className="font-semibold text-gray-700 text-sm group-hover:text-indigo-700">학습심리정서검사</div>
              <div className="text-xs text-gray-400 mt-1 group-hover:text-indigo-500">진행 중 3명</div>
            </div>
          </button>
          <button className="flex flex-col items-center justify-center gap-2 p-5 rounded-2xl bg-white border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all group">
            <span className="text-3xl group-hover:scale-110 transition-transform">😊</span>
            <div className="text-center">
              <div className="font-semibold text-gray-700 text-sm group-hover:text-blue-700">오늘의 기분</div>
              <div className="text-xs text-gray-400 mt-1 group-hover:text-blue-500">응답 25명</div>
            </div>
          </button>
          {/* 순서 변경: 목표 설정 → 마이룸 */}
          <button className="flex flex-col items-center justify-center gap-2 p-5 rounded-2xl bg-white border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50 transition-all group">
            <span className="text-3xl group-hover:scale-110 transition-transform">🎯</span>
            <div className="text-center">
              <div className="font-semibold text-gray-700 text-sm group-hover:text-emerald-700">목표 설정</div>
              <div className="text-xs text-gray-400 mt-1 group-hover:text-emerald-500">이번 주</div>
            </div>
          </button>
          <button className="flex flex-col items-center justify-center gap-2 p-5 rounded-2xl bg-white border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all group">
            <span className="text-3xl group-hover:scale-110 transition-transform">🏠</span>
            <div className="text-center">
              <div className="font-semibold text-gray-700 text-sm group-hover:text-blue-700">마이룸</div>
              <div className="text-xs text-gray-400 mt-1 group-hover:text-blue-500">꾸미기</div>
            </div>
          </button>
          <button className="flex flex-col items-center justify-center gap-2 p-5 rounded-2xl bg-white border border-gray-100 hover:border-amber-200 hover:bg-amber-50 transition-all group">
            <span className="text-3xl group-hover:scale-110 transition-transform">🏪</span>
            <div className="text-center">
              <div className="font-semibold text-gray-700 text-sm group-hover:text-amber-700">상점</div>
              <div className="text-xs text-gray-400 mt-1 group-hover:text-amber-500">리워드 사용</div>
            </div>
          </button>
        </div>
      </div>


      {/* 우리 반 요약 - 위험 요소 */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">⚠️</span>
          <span className="font-bold text-gray-800">우리 반 요약</span>
          <span className="text-xs text-gray-400 ml-2">주의가 필요한 학생</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 기분 나쁜 학생 top3 */}
          <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)' }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-8 h-8 bg-red-100 rounded-xl flex items-center justify-center text-lg">😢</span>
              <span className="font-semibold text-gray-700 text-sm">오늘 기분 나쁨</span>
            </div>
            <div className="space-y-2">
              {studentsData.filter(s => s.moodColor === 'bg-red-400' || s.moodColor === 'bg-gray-800').slice(0, 3).map((s, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">{s.name}</span>
                  <span className={`w-4 h-4 rounded-full ${s.moodColor}`}></span>
                </div>
              ))}
            </div>
          </div>

          {/* 시험/숙제 응시율 낮은 학생 top3 */}
          <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)' }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-8 h-8 bg-orange-100 rounded-xl flex items-center justify-center text-lg">📝</span>
              <span className="font-semibold text-gray-700 text-sm">시험/숙제 응시율 낮음</span>
            </div>
            <div className="space-y-2">
              {[...studentsData].sort((a, b) => a.testRate - b.testRate).slice(0, 3).map((s, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-orange-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">{s.name}</span>
                  <span className="text-xs font-bold text-orange-500">{s.testRate}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* 수업 참여율 낮은 학생 top3 */}
          <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)' }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-8 h-8 bg-yellow-100 rounded-xl flex items-center justify-center text-lg">📚</span>
              <span className="font-semibold text-gray-700 text-sm">수업 참여율 낮음</span>
            </div>
            <div className="space-y-2">
              {[...studentsData].sort((a, b) => a.participation - b.participation).slice(0, 3).map((s, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">{s.name}</span>
                  <span className="text-xs font-bold text-yellow-600">{s.participation}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 학생 리스트 */}
      <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)' }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span>👥</span>
            <span className="font-semibold text-gray-700">학생 리스트</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenAllMessages}
              className="px-4 py-2 bg-blue-50 text-blue-500 rounded-xl text-sm font-medium hover:bg-blue-100 transition-all"
            >
              💬 전체 메시지
            </button>
            <input
              type="text"
              placeholder="🔍 학생 검색"
              className="px-4 py-2 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-44"
            />
            <select className="px-4 py-2 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>번호순</option>
              <option>이름순</option>
              <option>리워드순</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">No</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">이름</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-400">오늘 기분</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-400">리워드</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-400">메모</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-400">메시지</th>
              </tr>
            </thead>
            <tbody>
              {studentsData.map((student) => (
                <tr key={student.no} className="border-b border-gray-50 hover:bg-blue-50 transition-all">
                  <td className="py-4 px-4 text-gray-400 font-medium">{student.no}</td>
                  <td className="py-4 px-4 font-semibold text-gray-800">{student.name}</td>
                  <td className="py-4 px-4 text-center">
                    {student.moodColor ? (
                      <button className={`w-8 h-8 rounded-full ${student.moodColor} hover:opacity-80 transition-all`}
                        title="오늘의 기분 보기">
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                        미응답
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <button
                      onClick={() => onOpenRewardPage && onOpenRewardPage()}
                      className="text-red-400 font-bold hover:text-red-500 transition-all">
                      ❤️ {student.reward}
                    </button>
                  </td>
                  <td className="py-4 px-4 text-center">
                    {student.hasMemo ? (
                      <button
                        onClick={() => onOpenNotePage && onOpenNotePage('memo', student.name)}
                        className="text-lg hover:scale-110 transition-transform">
                        📌
                      </button>
                    ) : (
                      <button
                        onClick={() => onOpenNotePage && onOpenNotePage('memo', student.name)}
                        className="text-sm text-gray-400 hover:text-blue-500 font-medium transition-all">
                        메모 추가
                      </button>
                    )}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <button
                      onClick={() => onOpenChat(student)}
                      className="px-4 py-2 text-sm text-blue-500 hover:text-white hover:bg-blue-500 font-medium bg-blue-50 rounded-xl transition-all"
                    >
                      💬 메시지
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export { NoticeAndMemoBoard, RewardHistoryPage, StudentMemoPage, MonthCalendar, RecentActivityPage, StudentChatPage, AllMessagesPage, TodayPage, ClassPage };
