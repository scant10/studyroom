# 팀 AI 규칙

> 실습 B에서 이 파일을 채웁니다. 양식: docs/templates/03-AGENTS.template.md

## 프로젝트
- 스택: Node.js 22 (TypeScript, 외부 라이브러리 없음), 테스트는 node:test
- 구조: src/http (라우터), src/domain (규칙), test (인수조건 테스트)

## 반드시
- Given/When/Then 시나리오를 test/ 디렉토리에 node:test로 자동화할 것
- 도메인 규칙(예약 중복 검사, 시간 검증)은 src/domain/에 순수 함수로 작성할 것
- 에러 응답은 { code, message } 형식을 따를 것

## 금지
- 테스트를 고치거나 지워서 통과시키기 금지
- 외부 라이브러리(npm install) 추가 금지
- HttpError 외에 새로운 에러 클래스 만들기 금지

## 끝내기 전에
- npm run check 통과
