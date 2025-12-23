# AI 변경 요약 (2024-12-22 15:00 이후 ~ 현재)

이 문서는 `edutech` 폴더 내 변경 흔적을 기준으로 정리한 요약입니다.
에이전트(Gemini/Codex/Claude)별 상세 attribution은 저장되어 있지 않아, 파일/기능 기준으로 정리했습니다.

## 1) UIUX 관련 파일
- `src/components/assessments/AssessmentCard.jsx`
  - 시험/숙제 공통 카드 정책, 상태별 버튼 노출, 카드 전체 클릭/버튼 분기 처리
  - 제출현황 바/정보 표기 일관화
- `src/pages/viewer/ViewerStartPage.jsx`
  - 상단/하단/우측 도구 최소화, 전체 화면 확장, 제출현황 패널 정리
  - 분석 보기 버튼과 연동 가능한 패널 확장 포인트 추가
- `src/pages/viewer/ViewerResultPage.jsx`
  - 결과 분석 패널을 RightPanel 스타일로 구성, 탭 전환 정답률/분포
- `src/pages/viewer/ViewerStatusPage.jsx`
  - 제출 현황 패널 단순화(학생 상세/피드백 제거, O/X 표시 유지)

## 2) 숙제 관련 파일
- `src/pages/HomeworkPage.jsx`
  - 숙제 목록/허브/뷰어 라우팅 구성
  - 시작하기는 viewer-start만 열리도록 제한(자동 수업 시작 없음)
- `src/services/assessmentService.js`
  - 숙제 더미 데이터 추가 및 kind 필터링
- `src/types/assessmentTypes.ts`
  - 숙제/시험 구분을 위한 `AssessmentKind` 추가
- `src/components/assessments/AssessmentCard.jsx`
  - 숙제 상태별 날짜/문구/버튼 정책 반영

## 3) 시험 관련 파일
- `src/pages/AssessmentsPage.jsx`
  - 시험 목록/허브/뷰어 라우팅 구성
  - 시작하기 시 viewer-start + 자동 수업 시작
- `src/services/assessmentService.js`
  - 시험 더미 데이터 및 목록 필터링
- `src/types/assessmentTypes.ts`
  - 시험/숙제 공통 모델 확장
- `src/components/assessments/AssessmentCard.jsx`
  - 시험 상태별 날짜/문구/버튼 정책 반영

## 4) LNB 관련 파일
- `src/components/LNB.jsx`
  - 시험/숙제 메뉴 연동 및 기본 동작 유지
- `src/App.jsx`
  - viewer 모드 진입 시 LNB/모바일 헤더 숨김 처리

## 5) 홈 관련 파일
- `src/pages/HomePage.jsx`
  - 홈 화면 내 메뉴/서브메뉴 흐름 정리 (현재 상태 기준)

## 6) 교과서 관련 파일
- `src/pages/TextbookPage.jsx`
  - 기존 교과서 레이아웃 기준점
- `src/pages/viewer/ViewerStartPage.jsx`
  - 교과서 화면을 평가 뷰어로 축소/정리하여 재사용

## 참고: 새로 생성/확장된 폴더
- `src/components/assessments/`
- `src/pages/viewer/`
- `src/pages/assessments/`
- `src/services/`, `src/types/`, `src/utils/`

## 주요 정책/개선 포인트 요약
- 시험/숙제 목록 카드에 상태별 CTA 단일화, 카드 전체 클릭 vs 버튼 클릭 분리
- viewer-start 공통화(시험/숙제), 상단/우측/하단 UI 최소화
- viewer-result에서 분석 패널을 제출현황 패널 UI로 재활용
- 평가/숙제 흐름을 뷰어/허브/결과/리포트로 분리 구성
