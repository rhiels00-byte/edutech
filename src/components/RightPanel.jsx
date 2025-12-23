import React from 'react';

// feature: ui.rightPanel.shell
// mappingStatus: Existing
// apiCandidates: (ui shell only; API mapping handled by parent features)
// 공통 RightPanel 컴포넌트 - 함께 보기 디자인 기준
const RightPanel = ({
  title,
  icon,
  isCollapsed,
  onToggleCollapse,
  onClose,
  headerActions,
  children,
  footer,
  collapsedLabel,
  width = 'w-80'
}) => {
  const collapsedSideWidth = 'w-14';

  return (
    <div
      className={`h-full ${isCollapsed ? collapsedSideWidth : width} ${isCollapsed ? 'bg-blue-50 border-blue-200' : 'bg-white'} z-50 flex flex-col shrink-0 shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden`}
    >
      {isCollapsed ? (
        <div className="h-full flex flex-col items-center py-4 gap-3">
          <button
            onClick={onToggleCollapse}
            className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 text-xs font-semibold hover:bg-blue-200"
          >
            펼침
          </button>
          <div className="flex-1 flex items-center">
            <div className="text-xs text-gray-500 tracking-widest rotate-90 whitespace-nowrap">
              {collapsedLabel || title}
            </div>
          </div>
          <button
            onClick={onClose}
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
              {icon && <span className="text-xl">{icon}</span>}
              <span className="font-bold text-gray-800">{title}</span>
            </div>
            <div className="flex items-center gap-2">
              {headerActions}
              {onToggleCollapse && (
                <button
                  onClick={onToggleCollapse}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200"
                >
                  접힘
                </button>
              )}
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
          </div>

          {/* 본문 */}
          {children}

          {/* 푸터 CTA */}
          {footer && (
            <div className="px-5 py-4 border-t border-gray-200 bg-gray-50">
              {footer}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RightPanel;
