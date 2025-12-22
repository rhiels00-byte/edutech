import React, { useState, useRef } from 'react';
import { ReactSketchCanvas } from 'react-sketch-canvas';

// 학생 데이터 (moodColor: null = 미응답)
const studentsData = [
  { no: 1, name: '김서준', moodColor: 'bg-green-400', reward: 45, hasMemo: true, participation: 95, testRate: 100 },
  { no: 2, name: '이하은', moodColor: 'bg-red-400', reward: 32, hasMemo: true, participation: 60, testRate: 45 },
  { no: 3, name: '박도윤', moodColor: 'bg-blue-400', reward: 58, hasMemo: false, participation: 90, testRate: 88 },
  { no: 4, name: '최수아', moodColor: 'bg-green-400', reward: 52, hasMemo: false, participation: 85, testRate: 92 },
  { no: 5, name: '정예준', moodColor: 'bg-gray-800', reward: 28, hasMemo: false, participation: 55, testRate: 40 },
  { no: 6, name: '강지우', moodColor: null, reward: 48, hasMemo: false, participation: 88, testRate: 85 },
  { no: 7, name: '윤서연', moodColor: 'bg-red-400', reward: 35, hasMemo: false, participation: 70, testRate: 50 },
];

// 리워드 히스토리 데이터
const rewardHistory = {
  '김서준': [
    { date: '12.21', action: '교과서를 공부해서', points: 1 },
    { date: '12.20', action: '스스로 공부해서', points: 5 },
    { date: '12.19', action: '숙제 제출', points: 3 },
  ],
  '이하은': [
    { date: '12.23', action: '선생님의 칭찬', points: 10 },
    { date: '12.23', action: '선생님의 꾸중', points: -10 },
    { date: '12.22', action: '스스로 공부해서', points: 5 },
  ],
  '박도윤': [
    { date: '12.21', action: '시험 만점', points: 10 },
    { date: '12.20', action: '수업 집중', points: 3 },
  ],
  '최수아': [],
  '정예준': [],
  '강지우': [],
  '윤서연': [],
};

// 교과서 슬라이드 데이터
const textbookSlides = [
  { id: 1, type: 'concept', icon: '💡', title: '개념' },
  { id: 2, type: 'problem', icon: '❓', title: '문제1' },
  { id: 3, type: 'example', icon: '📝', title: '예시' },
  { id: 4, type: 'problem', icon: '❓', title: '문제2' },
  { id: 5, type: 'problem', icon: '❓', title: '문제3' },
  { id: 6, type: 'review', icon: '🔄', title: '복습' },
  { id: 7, type: 'summary', icon: '📋', title: '정리' },
];

// 학생 제출 현황 데이터
const textbookStudents = [
  { id: 1, name: '김지우', avatar: '🐻', submitted: true, status: 'correct', answer: '52' },
  { id: 2, name: '이서준', avatar: '🐰', submitted: true, status: 'wrong', answer: '48' },
  { id: 3, name: '박도윤', avatar: '🦊', submitted: true, status: 'correct', answer: '52' },
  { id: 4, name: '최수아', avatar: '🐱', submitted: false, status: null, answer: null },
  { id: 5, name: '정예준', avatar: '🐶', submitted: true, status: 'correct', answer: '52' },
  { id: 6, name: '강지우', avatar: '🐼', submitted: false, status: null, answer: null },
  { id: 7, name: '윤서연', avatar: '🐯', submitted: true, status: 'wrong', answer: '50' },
  { id: 8, name: '장민준', avatar: '🦁', submitted: true, status: 'correct', answer: '52' },
  { id: 9, name: '임하린', avatar: '🐷', submitted: false, status: null, answer: null },
  { id: 10, name: '한시우', avatar: '🐸', submitted: true, status: 'correct', answer: '52' },
];

// 학생별 메모 데이터
const studentMemos = {
  '김서준': [
    { date: '2025-12-18', content: '방정식 개념 보충 필요' },
    { date: '2025-12-15', content: '수업 태도 매우 좋음' },
  ],
  '이하은': [
    { date: '2025-12-17', content: '숙제 미제출 2회 연속' },
  ],
  '박도윤': [],
  '최수아': [],
  '정예준': [],
  '강지우': [],
  '윤서연': [],
};

