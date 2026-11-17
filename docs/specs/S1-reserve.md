# 스토리 + 인수조건

## 스토리

회원으로서, 날짜·시간을 골라 스터디룸을 예약해서 공부 공간을 확보하고 싶다.

Sprint Goal과의 관계: 회원이 스터디룸을 겹치지 않게 예약하고, 관리자가 하루 현황을 한눈에 본다.

## 인수조건

```gherkin
시나리오: 정상 경로 - 예약 성공
  Given A룸이 2026-11-18 14:00-16:00에 비어 있고
  And   X-Member-Id 헤더가 "user1"이고
  When  POST /api/reservations { roomId: "A", date: "2026-11-18", startTime: "14:00", endTime: "16:00" }
  Then  201 CREATED 응답
  And   본문에 예약 정보 { id, roomId, date, startTime, endTime, memberId }

시나리오: 예외 경로 1 - 시간 겹침
  Given A룸이 2026-11-18 14:00-16:00에 이미 예약되어 있고
  And   X-Member-Id 헤더가 "user2"이고
  When  POST /api/reservations { roomId: "A", date: "2026-11-18", startTime: "15:00", endTime: "17:00" }
  Then  409 CONFLICT 응답
  And   본문 { code: "RESERVATION_CONFLICT", message: "해당 시간에 이미 예약이 있습니다." }

시나리오: 예외 경로 2 - 인증 헤더 없음
  Given X-Member-Id 헤더가 없고
  When  POST /api/reservations { roomId: "A", date: "2026-11-18", startTime: "14:00", endTime: "16:00" }
  Then  401 UNAUTHORIZED 응답
  And   본문 { code: "UNAUTHORIZED", message: "회원 인증이 필요합니다." }

시나리오: 예외 경로 3 - 존재하지 않는 룸
  Given X-Member-Id 헤더가 "user1"이고
  When  POST /api/reservations { roomId: "X", date: "2026-11-18", startTime: "14:00", endTime: "16:00" }
  Then  404 NOT_FOUND 응답
  And   본문 { code: "ROOM_NOT_FOUND", message: "존재하지 않는 룸입니다." }

시나리오: 예외 경로 4 - 과거 시각 예약
  Given 현재 시각이 2026-11-18 15:00 (KST)이고
  And   X-Member-Id 헤더가 "user1"이고
  When  POST /api/reservations { roomId: "A", date: "2026-11-18", startTime: "14:00", endTime: "15:00" }
  Then  400 BAD_REQUEST 응답
  And   본문 { code: "INVALID_TIME", message: "과거 시각은 예약할 수 없습니다." }

시나리오: 예외 경로 5 - 운영 시간 외
  Given X-Member-Id 헤더가 "user1"이고
  When  POST /api/reservations { roomId: "A", date: "2026-11-18", startTime: "08:00", endTime: "09:00" }
  Then  400 BAD_REQUEST 응답
  And   본문 { code: "INVALID_TIME", message: "운영 시간(09:00-22:00)을 벗어났습니다." }

시나리오: 예외 경로 6 - 최대 시간 초과
  Given X-Member-Id 헤더가 "user1"이고
  When  POST /api/reservations { roomId: "A", date: "2026-11-18", startTime: "10:00", endTime: "15:00" }
  Then  400 BAD_REQUEST 응답
  And   본문 { code: "INVALID_TIME", message: "최대 4시간까지만 예약할 수 있습니다." }
```

## 제약 · 금지

- 따라야 할 계약: AGENTS.md의 프로젝트 규칙
- 시간 단위: 30분 (09:00, 09:30, 10:00...)
- 운영 시간: 09:00 ~ 22:00 (KST)
- 최대 예약 길이: 4시간
- 겹침 판단: [시작, 종료) 반개구간 (예: [14:00, 16:00)와 [16:00, 18:00)는 겹치지 않음)
- 인증: X-Member-Id 헤더 필수
- 하지 말 것: 외부 라이브러리 사용, 테스트 수정/삭제로 통과시키기

## 체크 (INVEST + α)

- [x] 다른 스토리 없이 독립적으로 개발할 수 있다
- [x] 한 PR(400줄 이내)로 끝낼 수 있을 만큼 작다
- [x] 정상 경로 1개 + 예외 경로 5개 이상
- [x] 숫자·상태 코드가 구체적이다 (201, 400, 401, 404, 409)
- [x] 인수조건을 그대로 자동 테스트로 옮길 수 있다
- [x] 참조할 계약과 금지 사항이 적혀 있다
