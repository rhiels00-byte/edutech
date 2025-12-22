import React, { useState } from 'react';

// 학생 데이터
const studentsData = [
  { no: 1, name: '김서준', mood: '😊', submitted: '2/2', reward: 45, hasMemo: true },
  { no: 2, name: '이하은', mood: '😐', submitted: '0/2', reward: 32, hasMemo: true },
  { no: 3, name: '박도윤', mood: '😊', submitted: '2/2', reward: 58, hasMemo: false },
  { no: 4, name: '최수아', mood: '😊', submitted: '2/2', reward: 52, hasMemo: false },
  { no: 5, name: '정예준', mood: '😢', submitted: '1/2', reward: 28, hasMemo: false },
  { no: 6, name: '강지우', mood: '😊', submitted: '2/2', reward: 48, hasMemo: false },
  { no: 7, name: '윤서연', mood: '😐', submitted: '1/2', reward: 35, hasMemo: false },
];

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

// LNB 컴포넌트 - Nano Banana 스타일
const LNB = ({ isCollapsed, setIsCollapsed, activeMenu, setActiveMenu, activeSubMenu, setActiveSubMenu }) => {
  // 기본값: 모든 아코디언 접힘
  const [expandedMenus, setExpandedMenus] = useState([]);

  const menuItems = [
    { id: '홈', icon: '🏠', label: '홈', subItems: ['오늘', '우리 반'] },
    { id: '숙제', icon: '📝', label: '숙제', subItems: [] },
    { id: '시험', icon: '📋', label: '시험', subItems: [] },
    { id: '자료실', icon: '📁', label: '자료실', subItems: ['추천', '내 자료'] },
    { id: '분석', icon: '📈', label: '분석', subItems: ['학급 분석', '단원 분석'] },
    { id: '결과', icon: '📊', label: '결과', subItems: ['수업', '숙제', '시험', '스스로 학습'] },
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
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-white border border-gray-200 hover:bg-gray-50 mb-3 transition-all duration-200"
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
            <button className="w-full flex items-center justify-center p-3 rounded-2xl bg-white border border-gray-200 hover:bg-gray-50 mb-3 transition-all">
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
      <div className="flex-1 px-3 overflow-hidden">
        {menuItems.map((item) => (
          <div key={item.id} className="mb-1">
            <button
              onClick={() => {
                if (item.subItems.length > 0) {
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

      {/* 접기 버튼 */}
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
  const studentsWithMessages = studentsData.filter(s => messages[s.name] && messages[s.name].length > 0);
  const studentsWithoutMessages = studentsData.filter(s => !messages[s.name] || messages[s.name].length === 0);

  const getLastMessage = (studentName) => {
    const msgs = messages[studentName] || [];
    return msgs[msgs.length - 1];
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
            <div>
              <div className="font-bold text-gray-800 text-xl">💬 메시지</div>
              <div className="text-sm text-gray-500">1학년 3반 학생들과의 대화</div>
            </div>
          </div>
          <div className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-xl">
            대화 중인 학생: <span className="font-bold text-blue-500">{studentsWithMessages.length}명</span> / 전체 {studentsData.length}명
          </div>
        </div>
      </div>

      {/* 메시지 목록 */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto">
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
    </div>
  );
};

// 오늘 페이지 - Nano Banana 스타일
const TodayPage = () => {
  const [memoTab, setMemoTab] = useState('personal');

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

      {/* 빠른 도구 */}
      <div className="bg-white rounded-3xl p-6 mb-6" style={{ boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)' }}>
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          <span className="text-sm font-medium text-gray-500">빠른 도구</span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <button className="flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-br from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-200 transition-all group">
            <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">✏️</span>
            <span className="font-semibold text-yellow-700">수업 재구성</span>
          </button>
          <button className="flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all group">
            <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">💬</span>
            <span className="font-semibold text-blue-700">의견 보드</span>
          </button>
          <button className="flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 transition-all group">
            <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">🎮</span>
            <span className="font-semibold text-orange-700">스마트 도구</span>
          </button>
        </div>
      </div>

      {/* 오늘의 할 일 */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">📌</span>
          <span className="font-bold text-gray-800">오늘의 할 일</span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl cursor-pointer hover:shadow-lg transition-all" style={{ boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)' }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-3 h-3 bg-red-400 rounded-full"></span>
              <span className="font-medium text-gray-600">채점 필요</span>
            </div>
            <div className="text-4xl font-bold text-gray-800 mb-3">2<span className="text-lg font-normal text-gray-400 ml-1">건</span></div>
            <button className="text-sm text-blue-500 hover:text-blue-600 font-medium">바로가기 →</button>
          </div>
          <div className="bg-white p-5 rounded-2xl cursor-pointer hover:shadow-lg transition-all" style={{ boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)' }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-3 h-3 bg-orange-400 rounded-full"></span>
              <span className="font-medium text-gray-600">마감 임박</span>
            </div>
            <div className="text-4xl font-bold text-gray-800 mb-3">1<span className="text-lg font-normal text-gray-400 ml-1">건</span></div>
            <button className="text-sm text-blue-500 hover:text-blue-600 font-medium">바로가기 →</button>
          </div>
          <div className="bg-white p-5 rounded-2xl cursor-pointer hover:shadow-lg transition-all" style={{ boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)' }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-3 h-3 bg-blue-400 rounded-full"></span>
              <span className="font-medium text-gray-600">오늘 수업</span>
            </div>
            <div className="text-4xl font-bold text-gray-800 mb-3">1<span className="text-lg font-normal text-gray-400 ml-1">건</span></div>
            <button className="text-sm text-blue-500 hover:text-blue-600 font-medium">바로가기 →</button>
          </div>
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
              { day: '수', date: 18, event: null },
              { day: '목', date: 19, event: 'today' },
              { day: '금', date: 20, event: 'orange' },
            ].map((d, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="text-sm text-gray-400 mb-2">{d.day}</div>
                <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                  d.event === 'today' ? 'bg-blue-500 text-white' : 
                  d.event === 'blue' ? 'bg-blue-100 text-blue-500' :
                  d.event === 'orange' ? 'bg-orange-100 text-orange-500' :
                  'bg-gray-50 text-gray-400'
                }`}>
                  {d.date}
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50">
              <span className="w-3 h-3 bg-green-400 rounded-full"></span>
              <span className="text-xs bg-green-200 text-green-700 px-2 py-0.5 rounded-full font-medium">D-Day</span>
              <span className="text-sm text-gray-500">목 12/19</span>
              <span className="font-medium text-gray-700">독후감 마감</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-orange-50">
              <span className="w-3 h-3 bg-orange-400 rounded-full"></span>
              <span className="text-xs bg-orange-200 text-orange-700 px-2 py-0.5 rounded-full font-medium">D-1</span>
              <span className="text-sm text-gray-500">금 12/20</span>
              <span className="font-medium text-gray-700">수학 단원시험</span>
            </div>
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
          <button className="w-full py-3 text-sm text-blue-500 hover:text-blue-600 font-medium border border-blue-200 rounded-xl hover:bg-blue-50 transition-all flex items-center justify-center gap-1">
            ✏️ 수정하기
          </button>
        </div>
      </div>

      {/* 하단 영역 */}
      <div className="grid grid-cols-5 gap-6">
        {/* 최근 활동 */}
        <div className="col-span-3 bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span>🕐</span>
              <span className="font-semibold text-gray-700">최근 활동</span>
            </div>
            <button className="text-sm text-gray-400 hover:text-gray-600">더보기</button>
          </div>
          <div className="space-y-3">
            {[
              { icon: '📚', label: '수학 4-1 수업', sub: '1. 큰 수 > 십만, 백만...', time: '어제', color: 'bg-blue-100' },
              { icon: '📝', label: '독후감 숙제', sub: '자유 제출형', time: '3일 전', color: 'bg-green-100' },
              { icon: '📋', label: '단원시험', sub: '1단원 형성평가', time: '1주 전', color: 'bg-orange-100' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-all">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl ${item.color}`}>
                    {item.icon}
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">{item.label}</div>
                    <div className="text-sm text-gray-400">{item.sub}</div>
                  </div>
                </div>
                <span className="text-sm text-gray-400">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 메모 */}
        <div className="col-span-2 bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)' }}>
          <div className="flex items-center gap-2 mb-4">
            <span>📝</span>
            <span className="font-semibold text-gray-700">메모</span>
          </div>
          
          {/* 탭 */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-4">
            <button
              onClick={() => setMemoTab('personal')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                memoTab === 'personal'
                  ? 'bg-white text-blue-500 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              개인
            </button>
            <button
              onClick={() => setMemoTab('student')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                memoTab === 'student'
                  ? 'bg-white text-blue-500 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              학생별
            </button>
          </div>

          {/* 메모 내용 */}
          <div className="space-y-2 mb-4">
            {memoTab === 'personal' ? (
              <>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 font-medium text-gray-800">
                    <span className="text-red-400">📌</span>
                    내일 회의 준비
                  </div>
                  <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <span>🕐</span>
                    12/18 작성
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 font-medium text-gray-800">
                    <span className="text-red-400">📌</span>
                    수학 5단원 자료 검토
                  </div>
                  <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <span>🕐</span>
                    12/17 작성
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="p-3 bg-blue-50 rounded-xl">
                  <div className="text-sm text-blue-600 font-medium">👤 김서준</div>
                  <div className="text-gray-700 mt-1">"방정식 개념 보충 필요"</div>
                  <div className="text-xs text-gray-400 mt-1">12/18</div>
                </div>
                <div className="p-3 bg-red-50 rounded-xl">
                  <div className="text-sm text-red-600 font-medium">👤 이하은</div>
                  <div className="text-gray-700 mt-1">"숙제 미제출 2회 연속"</div>
                  <div className="text-xs text-gray-400 mt-1">12/17</div>
                </div>
              </>
            )}
          </div>

          <button className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50 transition-all">
            + 메모 추가
          </button>
        </div>
      </div>
    </div>
  );
};

// 우리 반 페이지 - Nano Banana 스타일
const ClassPage = ({ onOpenChat, onOpenAllMessages }) => {
  const [topStudents, setTopStudents] = useState([
    { rank: 1, name: '박도윤', point: 58 },
    { rank: 2, name: '최수아', point: 52 },
    { rank: 3, name: '강지우', point: 48 },
    { rank: 4, name: '김서준', point: 45 },
    { rank: 5, name: '윤서연', point: 35 },
  ]);

  const updatePoints = (rank, delta) => {
    setTopStudents(topStudents.map(student =>
      student.rank === rank
        ? { ...student, point: Math.max(0, student.point + delta) }
        : student
    ));
  };

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
        <div className="flex gap-4">
          <button className="flex-1 flex items-center justify-center gap-3 p-5 rounded-2xl bg-gradient-to-br from-pink-50 to-pink-100 hover:from-pink-100 hover:to-pink-200 transition-all group">
            <span className="text-3xl group-hover:scale-110 transition-transform">🧠</span>
            <div className="text-left">
              <div className="font-semibold text-pink-700 text-sm">심리검사</div>
              <div className="text-xs text-pink-400">진행 중 3명</div>
            </div>
          </button>
          <button className="flex-1 flex items-center justify-center gap-3 p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all group">
            <span className="text-3xl group-hover:scale-110 transition-transform">🏠</span>
            <div className="text-left">
              <div className="font-semibold text-blue-700 text-sm">마이룸</div>
              <div className="text-xs text-blue-400">꾸미기</div>
            </div>
          </button>
          <button className="flex-1 flex items-center justify-center gap-3 p-5 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 transition-all group">
            <span className="text-3xl group-hover:scale-110 transition-transform">🎯</span>
            <div className="text-left">
              <div className="font-semibold text-green-700 text-sm">목표 설정</div>
              <div className="text-xs text-green-400">이번 주</div>
            </div>
          </button>
          <button className="flex-1 flex items-center justify-center gap-3 p-5 rounded-2xl bg-gradient-to-br from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-200 transition-all group">
            <span className="text-3xl group-hover:scale-110 transition-transform">🏪</span>
            <div className="text-left">
              <div className="font-semibold text-yellow-700 text-sm">상점</div>
              <div className="text-xs text-yellow-500">리워드 사용</div>
            </div>
          </button>
        </div>
      </div>

      {/* 제출 현황 + 리워드 */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)' }}>
          <div className="flex items-center gap-2 mb-4">
            <span>📊</span>
            <span className="font-semibold text-gray-700">이번 주 제출 현황</span>
          </div>
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">전체 제출률</span>
              <span className="font-bold text-blue-500 text-lg">75%</span>
            </div>
            <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-400 to-blue-500 transition-all" style={{ width: '75%' }}></div>
            </div>
            <div className="text-right text-sm text-gray-400 mt-2">21/28명 제출 완료</div>
          </div>
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl">
            <div>
              <span className="text-red-500 font-medium">⚠️ 미제출 7명</span>
              <p className="text-sm text-red-300 mt-1">이하은, 정예준 외 5명</p>
            </div>
            <button className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 transition-all"
              style={{ boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)' }}>
              알림 보내기
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span>🏆</span>
              <span className="font-semibold text-gray-700">리워드 TOP 5</span>
            </div>
            <button className="text-sm text-blue-500 hover:text-blue-600 font-medium">전체 보기 →</button>
          </div>
          <div className="space-y-2">
            {topStudents.map((item) => (
              <div key={item.rank} className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-gray-50 transition-all">
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 min-w-[2rem] rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                    item.rank === 1 ? 'bg-yellow-400 text-white' :
                    item.rank === 2 ? 'bg-gray-400 text-white' :
                    item.rank === 3 ? 'bg-orange-400 text-white' :
                    'bg-gray-100 text-gray-500'
                  }`}>
                    {item.rank}
                  </span>
                  <span className="font-medium text-gray-700">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updatePoints(item.rank, -1)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold transition-all"
                  >
                    -
                  </button>
                  <span className="text-red-400 font-bold min-w-[60px] text-center">❤️ {item.point}</span>
                  <button
                    onClick={() => updatePoints(item.rank, 1)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 font-bold transition-all"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
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
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-400">제출 현황</th>
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
                  <td className="py-4 px-4 text-center text-2xl">{student.mood}</td>
                  <td className="py-4 px-4 text-center">
                    <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${
                      student.submitted === '2/2' ? 'bg-green-100 text-green-600' :
                      student.submitted === '0/2' ? 'bg-red-100 text-red-600' :
                      'bg-yellow-100 text-yellow-600'
                    }`}>
                      {student.submitted === '2/2' ? '✅' : student.submitted === '0/2' ? '❌' : '⚠️'} {student.submitted}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center text-red-400 font-bold">❤️ {student.reward}</td>
                  <td className="py-4 px-4 text-center text-lg">{student.hasMemo ? '📌' : <span className="text-gray-200">-</span>}</td>
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

// 메인 앱
export default function App() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState('홈');
  const [activeSubMenu, setActiveSubMenu] = useState('오늘');
  const [currentPage, setCurrentPage] = useState('main');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [messages, setMessages] = useState(initialMessages);

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

  const renderContent = () => {
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

    if (currentPage === 'allMessages') {
      return (
        <AllMessagesPage 
          onBack={handleBackToClass}
          onSelectStudent={handleOpenChat}
          messages={messages}
        />
      );
    }

    if (activeMenu === '홈') {
      if (activeSubMenu === '우리 반') {
        return (
          <ClassPage 
            onOpenChat={handleOpenChat}
            onOpenAllMessages={handleOpenAllMessages}
          />
        );
      }
      return <TodayPage />;
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

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <LNB
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        activeMenu={activeMenu}
        setActiveMenu={(menu) => { setActiveMenu(menu); setCurrentPage('main'); }}
        activeSubMenu={activeSubMenu}
        setActiveSubMenu={(sub) => { setActiveSubMenu(sub); setCurrentPage('main'); }}
      />
      <div className="flex-1 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
}
