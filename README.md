# PhoenixDart Workflow PM

PhoenixDart의 여러 팀이 프로젝트를 단계별로 전달하고, 확인하고, 일정 응답과 QA 대응, 오픈 상태까지 한 화면에서 관리할 수 있도록 만든 운영형 프로젝트 관리 툴입니다.

## Overview

- 기본 성격: 프로젝트 관리 툴
- MVP 차별점: 팀 간 전달 / 확인 / 일정 회신 / QA / 오픈 상태 관리
- 핵심 사용자: 프로젝트 오너, 단계 담당자, QA 담당자, 참조 사용자

## Core Routes

- `/` 메인 대시보드
- `/projects` 프로젝트 목록 성격의 메인 진입
- `/projects/new` 프로젝트 생성
- `/project/:id` 프로젝트 상세
- `/inbox` 확인 / 전달 대기함

## Documentation

- [User Scenarios](./docs/user-scenarios.md)
- [Page Plan](./docs/page-plan.md)
- [Implementation Plan](./docs/implementation_plan.md)
- [Content Plan](./docs/content_plan.md)
- [Task Model](./docs/task.md)
- [Design Guide](./docs/design_guide.md)
- [Environment Setup Plan](./docs/environment_setup_plan.md)

## MVP Scope

- 프로젝트 등록 / 수정
- 프로젝트 상세 관리
- 업무 리스트 / 칸반 보기
- 진행률 자동 계산
- QA 이슈 등록
- 전달 / 확인 흐름 관리
- 대시보드 및 대기함

## Local Preview

```bash
node scripts/build-static.mjs
node scripts/preview-static.mjs --root . --host 127.0.0.1 --port 4173
```
