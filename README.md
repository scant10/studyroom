# 스터디룸 예약 서비스 — 팀 작업 폴더

> 1일 과정 「바이브 코딩 시대의 스크럼」 Part 6 실습. 이 폴더가 팀의 작업 공간입니다.

- **AI 도구(Claude Code 등)는 이 폴더에서만 엽니다.** 실습 가이드는 강사가 공유한 웹 링크나, 자료 저장소에서 `node lab.mjs guide`로 엽니다.
- 시작 코드와 양식만 들어 있습니다. 정답 예시는 `after` 브랜치에 있고, **스프린트를 끝낸 뒤에** 봅니다.

```bash
npm test        # 맨 아래 "pass 2"가 보이면 준비 완료
npm start       # http://localhost:3000
npm run check   # 테스트 + 시크릿 검사 (DoD 확인용)
```

## 팀 저장소로 올리기 (대표 1명, 가이드 1-1)

GitHub에 빈 저장소 `studyroom`을 만든 뒤(Private, README·.gitignore 추가 체크 해제) 이 폴더에서:

```bash
git remote add origin https://github.com/<내아이디>/studyroom.git
git push -u origin main before after
```

## 브랜치

| 브랜치 | 내용 |
| --- | --- |
| `main` | 시작 코드 + 양식. 여기서 시작합니다 |
| `before` | "스터디룸 예약 서비스 만들어줘" 한 줄로 만든 바이브 코딩 버전 (디브리핑 비교용) |
| `after` | 스펙·규칙 파일·테스트를 적용한 버전 (디브리핑 비교, 늦어진 팀 따라잡기) |
