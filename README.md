# PhoenixDart PM MVP

피닉스다트 사내 프로젝트 관리를 위한 Vite 스타일 React MVP입니다.

## 구조

```text
src/
├─ components/
├─ data/
├─ pages/
├─ styles/
└─ utils/
```

## 포함 기능

- 프로젝트 목록 / 검색 / 생성 / 수정
- 프로젝트 상세 요약
- 태스크 등록 / 수정
- 상태 및 우선순위 변경
- 댓글 및 업데이트 로그
- 로컬스토리지 저장

## 실행

정식 Vite 실행 기준:

```bash
npm install
npm run dev
```

현재 이 워크스페이스에서는 정적 프리뷰도 가능하도록 `index.html`이 `src/main.js`를 직접 로드하도록 구성되어 있습니다.
