# FRONTEND_UI_INVENTORY

## Routes (App.jsx)
- main: 홈(기본), activeMenu/activeSubMenu 기반 페이지 전환
- note: 노트(알림장/메모장)
- reward: 리워드 관리
- recentActivity: 최근 활동(캘린더)
- chat: 학생 개별 메시지
- allMessages: 전체 메시지 목록
- textbook: 교과서(전체 화면)

## Pages and Features

### HomePage.jsx
- NoticeAndMemoBoard
  - featureKey: home.note.board
  - 하위 탭
    - home.note.tab.notice
    - home.note.tab.memo
- RewardHistoryPage
  - featureKey: home.reward.history
- StudentMemoPage
  - featureKey: home.class.studentMemo
- MonthCalendar
  - featureKey: home.calendar.month
- RecentActivityPage
  - featureKey: home.recentActivity.calendar
- StudentChatPage
  - featureKey: home.class.chat.detail
- AllMessagesPage
  - featureKey: home.class.chat.list
- TodayPage
  - featureKey: home.today
  - 섹션
    - home.today.todo
    - home.today.activityStatus
    - home.today.weekSchedule
    - home.today.noticePreview
    - home.today.recentActivity
- ClassPage
  - featureKey: home.class
  - 섹션
    - home.class.quickTools
    - home.class.summary.mood
    - home.class.summary.testRate
    - home.class.summary.participation
    - home.class.studentList
    - home.class.studentActions.memo
    - home.class.studentActions.chat
    - home.class.studentActions.reward

### TextbookPage.jsx
- featureKey: textbook.page
- 섹션
  - textbook.curriculum.tree
  - textbook.slide.list
  - textbook.lesson.state
  - textbook.submission.status
  - textbook.annotation
  - textbook.tools.panel
  - textbook.monitoring
  - textbook.ai.practice
  - textbook.activity.start
  - textbook.class.gather
  - textbook.bookmark
  - textbook.qna
  - textbook.bestAnswer.view
  - textbook.together.mode

### LNB.jsx
- featureKey: nav.lnb
- 책임: 메인 메뉴/서브메뉴, 교과서 진입, 알림/고객센터/프로필 영역
- 사용 props/state
  - props: isCollapsed, setIsCollapsed, activeMenu, setActiveMenu, activeSubMenu, setActiveSubMenu, onOpenTextbook
  - state: expandedMenus

### RightPanel.jsx
- featureKey: ui.rightPanel.shell
- 책임: 도킹 패널 공통 레이아웃/접힘 상태
- 사용 props
  - title, icon, isCollapsed, onToggleCollapse, onClose, headerActions, children, footer, collapsedLabel, width

## Dummy Data Usage
- data/studentData.js
  - studentsData, rewardHistory, textbookSlides, textbookStudents, studentMemos, initialMessages
  - 사용처: HomePage.jsx, TextbookPage.jsx, App.jsx
