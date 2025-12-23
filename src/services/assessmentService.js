import {
  AssessmentCreationMethod,
  AssessmentKind,
  AssessmentStatus,
  AssessmentSubStatus
} from '../types/assessmentTypes';

// feature: assessment.service
// mappingStatus: Mocked
// apiCandidates (LMS mapping): GET /tch/eval/list, GET /tch/eval/info
// apiCandidates (LMS mapping): GET /stnt/eval/list, GET /stnt/eval/info
const ASSESSMENT_MOCKS = [
  // 할 일 (SCHEDULED) - 10개
  {
    id: 'a-200',
    title: '십만, 백만, 천만을 알아볼까요?',
    status: AssessmentStatus.SCHEDULED,
    subStatus: null,
    creationMethod: AssessmentCreationMethod.DIRECT,
    startsAt: '2025-03-14T00:00:00Z',
    endsAt: '2025-03-14T23:59:00Z',
    timeLimitMinutes: 30,
    submissions: { submitted: 0, total: 24 },
    needsGrading: false,
    questions: [
      {
        id: 'q-1',
        type: 'fill-in-blank',
        number: 3,
        title: '수를 쓰고 읽어 보세요.',
        parts: [
          {
            id: 'q-1-1',
            question: '10000이 5738개인 수',
            answers: {
              write: '',  // 쓰기
              read: ''    // 읽기
            },
            correctAnswers: {
              write: '57380000',
              read: '오천칠백삼십팔만'
            }
          },
          {
            id: 'q-1-2',
            question: '10000이 9560개인 수',
            answers: {
              write: '',
              read: ''
            },
            correctAnswers: {
              write: '95600000',
              read: '구천오백육십만'
            }
          }
        ]
      },
      {
        id: 'q-2',
        type: 'fill-in-blank',
        number: 4,
        title: '안에 알맞은 수를 써넣으세요.',
        parts: [
          {
            id: 'q-2-1',
            question: '10만이 46개인 수는 [____]입니다.',
            answer: '',
            correctAnswer: '4600000'
          },
          {
            id: 'q-2-2',
            question: '100만이 34개인 수는 [____]입니다.',
            answer: '',
            correctAnswer: '34000000'
          }
        ]
      },
      {
        id: 'q-3',
        type: 'multiple-choice',
        number: 5,
        title: '밑줄 친 숫자 6이 나타내는 값이 가장 작은 수를 찾아 ✓표 해 보세요.',
        question: '※ ✓를 클릭하세요.',
        options: [
          { id: 'opt-1', value: '29600000', label: '29̲600000' },
          { id: 'opt-2', value: '41360000', label: '4136̲0000' },
          { id: 'opt-3', value: '76800000', label: '7̲6800000' },
          { id: 'opt-4', value: '6250000', label: '̲6250000' }
        ],
        selectedAnswer: null,
        correctAnswer: '29600000',
        explanation: '29600000에서 6은 60만을 나타내며, 이것이 가장 작은 값입니다.'
      }
    ]
  },
  {
    id: 'a-201',
    title: '3단원 개념 확인 퀴즈',
    status: AssessmentStatus.SCHEDULED,
    subStatus: null,
    creationMethod: AssessmentCreationMethod.AI,
    startsAt: '2025-03-14T00:00:00Z',
    endsAt: '2025-03-14T23:59:00Z',
    timeLimitMinutes: 30,
    submissions: { submitted: 0, total: 24 },
    needsGrading: false
  },
  {
    id: 'a-202',
    title: '방정식 기초 문제풀이',
    status: AssessmentStatus.SCHEDULED,
    subStatus: null,
    creationMethod: AssessmentCreationMethod.DIRECT,
    startsAt: '2025-03-15T09:00:00Z',
    endsAt: '2025-03-15T10:30:00Z',
    timeLimitMinutes: 40,
    submissions: { submitted: 0, total: 24 },
    needsGrading: false
  },
  {
    id: 'a-203',
    title: '도형의 성질 단원평가',
    status: AssessmentStatus.SCHEDULED,
    subStatus: null,
    creationMethod: AssessmentCreationMethod.AI,
    startsAt: '2025-03-16T00:00:00Z',
    endsAt: '2025-03-16T23:59:00Z',
    timeLimitMinutes: 50,
    submissions: { submitted: 0, total: 24 },
    needsGrading: false
  },
  {
    id: 'a-204',
    title: '함수 개념 이해도 평가',
    status: AssessmentStatus.SCHEDULED,
    subStatus: null,
    creationMethod: AssessmentCreationMethod.PRESCRIPTION,
    startsAt: '2025-03-17T00:00:00Z',
    endsAt: '2025-03-18T23:59:00Z',
    timeLimitMinutes: 45,
    submissions: { submitted: 0, total: 24 },
    needsGrading: false
  },
  {
    id: 'a-205',
    title: '확률과 통계 진단평가',
    status: AssessmentStatus.SCHEDULED,
    subStatus: null,
    creationMethod: AssessmentCreationMethod.DIRECT,
    startsAt: '2025-03-19T00:00:00Z',
    endsAt: '2025-03-19T23:59:00Z',
    timeLimitMinutes: 40,
    submissions: { submitted: 0, total: 24 },
    needsGrading: false
  },
  {
    id: 'a-206',
    title: '기하학 기초 테스트',
    status: AssessmentStatus.SCHEDULED,
    subStatus: null,
    creationMethod: AssessmentCreationMethod.AI,
    startsAt: '2025-03-20T09:00:00Z',
    endsAt: '2025-03-20T10:00:00Z',
    timeLimitMinutes: 50,
    submissions: { submitted: 0, total: 24 },
    needsGrading: false
  },
  {
    id: 'a-207',
    title: '이차방정식 응용 평가',
    status: AssessmentStatus.SCHEDULED,
    subStatus: null,
    creationMethod: AssessmentCreationMethod.DIRECT,
    startsAt: '2025-03-21T00:00:00Z',
    endsAt: '2025-03-21T23:59:00Z',
    timeLimitMinutes: 60,
    submissions: { submitted: 0, total: 24 },
    needsGrading: false
  },
  {
    id: 'a-208',
    title: '삼각함수 개념 확인',
    status: AssessmentStatus.SCHEDULED,
    subStatus: null,
    creationMethod: AssessmentCreationMethod.AI,
    startsAt: '2025-03-22T00:00:00Z',
    endsAt: '2025-03-23T23:59:00Z',
    timeLimitMinutes: 35,
    submissions: { submitted: 0, total: 24 },
    needsGrading: false
  },
  {
    id: 'a-209',
    title: '미적분 기초 평가',
    status: AssessmentStatus.SCHEDULED,
    subStatus: null,
    creationMethod: AssessmentCreationMethod.PRESCRIPTION,
    startsAt: '2025-03-24T09:00:00Z',
    endsAt: '2025-03-24T11:00:00Z',
    timeLimitMinutes: 55,
    submissions: { submitted: 0, total: 24 },
    needsGrading: false
  },
  {
    id: 'a-210',
    title: '벡터와 공간도형 테스트',
    status: AssessmentStatus.SCHEDULED,
    subStatus: null,
    creationMethod: AssessmentCreationMethod.DIRECT,
    startsAt: '2025-03-25T00:00:00Z',
    endsAt: '2025-03-25T23:59:00Z',
    timeLimitMinutes: 45,
    submissions: { submitted: 0, total: 24 },
    needsGrading: false
  },

  // 하는 중 (LIVE) - 10개
  {
    id: 'a-101',
    title: '중간고사 - 방정식 단원',
    status: AssessmentStatus.LIVE,
    subStatus: null,
    creationMethod: AssessmentCreationMethod.DIRECT,
    startsAt: '2025-03-11T09:00:00Z',
    endsAt: '2025-03-11T10:00:00Z',
    timeLimitMinutes: 50,
    submissions: { submitted: 18, total: 24 },
    needsGrading: false
  },
  {
    id: 'a-111',
    title: '수열의 극한 개념 평가',
    status: AssessmentStatus.LIVE,
    subStatus: null,
    creationMethod: AssessmentCreationMethod.AI,
    startsAt: '2025-03-11T09:30:00Z',
    endsAt: '2025-03-11T11:00:00Z',
    timeLimitMinutes: 40,
    submissions: { submitted: 15, total: 24 },
    needsGrading: false
  },
  {
    id: 'a-112',
    title: '정적분 문제풀이',
    status: AssessmentStatus.LIVE,
    subStatus: null,
    creationMethod: AssessmentCreationMethod.DIRECT,
    startsAt: '2025-03-11T10:00:00Z',
    endsAt: '2025-03-11T11:30:00Z',
    timeLimitMinutes: 45,
    submissions: { submitted: 12, total: 24 },
    needsGrading: false
  },
  {
    id: 'a-113',
    title: '로그함수 응용',
    status: AssessmentStatus.LIVE,
    subStatus: null,
    creationMethod: AssessmentCreationMethod.PRESCRIPTION,
    startsAt: '2025-03-11T08:00:00Z',
    endsAt: '2025-03-11T12:00:00Z',
    timeLimitMinutes: 60,
    submissions: { submitted: 20, total: 24 },
    needsGrading: true
  },
  {
    id: 'a-114',
    title: '수학적 귀납법 실전',
    status: AssessmentStatus.LIVE,
    subStatus: null,
    creationMethod: AssessmentCreationMethod.AI,
    startsAt: '2025-03-11T09:00:00Z',
    endsAt: '2025-03-11T10:30:00Z',
    timeLimitMinutes: 50,
    submissions: { submitted: 10, total: 24 },
    needsGrading: false
  },
  {
    id: 'a-115',
    title: '행렬의 연산 평가',
    status: AssessmentStatus.LIVE,
    subStatus: null,
    creationMethod: AssessmentCreationMethod.DIRECT,
    startsAt: '2025-03-11T08:30:00Z',
    endsAt: '2025-03-11T10:00:00Z',
    timeLimitMinutes: 40,
    submissions: { submitted: 22, total: 24 },
    needsGrading: false
  },
  {
    id: 'a-116',
    title: '지수함수 개념 확인',
    status: AssessmentStatus.LIVE,
    subStatus: null,
    creationMethod: AssessmentCreationMethod.AI,
    startsAt: '2025-03-11T09:00:00Z',
    endsAt: '2025-03-11T10:20:00Z',
    timeLimitMinutes: 35,
    submissions: { submitted: 16, total: 24 },
    needsGrading: false
  },
  {
    id: 'a-117',
    title: '원의 방정식 문제풀이',
    status: AssessmentStatus.LIVE,
    subStatus: null,
    creationMethod: AssessmentCreationMethod.PRESCRIPTION,
    startsAt: '2025-03-11T08:00:00Z',
    endsAt: '2025-03-11T11:00:00Z',
    timeLimitMinutes: 55,
    submissions: { submitted: 19, total: 24 },
    needsGrading: true
  },
  {
    id: 'a-118',
    title: '삼각비 활용 평가',
    status: AssessmentStatus.LIVE,
    subStatus: null,
    creationMethod: AssessmentCreationMethod.DIRECT,
    startsAt: '2025-03-11T09:15:00Z',
    endsAt: '2025-03-11T10:45:00Z',
    timeLimitMinutes: 45,
    submissions: { submitted: 14, total: 24 },
    needsGrading: false
  },
  {
    id: 'a-119',
    title: '복소수 기본 개념',
    status: AssessmentStatus.LIVE,
    subStatus: null,
    creationMethod: AssessmentCreationMethod.AI,
    startsAt: '2025-03-11T09:00:00Z',
    endsAt: '2025-03-11T10:00:00Z',
    timeLimitMinutes: 30,
    submissions: { submitted: 11, total: 24 },
    needsGrading: false
  },

  // 끝 (ENDED) - 10개
  {
    id: 'a-103',
    title: '수학 개념 복습 테스트',
    status: AssessmentStatus.ENDED,
    subStatus: AssessmentSubStatus.NEEDS_GRADING,
    creationMethod: AssessmentCreationMethod.DIRECT,
    startsAt: '2025-03-01T00:00:00Z',
    endsAt: '2025-03-03T23:59:00Z',
    timeLimitMinutes: 40,
    submissions: { submitted: 22, total: 24 },
    needsGrading: true
  },
  {
    id: 'a-105',
    title: '성취도 진단 평가',
    status: AssessmentStatus.ENDED,
    subStatus: null,
    creationMethod: AssessmentCreationMethod.AI,
    startsAt: '2025-02-15T00:00:00Z',
    endsAt: '2025-02-15T23:00:00Z',
    timeLimitMinutes: 45,
    submissions: { submitted: 24, total: 24 },
    needsGrading: false
  },
  {
    id: 'a-131',
    title: '1학기 중간고사',
    status: AssessmentStatus.ENDED,
    subStatus: null,
    creationMethod: AssessmentCreationMethod.DIRECT,
    startsAt: '2025-02-20T09:00:00Z',
    endsAt: '2025-02-20T11:00:00Z',
    timeLimitMinutes: 60,
    submissions: { submitted: 24, total: 24 },
    needsGrading: false
  },
  {
    id: 'a-132',
    title: '함수 단원 종합평가',
    status: AssessmentStatus.ENDED,
    subStatus: null,
    creationMethod: AssessmentCreationMethod.AI,
    startsAt: '2025-02-25T00:00:00Z',
    endsAt: '2025-02-27T23:59:00Z',
    timeLimitMinutes: 50,
    submissions: { submitted: 23, total: 24 },
    needsGrading: false
  },
  {
    id: 'a-133',
    title: '집합과 명제 평가',
    status: AssessmentStatus.ENDED,
    subStatus: AssessmentSubStatus.NEEDS_GRADING,
    creationMethod: AssessmentCreationMethod.PRESCRIPTION,
    startsAt: '2025-02-28T09:00:00Z',
    endsAt: '2025-02-28T10:30:00Z',
    timeLimitMinutes: 45,
    submissions: { submitted: 21, total: 24 },
    needsGrading: true
  },
  {
    id: 'a-134',
    title: '다항식의 연산 테스트',
    status: AssessmentStatus.ENDED,
    subStatus: null,
    creationMethod: AssessmentCreationMethod.DIRECT,
    startsAt: '2025-03-02T00:00:00Z',
    endsAt: '2025-03-04T23:59:00Z',
    timeLimitMinutes: 40,
    submissions: { submitted: 24, total: 24 },
    needsGrading: false
  },
  {
    id: 'a-135',
    title: '인수분해 응용 문제',
    status: AssessmentStatus.ENDED,
    subStatus: null,
    creationMethod: AssessmentCreationMethod.AI,
    startsAt: '2025-03-05T09:00:00Z',
    endsAt: '2025-03-05T10:40:00Z',
    timeLimitMinutes: 50,
    submissions: { submitted: 22, total: 24 },
    needsGrading: false
  },
  {
    id: 'a-136',
    title: '평면좌표 개념 평가',
    status: AssessmentStatus.ENDED,
    subStatus: null,
    creationMethod: AssessmentCreationMethod.PRESCRIPTION,
    startsAt: '2025-03-06T00:00:00Z',
    endsAt: '2025-03-08T23:59:00Z',
    timeLimitMinutes: 35,
    submissions: { submitted: 24, total: 24 },
    needsGrading: false
  },
  {
    id: 'a-137',
    title: '부등식의 영역 문제',
    status: AssessmentStatus.ENDED,
    subStatus: null,
    creationMethod: AssessmentCreationMethod.DIRECT,
    startsAt: '2025-03-07T09:00:00Z',
    endsAt: '2025-03-07T10:30:00Z',
    timeLimitMinutes: 45,
    submissions: { submitted: 23, total: 24 },
    needsGrading: false
  },
  {
    id: 'a-138',
    title: '순열과 조합 실전',
    status: AssessmentStatus.ENDED,
    subStatus: AssessmentSubStatus.NEEDS_GRADING,
    creationMethod: AssessmentCreationMethod.AI,
    startsAt: '2025-03-09T00:00:00Z',
    endsAt: '2025-03-10T23:59:00Z',
    timeLimitMinutes: 55,
    submissions: { submitted: 20, total: 24 },
    needsGrading: true
  },
  {
    id: 'a-139',
    title: '십만, 백만, 천만을 알아볼까요? (3)',
    status: AssessmentStatus.ENDED,
    subStatus: null,
    creationMethod: AssessmentCreationMethod.DIRECT,
    startsAt: '2025-12-28T00:00:00Z',
    endsAt: '2025-12-30T23:59:00Z',
    timeLimitMinutes: 30,
    submissions: { submitted: 22, total: 24 },
    needsGrading: false,
    questions: [
      {
        id: 'q-1',
        type: 'fill-in-blank',
        number: 3,
        title: '수를 쓰고 읽어 보세요.',
        parts: [
          {
            id: 'q-1-1',
            question: '10000이 4926개인 수',
            answers: {
              write: '',
              read: ''
            },
            correctAnswers: {
              write: '49260000',
              read: '사천구백이십육만'
            }
          },
          {
            id: 'q-1-2',
            question: '10000이 7183개인 수',
            answers: {
              write: '',
              read: ''
            },
            correctAnswers: {
              write: '71830000',
              read: '칠천백팔십삼만'
            }
          }
        ]
      },
      {
        id: 'q-2',
        type: 'fill-in-blank',
        number: 4,
        title: '안에 알맞은 수를 써넣으세요.',
        parts: [
          {
            id: 'q-2-1',
            question: '10만이 39개인 수는 [____]입니다.',
            answer: '',
            correctAnswer: '3900000'
          },
          {
            id: 'q-2-2',
            question: '100만이 48개인 수는 [____]입니다.',
            answer: '',
            correctAnswer: '48000000'
          }
        ]
      },
      {
        id: 'q-3',
        type: 'multiple-choice',
        number: 5,
        title: '밑줄 친 숫자 8이 나타내는 값이 가장 작은 수를 찾아 ✓표 해 보세요.',
        question: '※ ✓를 클릭하세요.',
        options: [
          { id: 'opt-1', value: '18340000', label: '1̲8340000' },
          { id: 'opt-2', value: '82560000', label: '̲82560000' },
          { id: 'opt-3', value: '46780000', label: '467̲80000' },
          { id: 'opt-4', value: '93800000', label: '93̲800000' }
        ],
        selectedAnswer: null,
        correctAnswer: '46780000',
        explanation: '46780000에서 8은 80만을 나타내며, 이것이 가장 작은 값입니다.'
      }
    ]
  },

  // 편집중 (DRAFT) - 3개
  {
    id: 'a-104',
    title: '개별 맞춤 처방 평가',
    status: AssessmentStatus.DRAFT,
    subStatus: null,
    creationMethod: AssessmentCreationMethod.PRESCRIPTION,
    lastSavedAt: '2025-03-10T11:15:00Z',
    startsAt: '2025-03-20T00:00:00Z',
    endsAt: '2025-03-22T23:59:00Z',
    timeLimitMinutes: 60,
    submissions: { submitted: 0, total: 24 },
    needsGrading: false
  },
  {
    id: 'a-142',
    title: '십만, 백만, 천만을 알아볼까요? (2)',
    status: AssessmentStatus.DRAFT,
    subStatus: null,
    creationMethod: AssessmentCreationMethod.DIRECT,
    lastSavedAt: '2025-12-20T14:30:00Z',
    startsAt: '2025-12-25T00:00:00Z',
    endsAt: '2025-12-27T23:59:00Z',
    timeLimitMinutes: 30,
    submissions: { submitted: 0, total: 24 },
    needsGrading: false,
    questions: [
      {
        id: 'q-1',
        type: 'fill-in-blank',
        number: 3,
        title: '수를 쓰고 읽어 보세요.',
        parts: [
          {
            id: 'q-1-1',
            question: '10000이 6842개인 수',
            answers: {
              write: '',
              read: ''
            },
            correctAnswers: {
              write: '68420000',
              read: '육천팔백사십이만'
            }
          },
          {
            id: 'q-1-2',
            question: '10000이 8375개인 수',
            answers: {
              write: '',
              read: ''
            },
            correctAnswers: {
              write: '83750000',
              read: '팔천삼백칠십오만'
            }
          }
        ]
      },
      {
        id: 'q-2',
        type: 'fill-in-blank',
        number: 4,
        title: '안에 알맞은 수를 써넣으세요.',
        parts: [
          {
            id: 'q-2-1',
            question: '10만이 53개인 수는 [____]입니다.',
            answer: '',
            correctAnswer: '5300000'
          },
          {
            id: 'q-2-2',
            question: '100만이 27개인 수는 [____]입니다.',
            answer: '',
            correctAnswer: '27000000'
          }
        ]
      },
      {
        id: 'q-3',
        type: 'multiple-choice',
        number: 5,
        title: '밑줄 친 숫자 5이 나타내는 값이 가장 작은 수를 찾아 ✓표 해 보세요.',
        question: '※ ✓를 클릭하세요.',
        options: [
          { id: 'opt-1', value: '15200000', label: '1̲5200000' },
          { id: 'opt-2', value: '52840000', label: '̲52840000' },
          { id: 'opt-3', value: '38560000', label: '385̲60000' },
          { id: 'opt-4', value: '64500000', label: '645̲00000' }
        ],
        selectedAnswer: null,
        correctAnswer: '38560000',
        explanation: '38560000에서 5는 50만을 나타내며, 이것이 가장 작은 값입니다.'
      }
    ]
  },
  {
    id: 'a-141',
    title: '학기말 종합평가 (준비중)',
    status: AssessmentStatus.DRAFT,
    subStatus: null,
    creationMethod: AssessmentCreationMethod.DIRECT,
    lastSavedAt: '2025-03-12T15:40:00Z',
    startsAt: '2025-04-01T00:00:00Z',
    endsAt: '2025-04-03T23:59:00Z',
    timeLimitMinutes: 90,
    submissions: { submitted: 0, total: 24 },
    needsGrading: false
  },
  {
    id: 'h-201',
    kind: AssessmentKind.HOMEWORK,
    title: '분수 단원 숙제',
    status: AssessmentStatus.SCHEDULED,
    subStatus: null,
    creationMethod: AssessmentCreationMethod.DIRECT,
    lastSavedAt: '2025-03-07T09:30:00Z',
    startsAt: '2025-03-15T00:00:00Z',
    endsAt: '2025-03-18T23:59:00Z',
    timeLimitMinutes: 40,
    submissions: { submitted: 0, total: 24 },
    needsGrading: false
  },
  {
    id: 'h-202',
    kind: AssessmentKind.HOMEWORK,
    title: '소수 개념 숙제',
    status: AssessmentStatus.LIVE,
    subStatus: null,
    creationMethod: AssessmentCreationMethod.IMPORT,
    lastSavedAt: '2025-03-12T12:30:00Z',
    startsAt: '2025-03-12T00:00:00Z',
    endsAt: '2025-03-16T23:59:00Z',
    timeLimitMinutes: 35,
    submissions: { submitted: 9, total: 24 },
    needsGrading: false
  },
  {
    id: 'h-203',
    kind: AssessmentKind.HOMEWORK,
    title: '도형 이해 숙제',
    status: AssessmentStatus.ENDED,
    subStatus: null,
    creationMethod: AssessmentCreationMethod.AI,
    lastSavedAt: '2025-02-20T11:05:00Z',
    startsAt: '2025-02-25T00:00:00Z',
    endsAt: '2025-02-27T23:59:00Z',
    timeLimitMinutes: 50,
    submissions: { submitted: 21, total: 24 },
    needsGrading: true
  },
  {
    id: 'h-204',
    kind: AssessmentKind.HOMEWORK,
    title: '기초 연산 숙제',
    status: AssessmentStatus.DRAFT,
    subStatus: null,
    creationMethod: AssessmentCreationMethod.PRESCRIPTION,
    lastSavedAt: '2025-03-10T11:15:00Z',
    startsAt: '2025-03-20T00:00:00Z',
    endsAt: '2025-03-22T23:59:00Z',
    timeLimitMinutes: 60,
    submissions: { submitted: 0, total: 24 },
    needsGrading: false
  }
];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const assessmentService = {
  async list({ kind } = {}) {
    await delay(200);
    if (!kind) return ASSESSMENT_MOCKS;
    return ASSESSMENT_MOCKS.filter((assessment) => {
      const assessmentKind = assessment.kind || AssessmentKind.EXAM;
      return assessmentKind === kind;
    });
  },
  async get(id) {
    await delay(200);
    return ASSESSMENT_MOCKS.find((assessment) => assessment.id === id) || null;
  },
  async create() {
    // TODO: POST /assessments
    throw new Error('Not implemented');
  },
  async update() {
    // TODO: PATCH /assessments/:id
    throw new Error('Not implemented');
  },
  async remove() {
    // TODO: DELETE /assessments/:id
    throw new Error('Not implemented');
  },
  async publish() {
    // TODO: POST /assessments/:id/publish
    throw new Error('Not implemented');
  },
  async run() {
    // TODO: POST /assessments/:id/run
    throw new Error('Not implemented');
  }
};
