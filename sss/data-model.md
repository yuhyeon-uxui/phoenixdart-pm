# PhoenixDart Workflow PM 데이터 모델 문서 초안 v1

---

# 1. 목적

이 문서는 피닉스다트 운영형 워크플로우 프로젝트 관리 툴의 MVP 구현을 위한 기본 데이터 구조를 정의합니다.

MVP 기준으로 아래 6개 엔티티를 사용합니다.

- Project
- Task
- Handoff
- QaIssue
- ActivityLog
- User
- Team

---

# 2. 전체 관계 구조

## 관계 요약

- 프로젝트(Project) 1개는 여러 개의 업무(Task)를 가진다.
- 프로젝트(Project) 1개는 여러 개의 전달 단계(Handoff)를 가진다.
- 프로젝트(Project) 1개는 여러 개의 QA 이슈(QaIssue)를 가진다.
- 프로젝트(Project) 1개는 여러 개의 활동 로그(ActivityLog)를 가진다.
- 사용자(User) 1명은 여러 프로젝트/업무/이슈에 연결될 수 있다.
- 팀(Team) 1개는 여러 사용자와 여러 전달 단계에 연결될 수 있다.

---

## 구조 개념

```text
Project
 ├── Task[]
 ├── Handoff[]
 ├── QaIssue[]
 └── ActivityLog[]
```

---

# 3. Project

## 설명

프로젝트의 최상위 단위입니다.

프로젝트의 기본 정보, 상태, 오픈 상태, 현재 단계, 진행률 등을 관리합니다.

---

## 필드 정의

| 필드명 | 타입 | 필수 | 설명 | 예시 |
|---|---|---|---|---|
| id | string | Y | 프로젝트 고유 ID | proj_001 |
| name | string | Y | 프로젝트명 | 배포 점검 시트 |
| description | text | N | 프로젝트 설명 | 배포 전후 점검 항목 관리 프로젝트 |
| projectType | enum | Y | 프로젝트 유형 | 프로모션 |
| operationType | enum | Y | 운영 속성 | 반복성 |
| status | enum | Y | 프로젝트 진행 상태 | 진행중 |
| openStatus | enum | Y | 실제 오픈 상태 | 오픈 전 |
| priority | enum | N | 프로젝트 우선순위 | 보통 |
| ownerUserId | string | Y | 프로젝트 오너 사용자 ID | user_001 |
| ownerTeamId | string | N | 프로젝트 오너 팀 ID | team_ops |
| currentStage | enum | Y | 현재 단계 | 개발 |
| nextTeamId | string | N | 다음 전달 대상 팀 | team_dev |
| progress | number | Y | 진행률(0~100) | 40 |
| startDate | date | N | 시작일 | 2026-05-01 |
| endDate | date | N | 종료일 | 2026-05-31 |
| createdAt | datetime | Y | 생성일시 | 2026-05-19T10:00:00+09:00 |
| updatedAt | datetime | Y | 수정일시 | 2026-05-19T14:20:00+09:00 |

---

## 상태값 예시

### projectType

- 신규서비스
- 운영개선
- 이벤트
- 프로모션

---

### operationType

- 단발성
- 반복성
- 상시운영

---

### status

- 예정
- 진행중
- QA 진행중
- 배포 준비
- 운영중
- 종료

---

### openStatus

- 오픈 전
- 내부 오픈
- 전체 오픈
- 운영 종료

---

# 4. Task

## 설명

프로젝트 내부의 실제 실행 업무 단위입니다.

진행률 계산의 기준이 되는 핵심 데이터입니다.

---

## 필드 정의

| 필드명 | 타입 | 필수 | 설명 | 예시 |
|---|---|---|---|---|
| id | string | Y | 업무 고유 ID | task_001 |
| projectId | string | Y | 소속 프로젝트 ID | proj_001 |
| title | string | Y | 업무 제목 | 배포 체크리스트 작성 |
| description | text | N | 업무 설명 | 배포 전 확인 항목 문서화 |
| status | enum | Y | 업무 상태 | 진행중 |
| assigneeUserId | string | N | 담당자 ID | user_013 |
| assigneeTeamId | string | N | 담당팀 ID | team_ops |
| startDate | date | N | 시작일 | 2026-05-20 |
| dueDate | date | N | 마감일 | 2026-05-25 |
| priority | enum | N | 우선순위 | 높음 |
| sortOrder | number | N | 정렬용 순서값 | 1 |
| createdAt | datetime | Y | 생성일시 | 2026-05-19T10:10:00+09:00 |
| updatedAt | datetime | Y | 수정일시 | 2026-05-19T11:40:00+09:00 |

