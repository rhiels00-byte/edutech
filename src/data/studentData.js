// 학생 데이터 (moodColor: null = 미응답)
export const studentsData = [
  { no: 1, name: '김서준', moodColor: 'bg-green-400', reward: 45, hasMemo: true, participation: 95, testRate: 100 },
  { no: 2, name: '이하은', moodColor: 'bg-red-400', reward: 32, hasMemo: true, participation: 60, testRate: 45 },
  { no: 3, name: '박도윤', moodColor: 'bg-blue-400', reward: 58, hasMemo: false, participation: 90, testRate: 88 },
  { no: 4, name: '최수아', moodColor: 'bg-green-400', reward: 52, hasMemo: false, participation: 85, testRate: 92 },
  { no: 5, name: '정예준', moodColor: 'bg-gray-800', reward: 28, hasMemo: false, participation: 55, testRate: 40 },
  { no: 6, name: '강지우', moodColor: null, reward: 48, hasMemo: false, participation: 88, testRate: 85 },
  { no: 7, name: '윤서연', moodColor: 'bg-red-400', reward: 35, hasMemo: false, participation: 70, testRate: 50 },
];

// 리워드 히스토리 데이터
export const rewardHistory = {
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
export const textbookSlides = [
  { id: 1, type: 'concept', icon: '💡', title: '개념' },
  { id: 2, type: 'problem', icon: '❓', title: '문제1' },
  { id: 3, type: 'example', icon: '📝', title: '예시' },
  { id: 4, type: 'problem', icon: '❓', title: '문제2' },
  { id: 5, type: 'problem', icon: '❓', title: '문제3' },
  { id: 6, type: 'review', icon: '🔄', title: '복습' },
  { id: 7, type: 'summary', icon: '📋', title: '정리' },
];

// 학생 제출 현황 데이터
export const textbookStudents = [
  { id: 1, name: '김지우', avatar: '🐻', submitted: true, status: 'correct', answer: '52', submissionNote: '(45 + 52 + 38 + 55 + 60) / 5', activityResults: { result1: { submitted: true, content: 'x + y = 24' }, result2: { submitted: true, content: '2x + y = 31' } } },
  { id: 2, name: '이서준', avatar: '🐰', submitted: true, status: 'wrong', answer: '48', activityResults: { result1: { submitted: true, content: 'x + y = 18' }, result2: { submitted: false, content: null } } },
  { id: 3, name: '박도윤', avatar: '🦊', submitted: true, status: 'correct', answer: '52', activityResults: { result1: { submitted: true, content: 'x + y = 27' }, result2: { submitted: true, content: 'x - y = 6' } } },
  { id: 4, name: '최수아', avatar: '🐱', submitted: false, status: null, answer: null, activityResults: { result1: { submitted: false, content: null }, result2: { submitted: false, content: null } } },
  { id: 5, name: '정예준', avatar: '🐶', submitted: true, status: 'correct', answer: '52', activityResults: { result1: { submitted: true, content: 'x + y = 22' }, result2: { submitted: true, content: 'x + 2y = 30' } } },
  { id: 6, name: '강지우', avatar: '🐼', submitted: false, status: null, answer: null, activityResults: { result1: { submitted: false, content: null }, result2: { submitted: true, content: 'x + y = 20' } } },
  { id: 7, name: '윤서연', avatar: '🐯', submitted: true, status: 'wrong', answer: '50', activityResults: { result1: { submitted: true, content: 'x - y = 2' }, result2: { submitted: false, content: null } } },
  { id: 8, name: '장민준', avatar: '🦁', submitted: true, status: 'correct', answer: '52', activityResults: { result1: { submitted: true, content: 'x + y = 26' }, result2: { submitted: true, content: '3x + y = 40' } } },
  { id: 9, name: '임하린', avatar: '🐷', submitted: false, status: null, answer: null, activityResults: { result1: { submitted: false, content: null }, result2: { submitted: false, content: null } } },
  { id: 10, name: '한시우', avatar: '🐸', submitted: true, status: 'correct', answer: '52', activityResults: { result1: { submitted: true, content: 'x + y = 19' }, result2: { submitted: true, content: 'x + 3y = 33' } } },
];

// 학생별 메모 데이터
export const studentMemos = {
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
export const initialMessages = {
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