// 메시지 히스토리 데이터
const initialMessages = {
  '김서준': [
    { id: 1, text: '서준아, 오늘 수업 잘 들었어요! 👏', time: '12/18 14:30', from: 'teacher' },
    { id: 2, text: '네 선생님! 감사합니다 😊', time: '12/18 14:35', from: 'student' },
    { id: 3, text: '내일 숙제 꼭 제출해주세요~', time: '12/18 15:00', from: 'teacher' },
  ],
  '이하은': [
    { id: 1, text: '하은아, 숙제 제출이 안 됐는데 확인해줄래요?', time: '12/17 10:00', from: 'teacher' },
    { id: 2, text: '아 죄송해요 선생님ㅠㅠ 오늘 제출할게요!', time: '12/17 10:30', from: 'student' },
  ],
  '박도윤': [
    { id: 1, text: '도윤아, 이번 시험 1등 축하해요! 🎉', time: '12/15 16:00', from: 'teacher' },
    { id: 2, text: '감사합니다 선생님!!', time: '12/15 16:10', from: 'student' },
  ],
  '최수아': [],
  '정예준': [
    { id: 1, text: '예준아, 요즘 무슨 고민 있어요? 상담 필요하면 말해줘요', time: '12/16 09:00', from: 'teacher' },
  ],
  '강지우': [],
  '윤서연': [],
};

// 알림장 + 메모장 통합 전체화면 페이지 (노션 스타일) - LNB와 함께 표시
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
        <div className="flex items-center justify-between">
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
        <div className="flex items-center justify-between">
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