---

## 상태값

### 업무 상태

- 예정
- 진행중
- QA
- 완료

---

### 우선순위

- 높음
- 보통
- 낮음

---

## 진행률 계산 규칙

```text
progress = (완료 상태 업무 수 / 전체 업무 수) × 100
```

### 규칙

- 상태가 `완료`인 업무만 완료 처리
- 전체 업무 수가 0이면 진행률은 0%

---

# 5. Handoff

## 설명

팀 간 전달, 확인, 일정 회신을 관리하는 MVP 핵심 엔티티입니다.

---

## 필드 정의

| 필드명 | 타입 | 필수 | 설명 | 예시 |
|---|---|---|---|---|
| id | string | Y | 전달 항목 ID | handoff_001 |
| projectId | string | Y | 소속 프로젝트 ID | proj_001 |
| stageName | enum | Y | 단계명 | 디자인 QA |
| fromTeamId | string | N | 전달한 팀 | team_design |
| toTeamId | string | Y | 전달받을 팀 | team_dev |
| ownerUserId | string | N | 현재 단계 담당자 ID | user_021 |
| status | enum | Y | 전달 상태 | 확인 완료 |
| isDelivered | boolean | Y | 전달 완료 여부 | true |
| deliveredAt | datetime | N | 전달 시각 | 2026-05-19T13:00:00+09:00 |
| isConfirmed | boolean | Y | 확인 완료 여부 | true |
| confirmedAt | datetime | N | 확인 시각 | 2026-05-19T14:00:00+09:00 |
| etaDate | date | N | 예상 완료일 | 2026-05-24 |
| isEtaSubmitted | boolean | Y | 일정 회신 여부 | true |
| etaSubmittedAt | datetime | N | 일정 회신 시각 | 2026-05-19T14:10:00+09:00 |
| isCompleted | boolean | Y | 해당 단계 완료 여부 | false |
| completedAt | datetime | N | 완료 시각 | null |
| note | text | N | 전달/확인 메모 | QA 후 개발 재확인 필요 |
| createdAt | datetime | Y | 생성일시 | 2026-05-19T13:00:00+09:00 |
| updatedAt | datetime | Y | 수정일시 | 2026-05-19T14:10:00+09:00 |

---

## 단계명 예시

- 디자인
- 개발
- 디자인 QA
- 로컬라이징
- 최종 검수
- 배포
- 운영 이관

---

## 전달 상태값

- 전달 전
- 전달 완료
- 확인 완료
- 일정 회신 완료
- 작업중
- 완료

---

# 6. QaIssue

## 설명

QA 및 검수 과정에서 발생하는 이슈/버그를 관리합니다.

---

## 필드 정의

| 필드명 | 타입 | 필수 | 설명 | 예시 |
|---|---|---|---|---|
| id | string | Y | QA 이슈 ID | qa_001 |
| projectId | string | Y | 소속 프로젝트 ID | proj_001 |
| taskId | string | N | 관련 업무 ID | task_003 |
| title | string | Y | 이슈 제목 | 다국어 문구 줄바꿈 깨짐 |
| description | text | N | 이슈 상세 설명 | 영문/일문에서 버튼 폭 초과 |
| assigneeUserId | string | N | 담당자 ID | user_031 |
| assigneeTeamId | string | N | 담당팀 ID | team_qa |
| severity | enum | Y | 심각도 | 보통 |
| status | enum | Y | QA 이슈 상태 | 재검증 중 |
| createdDate | date | Y | 등록일 | 2026-05-19 |
| resolvedAt | datetime | N | 해결 시각 | null |
| createdAt | datetime | Y | 생성일시 | 2026-05-19T15:10:00+09:00 |
| updatedAt | datetime | Y | 수정일시 | 2026-05-19T17:00:00+09:00 |

---

## 심각도 상태값

- 높음
- 보통
- 낮음

