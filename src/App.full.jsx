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
                    <span className={`text-gray-400 transition-transform duration-200 ${expandedMenus.includes(item.id) ? 'rotate-180' : ''} `}>
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
      <div className="flex-1 overflow-auto p-6"> ... (truncated for brevity) 

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
