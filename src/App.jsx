import React, { useState } from 'react';
import { initialMessages } from './data/studentData';
import LNB from './components/LNB';
import {
  NoticeAndMemoBoard,
  RewardHistoryPage,
  StudentMemoPage,
  MonthCalendar,
  RecentActivityPage,
  StudentChatPage,
  AllMessagesPage,
  TodayPage,
  ClassPage
} from './pages/HomePage';
import TextbookPage from './pages/TextbookPage';

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