---

## QA 상태값

- 테스트 전
- 테스트 중
- 이슈 수정 중
- 재검증 중
- QA 완료
- 실패
- 반려

---

# 7. ActivityLog

## 설명

프로젝트에서 발생한 주요 액션을 시간순으로 기록합니다.

---

## 필드 정의

| 필드명 | 타입 | 필수 | 설명 | 예시 |
|---|---|---|---|---|
| id | string | Y | 로그 ID | log_001 |
| projectId | string | Y | 소속 프로젝트 ID | proj_001 |
| actorUserId | string | N | 액션 수행자 ID | user_001 |
| actorName | string | Y | 액션 수행자명 | 김지훈 |
| actionType | enum | Y | 액션 유형 | task_completed |
| targetType | enum | Y | 대상 유형 | task |
| targetId | string | N | 대상 ID | task_001 |
| message | string | Y | 표시 문구 | 업무가 완료 처리되었습니다. |
| createdAt | datetime | Y | 기록 시각 | 2026-05-19T16:20:00+09:00 |

---

## actionType 예시

- project_created
- task_created
- task_updated
- task_completed
- handoff_sent
- handoff_confirmed
- eta_submitted
- qa_issue_created
- qa_issue_updated
- release_done
- open_status_changed

---

# 8. User

## 설명

실제 시스템의 사용자를 나타냅니다.

MVP에서는 최소 정보만 관리합니다.

---

## 필드 정의

| 필드명 | 타입 | 필수 | 설명 | 예시 |
|---|---|---|---|---|
| id | string | Y | 사용자 ID | user_001 |
| name | string | Y | 이름 | 김지훈 |
| email | string | N | 이메일 | jihun@phoenixdart.com |
| teamId | string | N | 소속 팀 ID | team_ops |
| role | enum | N | 역할 | project_owner |
| isActive | boolean | Y | 활성 여부 | true |

---

## 역할 예시

- project_owner
- team_member
- qa_owner
- reviewer
- viewer

---

# 9. Team

## 설명

프로젝트 전달 흐름의 단위가 되는 조직/팀 정보입니다.

---

## 필드 정의

| 필드명 | 타입 | 필수 | 설명 | 예시 |
|---|---|---|---|---|
| id | string | Y | 팀 ID | team_design |
| name | string | Y | 팀명 | 디자인팀 |
| code | string | N | 팀 코드 | DESIGN |
| description | text | N | 팀 설명 | 프로덕트 디자인 및 디자인 QA 담당 |

---

# 10. MVP 기준 최소 관계도

## 프로젝트 중심 관계

```text
Project 1 : N Task
Project 1 : N Handoff
Project 1 : N QaIssue
Project 1 : N ActivityLog
```

---

## 조직 및 배정 관계

```text
Team 1 : N User
Team 1 : N Handoff (to/from 관계)

User 1 : N Task
User 1 : N QaIssue
User 1 : N ActivityLog
```

---

# 11. MVP 기준 핵심 상태 규칙

## 프로젝트 진행 상태

- 예정
- 진행중
- QA 진행중
- 배포 준비
- 운영중
- 종료

---

## 업무 상태

- 예정
- 진행중
- QA
- 완료

---

## 오픈 상태

- 오픈 전
- 내부 오픈
- 전체 오픈
- 운영 종료

---

## 전달 상태

- 전달 전
- 전달 완료
- 확인 완료
- 일정 회신 완료
- 작업중
- 완료

---

# 12. 이후 확장 가능 포인트 (Backlog)

- [ ] 반복 프로젝트 템플릿 기능
- [ ] 팀별 SLA(Service Level Agreement) 트래킹
- [ ] 결재/승인 워크플로우 엔진 도입
- [ ] 실시간 Slack / Jira 웹훅 알림 연동
- [ ] 파일 첨부 및 댓글/멘션 기능
- [ ] 단계별 가중치를 반영한 진행률 계산
- [ ] 최종 운영 오픈 체크리스트 강제화

---

# 13. 한 줄 요약

MVP 데이터 구조는 `Project`를 중심으로 `Task`, `Handoff`, `QaIssue`, `ActivityLog`가 유기적으로 연결되는 운영형 워크플로우 구조로 설계합니다.
