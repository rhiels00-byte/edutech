import React, { useState } from 'react';

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

export default LNB;
