# API_MAPPING_DRAFT

Mapping 기준: `LMS_API_UI_Mapping_Template.xlsx`의 `UI_API_Mapping_Template` 시트 (H: to-be URI, I: description).

## Home

| featureKey | mappingStatus | apiCandidates | evidence (H / I) |
| --- | --- | --- | --- |
| home.note.tab.notice | Existing | GET /tch/dsbd/notice/list, POST /tch/dsbd/notice/save, POST /tch/dsbd/notice/delete, POST /tch/dsbd/notice/pin/update | H: /tch/dsbd/notice/list, I: [교사] 학급관리 > 홈 대시보드 > 홈 공지사항 조회; H: /tch/dsbd/notice/save, I: 공지사항 등록; H: tch/dsbd/notice/delete, I: 공지사항 삭제; H: /tch/dsbd/notice/pin/update, I: 공지사항 고정여부 수정 |
| home.note.tab.memo | Existing (Needs API change if studentFilter param missing) | GET /tch/dsbd/memo/list, POST /tch/dsbd/memo/save, POST /tch/dsbd/memo/update, POST /tch/dsbd/memo/delete | H: /tch/dsbd/memo/list, I: 메모 목록 조회; H: /tch/dsbd/memo/save, I: 메모 등록; H: /tch/dsbd/memo/update, I: 메모 수정; H: /tch/dsbd/memo/delete, I: 메모 삭제 |
| home.reward.history | Existing | GET /tch/reward/list, GET /tch/reward/status, POST /tch/reward/update | H: /tch/reward/list, I: 학생리워드 현황 목록 조회; H: /tch/reward/status, I: 학생리워드 현황 조회; H: /tch/reward/update, I: 학생 리워드 조정 |
| home.calendar.month | Existing | GET /tch/dsbd/calendar/list, GET /tch/dsbd/calendar/detail | H: /tch/dsbd/calendar/list, I: 우리반 학습 현황 캘린더 조회; H: /tch/dsbd/calendar/detail, I: 캘린더 상세 조회 |
| home.recentActivity.calendar | Existing | GET /tch/dsbd/calendar/list, GET /tch/dsbd/calendar/detail | H: /tch/dsbd/calendar/list, I: 우리반 학습 현황 캘린더 조회; H: /tch/dsbd/calendar/detail, I: 캘린더 상세 조회 |
| home.today.noticePreview | Existing | GET /tch/dsbd/notice/list | H: /tch/dsbd/notice/list, I: 홈 공지사항 조회 |
| home.class.studentList | Existing | GET /v1/teacher/classInfo, GET /v1/teacher/classMemberInfo | H: /v1/teacher/classInfo, I: 교사 반 정보 조회; H: /v1/teacher/classMemberInfo, I: 교사 학생 정보 조회 |
| home.class.summary.mood | Existing | GET /etc/tdymd/stnt/last/detail | H: /etc/tdymd/stnt/last/detail, I: 클래스 기준으로 모든 학생들의 최근 기분 조회 |
| home.class.quickTools | Needs new API | - | (UI 전용 바로가기; API 없음) |
| home.today.todo | Needs new API | - | (UI 전용 할 일/바로가기; API 없음) |
| home.today.recentActivity | Needs new API | - | (UI 전용 최근 활동 카드; API 없음) |
| home.class.chat.list | Needs new API | - | (UI 전용 메시지 목록; API 없음) |
| home.class.chat.detail | Needs new API | - | (UI 전용 메시지 상세; API 없음) |

## Textbook

| featureKey | mappingStatus | apiCandidates | evidence (H / I) |
| --- | --- | --- | --- |
| textbook.curriculum.tree | Existing | GET /textbook/crcu/list, GET /textbook/meta/crcu/list | H: /textbook/crcu/list, I: 교과서 커리큘럼 목록 조회; H: /textbook/meta/crcu/list, I: 교과서 학습맵 커리큘럼 목록 조회 |
| textbook.lesson.state | Existing | POST /tch/std/start, POST /tch/std/end | H: /tch/std/start, I: 수업시작시 시간 저장; H: /tch/std/end, I: 수업종료시 시간 저장 |
| textbook.slide.list | Existing | GET /tch/std/lastpage/call, POST /tch/std/lastpage/save | H: /tch/std/lastpage/call, I: 마지막 화면 정보 호출; H: /tch/std/lastpage/save, I: 마지막 화면 정보 저장 |
| textbook.submission.status | Existing | GET /tch/lecture/mdul/qstn/indi, POST /tch/lecture/mdul/qstn/fdb, POST /tch/lecture/mdul/qstn/reset | H: /tch/lecture/mdul/qstn/indi, I: 제출현황,개별답안; H: /tch/lecture/mdul/qstn/fdb, I: 피드백 보내기; H: /tch/lecture/mdul/qstn/reset, I: 다시하기/틀린학생만 |
| textbook.bestAnswer.view | Existing | POST /tch/lecture/mdul/qstn/exclnt, POST /tch/lecture/mdul/qstn/exclnt/reset | H: /tch/lecture/mdul/qstn/exclnt, I: 우수답안선정; H: /tch/lecture/mdul/qstn/exclnt/reset, I: 우수답안선정 취소 |
| textbook.annotation | Existing | POST /tch/lecture/mdul/note/save, POST /tch/lecture/mdul/note/view, POST /tch/lecture/mdul/note/share | H: /tch/lecture/mdul/note/save, I: (교사)손글씨 저장; H: /tch/lecture/mdul/note/view, I: (교사)손글씨 호출; H: /tch/lecture/mdul/note/share, I: 판서 학생 공유 |
| textbook.tools.panel | Existing | GET /tch/tool/edit/bar/call, POST /tch/tool/edit/bar/save, GET /tch/screen/control/settings, POST /tch/screen/control/settings | H: /tch/tool/edit/bar/call, I: 툴편집(호출); H: /tch/tool/edit/bar/save, I: 툴편집(저장); H: /tch/screen/control/settings, I: 화면 제어 설정 조회/저장 |
| textbook.qna | Existing | POST /tch/mdul/quest, POST /tch/mdul/quest/comment, POST /tch/mdul/quest/readall | H: /tch/mdul/quest, I: 질문하기; H: /tch/mdul/quest/comment, I: 질문 댓글달기; H: /tch/mdul/quest/readall, I: 질문하기(읽음처리) |
| textbook.ai.practice | Existing | GET /tch/airecommend/eng/target/list | H: /tch/airecommend/eng/target/list, I: AI맞춤학습-대상학생목록 |
| textbook.monitoring | Compose | GET /tch/dsbd/statistic/participant/list, GET /v1/teacher/classMemberInfo | H: /tch/dsbd/statistic/participant/list, I: 접속학생통계 조회; H: /v1/teacher/classMemberInfo, I: 교사 학생 정보 조회 |
| textbook.activity.start | Needs new API | - | (UI 전용 활동 시작 설정; API 없음) |
| textbook.class.gather | Needs new API | - | (UI 전용 모으기; API 없음) |
| textbook.bookmark | Needs new API | - | (UI 전용 북마크; API 없음) |
| textbook.together.mode | Needs new API | - | (UI 전용 함께 보기; API 없음) |