// 한 달 캘린더 모달
const MonthCalendar = ({ onClose }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  const events = [
    { id: 1, date: 17, title: '수학 4-1 수업', type: '수업', status: '완료', color: 'bg-blue-100 text-blue-600', detail: '1. 큰 수 > 십만, 백만 알아보기' },
    { id: 2, date: 19, title: '독후감 마감', type: '과제', status: 'D-Day', color: 'bg-green-100 text-green-600', detail: '자유 제출형 독후감 마감일' },
    { id: 3, date: 20, title: '수학 단원시험', type: '평가', status: 'D-1', color: 'bg-orange-100 text-orange-600', detail: '1단원 형성평가' },
    { id: 4, date: 15, title: '과제 제출', type: '과제', status: '완료', color: 'bg-blue-100 text-blue-600', detail: '국어 읽기 과제 제출' },
    { id: 5, date: 30, title: '학부모 상담', type: '기타', status: '예정', color: 'bg-purple-100 text-purple-600', detail: '1학기 학부모 상담 주간' },
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
                <div className="flex items-start gap-2 pt-2">
                  <span className="font-semibold">상세:</span>
                  <span>{selectedEvent.detail}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 최근 활동 전체화면 페이지 (캘린더 UI)
const RecentActivityPage = ({ onClose }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  const events = [
    { id: 1, date: 17, title: '수학 4-1 수업', type: '수업', status: '완료', color: 'bg-blue-100 text-blue-600', detail: '1. 큰 수 > 십만, 백만 알아보기', icon: '📚' },
    { id: 2, date: 18, title: '국어 3-2 수업', type: '수업', status: '완료', color: 'bg-blue-100 text-blue-600', detail: '시 감상하기', icon: '📚' },
    { id: 3, date: 18, title: '독후감 제출', type: '숙제', status: '진행중', color: 'bg-green-100 text-green-600', detail: '자유 제출형 독후감', icon: '✏️' },
    { id: 4, date: 19, title: '독후감 마감', type: '숙제', status: 'D-Day', color: 'bg-green-100 text-green-600', detail: '자유 제출형 독후감 마감일', icon: '✏️' },
    { id: 5, date: 20, title: '수학 단원시험', type: '시험', status: 'D-1', color: 'bg-orange-100 text-orange-600', detail: '1단원 형성평가', icon: '📝' },
    { id: 6, date: 15, title: '1단원 형성평가', type: '시험', status: '완료', color: 'bg-orange-100 text-orange-600', detail: '수학 단원시험 채점 완료', icon: '📝' },
    { id: 7, date: 12, title: '수학 문제풀이', type: '숙제', status: '예정', color: 'bg-green-100 text-green-600', detail: '4단원 연습문제', icon: '✏️' },
    { id: 8, date: 12, title: '과학 실험', type: '수업', status: '완료', color: 'bg-blue-100 text-blue-600', detail: '물의 상태 변화', icon: '🔬' },
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
        <div className="flex items-center justify-between">
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
              <div className="flex items-start gap-2 pt-2">
                <span className="font-semibold">상세:</span>
                <span>{selectedEvent.detail}</span>
              </div>
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

// LNB 컴포넌트 - Nano Banana 스타일
const LNB = ({ isCollapsed, setIsCollapsed, activeMenu, setActiveMenu, activeSubMenu, setActiveSubMenu, onOpenTextbook }) => {
  // 기본값: 모든 아코디언 접힘
  const [expandedMenus, setExpandedMenus] = useState([]);

  const menuItems = [
    { id: '홈', icon: '🏠', label: '홈', subItems: ['우리 반', '내 자료'] },
    { id: '숙제', icon: '✏️', label: '숙제', subItems: ['할 일', '하는 중', '끝'] },
    { id: '시험', icon: '📝', label: '시험', subItems: ['할 일', '하는 중', '끝'] },
    { id: '스스로 공부', icon: '📚', label: '스스로 공부', subItems: ['문제 풀기', '틀린 문제 보기'] },
    { id: '결과', icon: '📊', label: '결과', subItems: ['수업', '숙제', '시험'] },
  ];

  const toggleMenu = (menuId) => {
    if (expandedMenus.includes(menuId)) {
      setExpandedMenus(expandedMenus.filter(id => id !== menuId));
    } else {
      setExpandedMenus([...expandedMenus, menuId]);
    }
  };

  const handleMenuClick = (menuId, subItem = null) => {
    setActiveMenu(menuId);
    if (subItem) {
      setActiveSubMenu(subItem);
    } else {
      setActiveSubMenu(null);
    }
  };

  return (
    <div
      className={`h-screen bg-white flex flex-col transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}
      style={{
        fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif",
        boxShadow: '4px 0 20px rgba(0, 0, 0, 0.05)'
      }}
    >
      {/* 전체 스크롤 영역 */}
      <div className="flex-1 overflow-y-auto">
        {/* 로고 */}
        <div className="p-5">
        {!isCollapsed ? (
          <div className="flex items-center gap-2">
            <span className="text-2xl">📚</span>
            <span className="text-xl font-bold text-blue-500">에듀테크</span>
          </div>
        ) : (
          <div className="text-2xl text-center">📚</div>
        )}
      </div>

      {/* 수업 영역 */}
      <div className="px-4 pb-4">
        {!isCollapsed ? (
          <>
            <button
              onClick={onOpenTextbook}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-white border border-gray-200 hover:bg-gray-50 mb-3 transition-all duration-200"
              style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)' }}>
              <span className="text-xl">📖</span>
              <span className="font-medium text-gray-700">교과서</span>
            </button>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-semibold transition-all duration-200"
              style={{ boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }}>
              <span className="text-lg">▶</span>
              <span>수업 시작</span>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onOpenTextbook}
              className="w-full flex items-center justify-center p-3 rounded-2xl bg-white border border-gray-200 hover:bg-gray-50 mb-3 transition-all">
              <span className="text-xl">📖</span>
            </button>
            <button className="w-full flex items-center justify-center p-3 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white transition-all"
              style={{ boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }}>
              <span className="text-lg">▶</span>
            </button>
          </>
        )}
      </div>

        {/* 메인 메뉴 */}
        <div className="px-3 pb-4">
        {menuItems.map((item) => (
          <div key={item.id} className="mb-1">
            <button
              onClick={() => {
                if (item.id === '홈') {
                  // 홈 클릭 시 오늘 페이지로 이동 (디폴트)
                  handleMenuClick(item.id, null);
                  if (item.subItems.length > 0) {
                    toggleMenu(item.id);
                  }
                } else if (item.subItems.length > 0) {
                  toggleMenu(item.id);
                  if (!expandedMenus.includes(item.id)) {
                    handleMenuClick(item.id, item.subItems[0]);
                  }
                } else {
                  handleMenuClick(item.id);
                }
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
                activeMenu === item.id 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              } ${isCollapsed ? 'justify-center' : ''}`}
            >
              <span className="text-xl">{item.icon}</span>
              {!isCollapsed && (
                <>
                  <span className="flex-1 text-left font-medium">{item.label}</span>
                  {item.subItems.length > 0 && (
                    <span className={`text-gray-400 transition-transform duration-200 ${expandedMenus.includes(item.id) ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  )}
                </>
              )}
            </button>
            
            {/* 서브메뉴 - 아코디언 애니메이션 */}
            {!isCollapsed && item.subItems.length > 0 && (
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  expandedMenus.includes(item.id) ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="ml-4 mt-1 space-y-1">
                  {item.subItems.map((subItem) => (
                    <button
                      key={subItem}
                      onClick={() => handleMenuClick(item.id, subItem)}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                        activeMenu === item.id && activeSubMenu === subItem
                          ? 'text-blue-600 font-semibold bg-blue-50'
                          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                      }`}
                    >
                      {subItem}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 하단 유틸 메뉴 */}
      <div className="px-3 py-3 border-t border-gray-100">
        <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-600 hover:bg-gray-50 transition-all ${isCollapsed ? 'justify-center' : ''}`}>
          <span className="relative text-xl">
            🔔
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
              3
            </span>
          </span>
          {!isCollapsed && <span className="font-medium">알림</span>}
        </button>
        
        <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-600 hover:bg-gray-50 transition-all ${isCollapsed ? 'justify-center' : ''}`}>
          <span className="text-xl text-red-400">❓</span>
          {!isCollapsed && <span className="font-medium">고객센터</span>}
        </button>
        
        {/* 프로필 */}
        <div className={`mt-2 px-4 py-3 ${isCollapsed ? 'flex justify-center' : ''}`}>
          {!isCollapsed ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-lg">👤</span>
              </div>
              <span className="font-medium text-gray-700">윤지명</span>
            </div>
          ) : (
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-lg">👤</span>
            </div>
          )}
        </div>
      </div>
      </div>

      {/* 접기 버튼 - 하단 고정 */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="p-4 border-t border-gray-100 hover:bg-gray-50 text-gray-400 transition-all flex items-center justify-center gap-2"
      >
        <span className={`transition-transform duration-200 ${isCollapsed ? 'rotate-180' : ''}`}>◀</span>
        {!isCollapsed && <span className="text-sm">메뉴 접기</span>}
      </button>
    </div>
  );
};

// 개별 학생 채팅 페이지
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
      <div className="flex items-center justify-between mb-6">
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
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">📌</span>
          <span className="font-bold text-gray-800">오늘의 할 일</span>
        </div>
        <div className="grid grid-cols-3 gap-4">
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
      <div className="grid grid-cols-5 gap-6 mb-6">
        {/* 이번 주 일정 */}
        <div className="col-span-3 bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)' }}>
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
        <div className="col-span-2 bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)' }}>
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
        <div className="grid grid-cols-4 gap-4">
          {[
            { icon: '📚', type: '교과서', time: '어제', actionStatus: '수업', scheduleStatus: '끝', title: '수학 4-1 수업', sub: '1. 큰 수 > 십만, 백만 알아보기' },
            { icon: '✏️', type: '숙제', time: '3일 전', actionStatus: '출제', scheduleStatus: '하는 중', title: '독후감 제출', sub: '자유 제출형 독후감' },
            { icon: '📝', type: '시험', time: '1주 전', actionStatus: '채점', scheduleStatus: '끝', title: '1단원 형성평가', sub: '수학 단원시험' },
            { icon: '✏️', type: '숙제', time: '4일 전', actionStatus: '편집', scheduleStatus: '할 일', title: '수학 문제풀이', sub: '4단원 연습문제' },
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => {/* TODO: 상세 정보 보기 */}}
              className="flex flex-col bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-all text-left group">
              {/* 썸네일 영역 - 유튜브 스타일 */}
              <div className={`h-28 flex items-center justify-center text-4xl ${
                item.type === '교과서' ? 'bg-gradient-to-br from-blue-100 to-blue-200' :
                item.type === '숙제' ? 'bg-gradient-to-br from-green-100 to-green-200' :
                'bg-gradient-to-br from-orange-100 to-orange-200'
              }`}>
                {item.icon}
              </div>
              {/* 정보 영역 */}
              <div className="p-3">
                <div className="font-medium text-gray-800 text-sm mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
                  {item.title}
                </div>
                <div className="text-xs text-gray-500 mb-2 line-clamp-1">{item.sub}</div>
                {/* 메타 정보 - [이모지/자료유형/날짜/자료상태/일정상태] */}
                <div className="flex flex-wrap items-center gap-1 text-xs">
                  <span className="bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">{item.type}</span>
                  <span className="text-gray-400">{item.time}</span>
                  <span className={`px-1.5 py-0.5 rounded ${
                    item.actionStatus === '수업' ? 'bg-blue-100 text-blue-600' :
                    item.actionStatus === '출제' ? 'bg-green-100 text-green-600' :
                    item.actionStatus === '채점' ? 'bg-purple-100 text-purple-600' :
                    'bg-yellow-100 text-yellow-600'
                  }`}>{item.actionStatus}</span>
                  <span className={`px-1.5 py-0.5 rounded ${
                    item.scheduleStatus === '끝' ? 'bg-gray-100 text-gray-500' :
                    item.scheduleStatus === '하는 중' ? 'bg-blue-100 text-blue-600' :
                    'bg-orange-100 text-orange-600'
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

// 우리 반 페이지 - Nano Banana 스타일
const ClassPage = ({ onOpenChat, onOpenAllMessages, onOpenNotePage, onOpenRewardPage }) => {

  return (
    <div className="p-6 bg-gray-50 min-h-screen overflow-auto" style={{ fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
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
      <div className="bg-white rounded-3xl p-6 mb-6" style={{ boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)' }}>
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          <span className="text-sm font-medium text-gray-500">빠른 도구</span>
        </div>
        <div className="grid grid-cols-5 gap-4">
          <button className="flex flex-col items-center justify-center gap-2 p-5 rounded-2xl bg-gradient-to-br from-pink-50 to-pink-100 hover:from-pink-100 hover:to-pink-200 transition-all group">
            <span className="text-3xl group-hover:scale-110 transition-transform">🧠</span>
            <div className="text-center">
              <div className="font-semibold text-pink-700 text-sm">학습심리정서검사</div>
              <div className="text-xs text-pink-400 mt-1">진행 중 3명</div>
            </div>
          </button>
          <button className="flex flex-col items-center justify-center gap-2 p-5 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 transition-all group">
            <span className="text-3xl group-hover:scale-110 transition-transform">😊</span>
            <div className="text-center">
              <div className="font-semibold text-purple-700 text-sm">오늘의 기분</div>
              <div className="text-xs text-purple-400 mt-1">응답 25명</div>
            </div>
          </button>
          {/* 순서 변경: 목표 설정 → 마이룸 */}
          <button className="flex flex-col items-center justify-center gap-2 p-5 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 transition-all group">
            <span className="text-3xl group-hover:scale-110 transition-transform">🎯</span>
            <div className="text-center">
              <div className="font-semibold text-green-700 text-sm">목표 설정</div>
              <div className="text-xs text-green-400 mt-1">이번 주</div>
            </div>
          </button>
          <button className="flex flex-col items-center justify-center gap-2 p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all group">
            <span className="text-3xl group-hover:scale-110 transition-transform">🏠</span>
            <div className="text-center">
              <div className="font-semibold text-blue-700 text-sm">마이룸</div>
              <div className="text-xs text-blue-400 mt-1">꾸미기</div>
            </div>
          </button>
          <button className="flex flex-col items-center justify-center gap-2 p-5 rounded-2xl bg-gradient-to-br from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-200 transition-all group">
            <span className="text-3xl group-hover:scale-110 transition-transform">🏪</span>
            <div className="text-center">
              <div className="font-semibold text-yellow-700 text-sm">상점</div>
              <div className="text-xs text-yellow-500 mt-1">리워드 사용</div>
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
        <div className="grid grid-cols-3 gap-4">
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
        <div className="flex items-center justify-between mb-4">
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

// 교과서 페이지
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

// 메인 앱
export default function App() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState('홈');
  const [activeSubMenu, setActiveSubMenu] = useState('오늘');
  const [currentPage, setCurrentPage] = useState('main');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [messages, setMessages] = useState(initialMessages);

  // 노트 페이지 상태
  const [notePageConfig, setNotePageConfig] = useState({ tab: 'notice', studentFilter: null });

  const handleOpenChat = (student) => {
    setSelectedStudent(student);
    setCurrentPage('chat');
  };

  const handleOpenAllMessages = () => {
    setCurrentPage('allMessages');
  };

  const handleBackToClass = () => {
    setCurrentPage('main');
    setSelectedStudent(null);
  };

  // 노트 페이지 열기 (탭, 학생필터 지정 가능)
  const handleOpenNotePage = (tab = 'notice', studentFilter = null) => {
    setNotePageConfig({ tab, studentFilter });
    setCurrentPage('note');
  };

  // 리워드 페이지 열기
  const handleOpenRewardPage = () => {
    setCurrentPage('reward');
  };

  // 최근 활동 페이지 열기
  const handleOpenRecentActivityPage = () => {
    setCurrentPage('recentActivity');
  };

  // 교과서 페이지 열기
  const handleOpenTextbook = () => {
    setCurrentPage('textbook');
  };

  const renderContent = () => {
    // 노트 페이지 (알림장/메모장)
    if (currentPage === 'note') {
      return (
        <NoticeAndMemoBoard
          onClose={handleBackToClass}
          initialTab={notePageConfig.tab}
          initialStudentFilter={notePageConfig.studentFilter}
        />
      );
    }

    // 리워드 페이지
    if (currentPage === 'reward') {
      return (
        <RewardHistoryPage onClose={handleBackToClass} />
      );
    }

    // 최근 활동 페이지
    if (currentPage === 'recentActivity') {
      return (
        <RecentActivityPage onClose={handleBackToClass} />
      );
    }

    // 개별 채팅 페이지
    if (currentPage === 'chat' && selectedStudent) {
      return (
        <StudentChatPage
          student={selectedStudent}
          onBack={handleBackToClass}
          onViewAll={handleOpenAllMessages}
          messages={messages}
          setMessages={setMessages}
        />
      );
    }

    // 전체 메시지 페이지
    if (currentPage === 'allMessages') {
      return (
        <AllMessagesPage
          onBack={handleBackToClass}
          onSelectStudent={handleOpenChat}
          messages={messages}
        />
      );
    }

    // 홈 메뉴
    if (activeMenu === '홈') {
      if (activeSubMenu === '우리 반') {
        return (
          <ClassPage
            onOpenChat={handleOpenChat}
            onOpenAllMessages={handleOpenAllMessages}
            onOpenNotePage={handleOpenNotePage}
            onOpenRewardPage={handleOpenRewardPage}
          />
        );
      }
      // 홈 클릭 또는 서브메뉴 없을 때 디폴트로 '오늘' 페이지 표시
      return (
        <TodayPage
          onOpenNotePage={handleOpenNotePage}
          onOpenRecentActivityPage={handleOpenRecentActivityPage}
        />
      );
    }

    return (
      <div className="flex items-center justify-center h-full bg-gray-50" style={{ fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif" }}>
        <div className="text-center p-10 bg-white rounded-3xl" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
          <div className="text-7xl mb-6">🚧</div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            {activeMenu} {activeSubMenu && `> ${activeSubMenu}`}
          </h2>
          <p className="text-gray-400">준비 중인 페이지입니다</p>
          <button
            onClick={() => { setActiveMenu('홈'); setActiveSubMenu('오늘'); setCurrentPage('main'); }}
            className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all font-medium"
            style={{ boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }}
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  };

  // 교과서 페이지는 전체 화면으로 표시 (LNB 숨김)
  if (currentPage === 'textbook') {
    return (
      <TextbookPage onClose={handleBackToClass} />
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <LNB
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        activeMenu={activeMenu}
        setActiveMenu={(menu) => { setActiveMenu(menu); setCurrentPage('main'); }}
        activeSubMenu={activeSubMenu}
        setActiveSubMenu={(sub) => { setActiveSubMenu(sub); setCurrentPage('main'); }}
        onOpenTextbook={handleOpenTextbook}
      />
      <div className="flex-1 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
}