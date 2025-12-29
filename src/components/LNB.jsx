import React, { useState } from 'react';

// feature: nav.lnb
// mappingStatus: Compose
// apiCandidates: GET /tch/class/info, GET /tch/dsbd/notice/list, GET /apm/cs/inquiry/list
const LNB = ({ isCollapsed, setIsCollapsed, activeMenu, setActiveMenu, activeSubMenu, setActiveSubMenu, onOpenTextbook }) => {
  // 기본값: 모든 아코디언 접힘
  const [expandedMenus, setExpandedMenus] = useState([]);

  // Section 1: 시험, 숙제 (교과서와 수업 시작은 하드코딩)
  const section1Items = [
    { id: '시험', icon: '📝', label: '시험', subItems: [] },
    { id: '숙제', icon: '✏️', label: '숙제', subItems: [] },
  ];

  // Section 2: 홈, 결과, 스스로 공부
  const section2Items = [
    { id: '홈', icon: '🏠', label: '홈', subItems: ['오늘 할 일', '우리 반', '내 자료'] },
    { id: '결과', icon: '📊', label: '결과', subItems: ['수업', '숙제', '시험'] },
    { id: '스스로 공부', icon: '📚', label: '스스로 공부', subItems: [] },
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
      className={`h-screen bg-white flex flex-col transition-all duration-300 fixed md:static inset-y-0 left-0 z-50 border-r border-gray-100 ${
        isCollapsed ? 'w-20 -translate-x-full md:translate-x-0' : 'w-72 translate-x-0'
      }`}
      style={{
        fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif",
        boxShadow: '4px 0 20px rgba(0, 0, 0, 0.02)'
      }}
    >
      {/* 1) 프로필 영역 */}
      <div className="p-6">
        <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center shadow-sm shrink-0">
            <span className="text-xl">👨‍🏫</span>
          </div>
          {!isCollapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="font-bold text-gray-800 text-lg leading-tight truncate">윤지명 선생님</span>
              <span className="text-xs text-gray-500 truncate">1학년 3반 담임</span>
            </div>
          )}
        </div>
      </div>

      {/* 전체 스크롤 영역 */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-6">
        
        {/* 2) 교사/학생 인터액션 영역 (강조) */}
        <div className="bg-blue-50 rounded-3xl p-3 border border-blue-100">
          {!isCollapsed && (
            <div className="px-2 mb-2 text-[11px] font-bold text-blue-400 uppercase tracking-wider">
              Classroom
            </div>
          )}
          
          {/* 수업 시작 버튼 */}
          <div className="mb-2">
            {!isCollapsed ? (
              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-200 transition-all duration-200">
                <span className="text-lg">▶</span>
                <span>수업 시작</span>
              </button>
            ) : (
              <button className="w-full flex items-center justify-center p-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200 transition-all">
                <span className="text-lg">▶</span>
              </button>
            )}
          </div>

          {/* 교과서 */}
          <button
            onClick={onOpenTextbook}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-gray-700 hover:bg-white hover:shadow-sm mb-1 ${isCollapsed ? 'justify-center' : ''}`}>
            <span className="text-xl">📖</span>
            {!isCollapsed && <span className="flex-1 text-left font-semibold text-sm">교과서</span>}
          </button>

          {/* 시험, 숙제 */}
          {section1Items.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id, null)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 mb-1 ${
                activeMenu === item.id
                  ? 'bg-white text-blue-600 shadow-sm font-bold'
                  : 'text-gray-700 hover:bg-white hover:shadow-sm font-medium'
              } ${isCollapsed ? 'justify-center' : ''}`}
            >
              <span className="text-xl">{item.icon}</span>
              {!isCollapsed && <span className="flex-1 text-left text-sm">{item.label}</span>}
            </button>
          ))}
        </div>

        {/* 3) 교사 관리 영역 */}
        <div>
          {!isCollapsed && (
            <div className="px-4 mb-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Management
            </div>
          )}
          {section2Items.map((item) => (
            <div key={item.id} className="mb-1">
              <button
                onClick={() => {
                  if (item.id === '홈' || item.id === '스스로 공부') {
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
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                  activeMenu === item.id
                    ? 'bg-gray-100 text-gray-900 font-bold'
                    : 'text-gray-600 hover:bg-gray-50 font-medium'
                } ${isCollapsed ? 'justify-center' : ''}`}
              >
                <span className="text-xl opacity-80">{item.icon}</span>
                {!isCollapsed && (
                  <>
                    <span className="flex-1 text-left text-sm">{item.label}</span>
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
                  <div className="ml-9 mt-1 space-y-0.5 border-l-2 border-gray-100 pl-2">
                    {item.subItems.map((subItem) => (
                      <button
                        key={subItem}
                        onClick={() => handleMenuClick(item.id, subItem)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all duration-200 ${
                          activeMenu === item.id && activeSubMenu === subItem
                            ? 'text-blue-600 font-bold bg-blue-50'
                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700 font-medium'
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

        {/* 4) 기타 영역 */}
        <div>
          {!isCollapsed && (
            <div className="px-4 mb-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Support
            </div>
          )}
          <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 hover:bg-gray-50 transition-all mb-1 ${isCollapsed ? 'justify-center' : ''}`}>
            <span className="relative text-xl opacity-80">
              🔔
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold border-2 border-white">
                3
              </span>
            </span>
            {!isCollapsed && <span className="font-medium text-sm">알림</span>}
          </button>

          <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 hover:bg-gray-50 transition-all ${isCollapsed ? 'justify-center' : ''}`}>
            <span className="text-xl opacity-80">❓</span>
            {!isCollapsed && <span className="font-medium text-sm">고객센터</span>}
          </button>
        </div>
      </div>

      {/* 접기 버튼 */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center gap-2 p-2 rounded-xl hover:bg-gray-50 text-gray-400 transition-all"
        >
          <span className={`transition-transform duration-200 ${isCollapsed ? 'rotate-180' : ''}`}>◀</span>
          {!isCollapsed && <span className="text-xs font-medium">메뉴 접기</span>}
        </button>
      </div>
    </div>
  );
};

export default LNB;
