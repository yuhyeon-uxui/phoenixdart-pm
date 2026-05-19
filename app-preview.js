const { useEffect, useMemo, useState } = React;
const h = React.createElement;

const STATUS_OPTIONS = ["전체", "진행중", "QA 진행중", "예정", "QA 준비", "안정화중", "운영중", "종료"];
const DETAIL_TABS = [
  { key: "overview", label: "개요" },
  { key: "tasks", label: "업무" },
  { key: "roadmap", label: "로드맵" },
  { key: "qa", label: "QA" },
];
const SORT_OPTIONS = ["마감 임박순", "추천순", "진행률 높은순", "우선순위 높은순", "이름순"];
const TASK_STATUS_OPTIONS = ["예정", "진행중", "QA", "완료"];
const TASK_PRIORITY_OPTIONS = ["높음", "보통", "낮음"];
const PROJECT_CREATE_STATUS_OPTIONS = ["예정", "진행중", "QA 준비", "QA 진행중", "운영중"];
const QA_ISSUE_STATUS_OPTIONS = ["예정", "진행중", "QA", "완료"];
const QA_ISSUE_SEVERITY_OPTIONS = ["높음", "보통", "낮음"];

const PROJECT_SEEDS = [
  ["proj-1", "사내 포털 리뉴얼", "플랫폼팀", "김지훈", "진행중", "QA 진행중", 64, 4, "내부 포털 UI와 접근성, 운영 편의성을 함께 개선하는 대표 프로젝트입니다."],
  ["proj-2", "영업지원 CRM 개편", "영업운영팀", "정도윤", "예정", "테스트 전", 25, 1, "영업 파이프라인과 고객 대응 이력을 한 화면에서 정리합니다."],
  ["proj-3", "채용 파이프라인 자동화", "인사팀", "한주원", "QA 진행중", "재검증 중", 33, 2, "채용 단계별 일정, 알림, 협업 흐름을 자동화하는 운영 프로젝트입니다."],
  ["proj-4", "정산 배치 모니터링", "재무시스템팀", "박서윤", "안정화중", "QA 완료", 91, 1, "야간 정산 배치와 장애 알림 흐름을 안정화하고 있습니다."],
  ["proj-5", "고객센터 상담허브", "CX팀", "이하은", "진행중", "테스트 중", 58, 3, "상담 이력과 운영 메모, QA 대응 내역을 하나로 모읍니다."],
  ["proj-6", "주문 백오피스 개선", "커머스개발팀", "박현우", "QA 준비", "테스트 전", 47, 2, "주문 조회와 취소, 재처리 업무를 더 빠르게 처리할 수 있게 개선합니다."],
  ["proj-7", "재고 알림 자동화", "물류운영팀", "최유진", "운영중", "QA 완료", 100, 0, "재고 임계치 감지와 운영 알림을 자동화해 실시간 대응성을 높였습니다."],
  ["proj-8", "사내 SSO 전환", "보안플랫폼팀", "이서준", "안정화중", "이슈 수정 중", 88, 5, "기존 로그인 체계를 통합 SSO 기반으로 전환하는 보안 프로젝트입니다."],
  ["proj-9", "매장 운영 리포트", "데이터운영팀", "김수빈", "진행중", "테스트 중", 52, 2, "매장별 운영 현황과 이슈를 리포트 형식으로 제공하는 서비스입니다."],
  ["proj-10", "고객 알림센터 통합", "메시징팀", "장민서", "예정", "테스트 전", 18, 0, "카카오톡, 이메일, 앱푸시 발송 이력을 통합 관리합니다."],
  ["proj-11", "반품 회수 프로세스", "물류기획팀", "오지민", "진행중", "재검증 중", 61, 3, "반품 접수부터 회수 완료까지 운영 흐름을 표준화합니다."],
  ["proj-12", "이벤트 쿠폰 운영도구", "마케팅운영팀", "문가영", "QA 준비", "테스트 전", 42, 1, "쿠폰 발급과 노출 조건, 만료 처리 업무를 운영툴에서 직접 관리합니다."],
  ["proj-13", "파트너 정산 포털", "파트너성장팀", "류지안", "진행중", "테스트 중", 57, 4, "파트너사 정산 내역과 문의 대응 이력을 한 곳에서 관리합니다."],
  ["proj-14", "출고 SLA 대시보드", "SCM팀", "배지호", "운영중", "QA 완료", 100, 0, "출고 지연과 SLA 위반 리스크를 모니터링하는 운영 대시보드입니다."],
  ["proj-15", "VOC 분류 자동화", "CX데이터팀", "송예빈", "진행중", "이슈 수정 중", 49, 6, "VOC 카테고리 분류와 우선순위 태깅을 자동화합니다."],
  ["proj-16", "프로모션 검수 플로우", "브랜드운영팀", "남도현", "QA 진행중", "테스트 중", 72, 2, "프로모션 배너와 문구 검수, 재검수 요청 흐름을 정리합니다."],
  ["proj-17", "현장 점검 체크리스트", "운영혁신팀", "임채원", "예정", "테스트 전", 14, 0, "오프라인 점검 체크리스트와 후속 조치 이력을 기록합니다."],
  ["proj-18", "센터 권한관리 정비", "IT운영팀", "서지민", "안정화중", "QA 완료", 93, 1, "운영 계정 권한 정책과 승인 이력을 재정비하는 작업입니다."],
  ["proj-19", "배포 점검 시트", "서비스운영팀", "유태현", "QA 준비", "재검증 중", 66, 2, "배포 전후 점검 항목과 QA 결과를 팀 단위로 관리합니다."],
  ["proj-20", "CS 매크로 개선", "고객지원팀", "한시온", "진행중", "테스트 중", 54, 3, "상담 매크로와 답변 템플릿을 실제 운영 흐름에 맞게 개선합니다."],
];

function safeText(value, fallback = "-") {
  if (value === undefined || value === null || value === "") return fallback;
  return String(value);
}

function safeCount(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function safePercent(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 0;
  return Math.max(0, Math.min(100, parsed));
}

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
}

function formatShortDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

function formatDateTime(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return `${formatDate(value)} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function initials(name) {
  return safeText(name, "미지정").replace(/\s+/g, "").slice(0, 2).toUpperCase();
}

function toneFromName(name) {
  const tones = ["slate", "blue", "emerald", "violet"];
  const hash = Array.from(safeText(name, "미지정")).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return tones[hash % tones.length];
}

function iconSvg(name) {
  const icons = {
    folder: '<path d="M3.5 6.5h5l2 2H20a1.5 1.5 0 0 1 1.5 1.5V18A1.5 1.5 0 0 1 20 19.5H4A1.5 1.5 0 0 1 2.5 18V8A1.5 1.5 0 0 1 4 6.5z"/><path d="M3 8.5h18"/>',
    shield: '<path d="M12 3.5 19 6v5c0 4.8-3.1 8.4-7 10-3.9-1.6-7-5.2-7-10V6z"/><path d="m9.3 12 1.8 1.9 3.7-4.1"/>',
    alert: '<path d="M12 4.5 20 18.5H4z"/><path d="M12 9.5v4.2"/><circle cx="12" cy="16" r=".7" fill="currentColor" stroke="none"/>',
    bolt: '<path d="M13.3 2.8 5.5 13h4.8l-.8 8.2L18.5 11h-4.8z"/>',
    checkCircle: '<circle cx="12" cy="12" r="8.5"/><path d="m8.7 12.4 2.2 2.2 4.5-4.8"/>',
    team: '<path d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="M16.5 10a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/><path d="M3.8 18a4.2 4.2 0 0 1 8.4 0"/><path d="M13.4 17.8a3.5 3.5 0 0 1 6.8 0"/>',
    issue: '<circle cx="12" cy="12" r="8.5"/><path d="M12 8v4.4"/><circle cx="12" cy="16.3" r=".7" fill="currentColor" stroke="none"/>',
    calendar: '<rect x="4" y="5.5" width="16" height="14" rx="2"/><path d="M8 3.8v3.4M16 3.8v3.4M4 9.5h16"/>',
    arrowLeft: '<path d="m14.5 5.5-6 6 6 6"/><path d="M8.5 11.5h10"/>',
    chevronDown: '<path d="m6.5 9.5 5.5 5 5.5-5"/>',
    chevronUp: '<path d="m6.5 14.5 5.5-5 5.5 5"/>',
    plus: '<path d="M12 5v14"/><path d="M5 12h14"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5v5l3 1.8"/>',
  };
  return icons[name] || icons.folder;
}

function Icon({ name, className = "" }) {
  return h("span", {
    className: `icon ${className}`.trim(),
    dangerouslySetInnerHTML: {
      __html: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${iconSvg(name)}</svg>`,
    },
  });
}

function Avatar({ name }) {
  return h("span", { className: `avatar avatar-${toneFromName(name)}` }, initials(name));
}

function getStatusStyle(status) {
  return {
    예정: "planned",
    진행중: "in-progress",
    QA: "qa",
    "QA 진행중": "qa",
    "QA 준비": "qa",
    완료: "done",
    종료: "done",
    운영중: "live",
    안정화중: "live",
    보류: "hold",
    지연: "delayed",
    검토: "qa",
  }[safeText(status, "예정")] || "planned";
}

function getQaStatusStyle(status) {
  return {
    "테스트 전": "qa-before",
    "테스트 중": "qa-testing",
    "재검증 중": "qa-retesting",
    "QA 완료": "qa-done",
    "이슈 수정 중": "qa-fixing",
    실패: "qa-failed",
    반려: "qa-failed",
    미설정: "qa-before",
  }[safeText(status, "미설정")] || "qa-before";
}

function getPriorityStyle(priority) {
  return {
    높음: "high",
    보통: "medium",
    낮음: "low",
  }[safeText(priority, "보통")] || "medium";
}

function statusClassName(status) {
  return getStatusStyle(status);
}

function qaClassName(status) {
  return getQaStatusStyle(status);
}

function priorityClassName(priority) {
  return getPriorityStyle(priority);
}

function buildTasks(projectId, owner, qaStatus, issueCount, index) {
  const tasks = [
    {
      id: `${projectId}-task-1`,
      title: "로그인 개선",
      assignee: owner,
      type: "기능",
      status: index % 4 === 0 ? "예정" : "진행중",
      priority: safeCount(issueCount) > 2 ? "높음" : "보통",
      dueDate: `2026-04-${String(8 + (index % 8)).padStart(2, "0")}`,
      startDate: `2026-04-${String(1 + (index % 5)).padStart(2, "0")}`,
      memo: "기본 로그인 흐름과 예외 케이스를 함께 정리합니다.",
    },
    {
      id: `${projectId}-task-2`,
      title: "결제 기능",
      assignee: "QA 담당",
      type: "QA",
      status: ["테스트 중", "재검증 중", "QA 완료"].includes(qaStatus) ? "QA" : "예정",
      priority: "보통",
      dueDate: `2026-04-${String(12 + (index % 8)).padStart(2, "0")}`,
      startDate: `2026-04-${String(3 + (index % 5)).padStart(2, "0")}`,
      memo: "결제 시나리오별 체크리스트와 재검증 항목을 관리합니다.",
    },
    {
      id: `${projectId}-task-3`,
      title: "배포 후 점검",
      assignee: "운영팀",
      type: "운영",
      status: safeCount(issueCount) > 0 ? "진행중" : "완료",
      priority: safeCount(issueCount) > 1 ? "높음" : "낮음",
      dueDate: `2026-04-${String(17 + (index % 7)).padStart(2, "0")}`,
      startDate: `2026-04-${String(6 + (index % 5)).padStart(2, "0")}`,
      memo: "배포 이후 모니터링과 장애 대응 항목을 빠르게 확인합니다.",
    },
    {
      id: `${projectId}-task-4`,
      title: "QA 체크리스트 작성",
      assignee: "QA 담당",
      type: "QA",
      status: qaStatus === "테스트 전" ? "예정" : qaStatus === "QA 완료" ? "완료" : "QA",
      priority: "보통",
      dueDate: `2026-04-${String(10 + (index % 8)).padStart(2, "0")}`,
      startDate: `2026-04-${String(4 + (index % 5)).padStart(2, "0")}`,
      memo: "기능별 체크리스트와 검증 조건을 문서화합니다.",
    },
  ];

  return tasks;
}

function buildActivity(projectId, owner, index) {
  return [
    {
      id: `${projectId}-activity-1`,
      actor: owner,
      message: "프로젝트 일정이 조정되었습니다.",
      timestamp: `2026-04-${String(21 - (index % 4)).padStart(2, "0")}T09:10:00`,
    },
    {
      id: `${projectId}-activity-2`,
      actor: "QA팀",
      message: "QA 시작 및 검증 항목이 공유되었습니다.",
      timestamp: `2026-04-${String(20 - (index % 4)).padStart(2, "0")}T14:30:00`,
    },
    {
      id: `${projectId}-activity-3`,
      actor: "운영팀",
      message: "오픈 이슈가 등록되었습니다.",
      timestamp: `2026-04-${String(19 - (index % 4)).padStart(2, "0")}T11:20:00`,
    },
  ];
}

function buildIssues(projectId, issueCount, index) {
  const count = Math.max(0, safeCount(issueCount));
  const issueSeeds = [
    {
      title: "로그인 오류 재현 및 원인 파악",
      assignee: "운영팀",
      severity: "높음",
      status: "진행중",
      description: "배포 이후 로그인 예외 케이스가 반복 보고되어 원인 분석이 필요합니다.",
      createdDate: `2026-04-${String(15 + (index % 5)).padStart(2, "0")}`,
    },
    {
      title: "재검증 요청된 케이스 정리",
      assignee: "QA팀",
      severity: "보통",
      status: "QA",
      description: "수정 반영 후 다시 확인해야 하는 QA 시나리오를 정리합니다.",
      createdDate: `2026-04-${String(17 + (index % 5)).padStart(2, "0")}`,
    },
    {
      title: "배포 후 오류 로그 확인",
      assignee: "개발팀",
      severity: "높음",
      status: "진행중",
      description: "실서비스 로그를 기준으로 오류 영향 범위와 재현 경로를 확인합니다.",
      createdDate: `2026-04-${String(19 + (index % 5)).padStart(2, "0")}`,
    },
  ];

  return issueSeeds.slice(0, count).map((issue, issueIndex) => ({
    id: `${projectId}-issue-${issueIndex + 1}`,
    ...issue,
  }));
}

function calculateProjectProgress(tasks) {
  const total = Array.isArray(tasks) ? tasks.length : 0;
  if (!total) return 0;
  const completedCount = tasks.filter((task) => safeText(task.status, "") === "완료").length;
  return Math.round((completedCount / total) * 100);
}

function withDerivedProjectFields(project) {
  const tasks = Array.isArray(project.tasks) ? project.tasks : [];
  const issues = Array.isArray(project.issues) ? project.issues : [];
  return {
    ...project,
    tasks,
    issues,
    progress: calculateProjectProgress(tasks),
    issueCount: issues.length,
  };
}

function buildProject(seed, index) {
  const [id, name, team, owner, status, qaStatus, progress, issueCount, description] = seed;
  const tasks = buildTasks(id, owner, qaStatus, issueCount, index);
  const issues = buildIssues(id, issueCount, index);
  return withDerivedProjectFields({
    id,
    name,
    team: safeText(team, "미지정"),
    owner: safeText(owner, "미지정"),
    status: safeText(status, "예정"),
    qaStatus: safeText(qaStatus, "미설정"),
    progress: safePercent(progress),
    issueCount: safeCount(issueCount),
    description: safeText(description, "-"),
    startDate: `2026-04-${String(1 + (index % 12)).padStart(2, "0")}`,
    endDate: `2026-05-${String(10 + (index % 18)).padStart(2, "0")}`,
    participants: [safeText(owner, "미지정"), "QA 담당", "운영팀"],
    tasks,
    issues,
    activity: buildActivity(id, owner, index),
    priority: index % 3 === 0 ? "높음" : index % 3 === 1 ? "보통" : "낮음",
  });
}

function loadProjects() {
  return PROJECT_SEEDS.map(buildProject);
}

function parseRoute(pathname) {
  if (pathname === "/projects") {
    return { page: "projects", id: null };
  }
  if (pathname === "/projects/new") {
    return { page: "new-project", id: null };
  }
  if (pathname === "/inbox") {
    return { page: "inbox", id: null };
  }
  const match = pathname.match(/^\/project\/([^/]+)$/);
  if (match) {
    return { page: "detail", id: decodeURIComponent(match[1]) };
  }
  return { page: "dashboard", id: null };
}

function navigateTo(path) {
  if (window.location.pathname === path) return;
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function getKpis(projects) {
  const tasks = projects.flatMap((project) => project.tasks);
  return [
    { label: "진행 중 프로젝트", value: `${projects.filter((project) => project.status === "진행중").length}개`, icon: "folder", tone: "blue" },
    { label: "QA 중 프로젝트", value: `${projects.filter((project) => project.status === "QA 진행중" || project.qaStatus === "테스트 중" || project.qaStatus === "재검증 중").length}개`, icon: "shield", tone: "emerald" },
    { label: "오픈 이슈", value: `${projects.reduce((sum, project) => sum + safeCount(project.issueCount), 0)}건`, icon: "alert", tone: "amber" },
    { label: "즉시 대응 업무", value: `${tasks.filter((task) => task.priority === "높음" && task.status !== "완료").length}건`, icon: "bolt", tone: "rose" },
    { label: "QA 관련 액션", value: `${tasks.filter((task) => task.type === "QA" && task.status !== "완료").length}건`, icon: "checkCircle", tone: "violet" },
  ];
}

function getFocusTasks(projects) {
  return projects
    .flatMap((project) =>
      project.tasks.map((task) => ({
        ...task,
        projectName: project.name,
      }))
    )
    .sort((a, b) => {
      const priorityScore = { 높음: 0, 보통: 1, 낮음: 2 };
      const aScore = priorityScore[safeText(a.priority, "보통")] ?? 1;
      const bScore = priorityScore[safeText(b.priority, "보통")] ?? 1;
      if (aScore !== bScore) return aScore - bScore;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    })
    .slice(0, 3);
}

function getRecentActivity(projects) {
  return projects
    .flatMap((project) =>
      project.activity.map((item) => ({
        ...item,
        projectName: project.name,
      }))
    )
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 3);
}

function getInboxSections(projects) {
  const pendingProjects = projects
    .filter((project) => ["진행중", "QA 준비", "QA 진행중"].includes(safeText(project.status, "")))
    .slice(0, 5)
    .map((project) => ({
      id: `${project.id}-confirm`,
      projectId: project.id,
      title: project.name,
      meta: `${safeText(project.owner, "미지정")} · ${safeText(project.status, "예정")}`,
      badge: "확인 필요",
      tone: "qa",
    }));

  const etaPending = projects
    .flatMap((project) =>
      project.tasks
        .filter((task) => safeText(task.status, "") === "예정")
        .map((task) => ({
          id: `${project.id}-${task.id}-eta`,
          projectId: project.id,
          title: task.title,
          meta: `${project.name} · ${safeText(task.assignee, "미지정")}`,
          badge: "일정 회신",
          tone: "planned",
        }))
    )
    .slice(0, 5);

  const qaRequests = projects
    .filter((project) => ["테스트 중", "재검증 중", "이슈 수정 중"].includes(safeText(project.qaStatus, "")))
    .slice(0, 5)
    .map((project) => ({
      id: `${project.id}-qa`,
      projectId: project.id,
      title: project.name,
      meta: `QA 상태 · ${safeText(project.qaStatus, "미설정")}`,
      badge: "QA 확인",
      tone: "qa",
    }));

  return [
    { key: "confirm", title: "내가 확인해야 하는 프로젝트", copy: "다음 단계 전달을 확인해야 하는 프로젝트입니다.", items: pendingProjects },
    { key: "eta", title: "일정 회신이 필요한 업무", copy: "예상 일정 회신이 필요한 항목입니다.", items: etaPending },
    { key: "qa", title: "QA 확인 요청", copy: "QA 또는 재검증 대응이 필요한 프로젝트입니다.", items: qaRequests },
  ];
}

function getProjectPriorityScore(project) {
  const highestPriority = project.tasks?.reduce((score, task) => {
    const current = { 높음: 3, 보통: 2, 낮음: 1 }[safeText(task.priority, "보통")] || 1;
    return Math.max(score, current);
  }, 1);
  return highestPriority || 1;
}

function getProjectRecommendationScore(project) {
  const today = new Date("2026-04-24T00:00:00");
  const endDate = new Date(project.endDate);
  const dueInDays = Number.isNaN(endDate.getTime()) ? Number.MAX_SAFE_INTEGER : Math.ceil((endDate.getTime() - today.getTime()) / 86400000);
  const issueCount = safeCount(project.issueCount);
  const progress = safePercent(project.progress);

  let score = 0;

  if (dueInDays <= 3) {
    score += 50;
  } else if (dueInDays <= 7) {
    score += 30;
  } else if (dueInDays <= 14) {
    score += 10;
  }

  if (issueCount >= 5) {
    score += 30;
  } else if (issueCount >= 1) {
    score += 15;
  }

  if (project.qaStatus === "테스트 중" || project.qaStatus === "재검증 중" || project.status === "QA 진행중") {
    score += 20;
  } else if (project.qaStatus === "테스트 전" || project.status === "QA 준비") {
    score += 10;
  }

  if (project.status === "진행중") {
    score += 20;
  } else if (project.status === "예정") {
    score += 5;
  }

  if (progress <= 50) {
    score += 10;
  } else if (progress >= 80) {
    score -= 5;
  }

  return score;
}

function getRoadmapItems(project) {
  const timelineStart = new Date("2026-04-01T00:00:00");
  const timelineEnd = new Date("2026-07-31T00:00:00");
  const totalDays = Math.max(1, Math.round((timelineEnd - timelineStart) / 86400000) + 1);
  const labels = ["인증", "결제", "QA", "운영", "배포"];
  const components = ["웹", "백엔드", "운영툴", "모바일"];
  const monthStarts = [
    new Date("2026-04-01T00:00:00"),
    new Date("2026-05-01T00:00:00"),
    new Date("2026-06-01T00:00:00"),
    new Date("2026-07-01T00:00:00"),
  ];

  const datedTasks = (project.tasks || []).filter((task) => {
    const hasStartDate = !!safeText(task.startDate, "").trim();
    const hasDueDate = !!safeText(task.dueDate, "").trim();
    return hasStartDate && hasDueDate;
  });

  const rows = datedTasks.map((task, index) => {
    const start = new Date(task.startDate || timelineStart);
    const end = new Date(task.dueDate || task.startDate || timelineStart);
    const safeStart = Number.isNaN(start.getTime()) ? timelineStart : start;
    const safeEnd = Number.isNaN(end.getTime()) ? safeStart : end;
    const startOffset = Math.max(0, Math.round((safeStart - timelineStart) / 86400000));
    const duration = Math.max(5, Math.round((safeEnd - safeStart) / 86400000) + 1);
    const left = Math.max(0, Math.min(95, (startOffset / totalDays) * 100));
    const width = Math.max(6, Math.min(100 - left, (duration / totalDays) * 100));
    const codePrefix = task.type === "QA" ? "QA" : "PD";
    const status = safeText(task.status, "예정");
    const progressMap = {
      예정: 18,
      진행중: 62,
      QA: 84,
      완료: 100,
      지연: 48,
    };

    return {
      id: `${project.id}-${task.id}-roadmap`,
      key: `${codePrefix}-${101 + index * 7}`,
      title: safeText(task.title, "로드맵 작업"),
      assignee: safeText(task.assignee, "미지정"),
      label: labels[index % labels.length],
      component: components[index % components.length],
      status,
      progress: progressMap[status] ?? 0,
      startDate: safeStart.toISOString(),
      endDate: safeEnd.toISOString(),
      period: `${formatShortDate(safeStart)} ~ ${formatShortDate(safeEnd)}`,
      left,
      width,
      level: index === 0 ? 0 : task.type === "QA" || index % 3 === 0 ? 1 : 0,
      isEpic: index === 0,
    };
  });

  return {
    rows,
    months: [
      { key: "2026-04", label: "4월", left: 0, width: (30 / totalDays) * 100 },
      { key: "2026-05", label: "5월", left: ((monthStarts[1] - timelineStart) / 86400000 / totalDays) * 100, width: (31 / totalDays) * 100 },
      { key: "2026-06", label: "6월", left: ((monthStarts[2] - timelineStart) / 86400000 / totalDays) * 100, width: (30 / totalDays) * 100 },
      { key: "2026-07", label: "7월", left: ((monthStarts[3] - timelineStart) / 86400000 / totalDays) * 100, width: (31 / totalDays) * 100 },
    ],
    weekLines: [0, 12.5, 25, 37.5, 50, 62.5, 75, 87.5],
    todayLeft: 38,
  };
}

function roadmapStatusClass(status) {
  if (status === "진행중") return "in-progress";
  if (status === "QA") return "qa";
  if (status === "완료") return "done";
  if (status === "지연") return "delayed";
  return "planned";
}

function addDays(baseDate, days) {
  const date = new Date(baseDate);
  if (Number.isNaN(date.getTime())) return null;
  date.setDate(date.getDate() + days);
  return date;
}

function getProjectStageData(project) {
  const start = new Date(project.startDate || "2026-04-01");
  const end = new Date(project.endDate || "2026-05-01");
  const safeStart = Number.isNaN(start.getTime()) ? new Date("2026-04-01") : start;
  const safeEnd = Number.isNaN(end.getTime()) ? addDays(safeStart, 28) : end;
  const totalDays = Math.max(1, Math.round((safeEnd - safeStart) / 86400000));

  let currentStep = 1;
  if (project.status === "운영중" || project.status === "종료") {
    currentStep = 4;
  } else if (project.status === "안정화중" || project.status === "QA 준비") {
    currentStep = 3;
  } else if (project.status === "QA 진행중" || project.qaStatus === "테스트 중" || project.qaStatus === "재검증 중") {
    currentStep = 2;
  } else if (project.status === "진행중") {
    currentStep = 1;
  } else {
    currentStep = 0;
  }

  if (project.progress >= 95 && project.qaStatus === "QA 완료") {
    currentStep = 4;
  }

  const milestones = [
    { label: "기획 완료", date: safeStart },
    { label: "개발 진행", date: addDays(safeStart, Math.round(totalDays * 0.2)) },
    { label: "테스트 진행", date: addDays(safeStart, Math.round(totalDays * 0.55)) },
    { label: "배포 예정", date: addDays(safeStart, Math.round(totalDays * 0.82)) },
    { label: "완료 예정", date: safeEnd },
  ];

  return milestones.map((item, index) => ({
    ...item,
    dateLabel: formatDate(item.date),
    state: index < currentStep ? "done" : index === currentStep ? "active" : "upcoming",
  }));
}

function getStatusTone(type, value) {
  const text = safeText(value, "미설정");

  if (type === "team") return "gray";
  if (type === "owner") return "blue";

  if (type === "issues") {
    return safeCount(value) > 0 ? "orange" : "green";
  }

  if (type === "qaStatus") {
    if (text === "테스트 중" || text === "QA") return "violet";
    if (text === "재검증 중") return "indigo";
    if (text === "이슈 수정 중") return "orange";
    if (text === "실패" || text === "반려") return "red";
    if (text === "QA 완료" || text === "완료") return "green";
    return "gray";
  }

  if (type === "projectStatus") {
    if (text === "진행중") return "blue";
    if (text === "QA 진행중" || text === "QA 준비" || text === "QA") return "violet";
    if (text === "운영중" || text === "안정화중") return "amber";
    if (text === "종료" || text === "완료") return "green";
    if (text === "지연") return "red";
    return "gray";
  }

  return "gray";
}

function getOverviewMetaCards(project) {
  return [
    {
      key: "status",
      label: "프로젝트 상태",
      value: safeText(project.status, "미설정"),
      tone: getStatusTone("projectStatus", project.status),
      icon: "folder",
    },
    {
      key: "qa",
      label: "QA 상태",
      value: safeText(project.qaStatus, "미설정"),
      tone: getStatusTone("qaStatus", project.qaStatus),
      icon: "shield",
    },
  ];
}

function getSummaryMetaCards(project) {
  return [
    {
      key: "team",
      label: "담당팀",
      value: safeText(project.team, "미지정"),
      tone: getStatusTone("team", project.team),
      icon: "team",
    },
    {
      key: "owner",
      label: "담당자",
      value: safeText(project.owner, "미지정"),
      tone: getStatusTone("owner", project.owner),
      icon: "checkCircle",
    },
    {
      key: "issues",
      label: "오픈 이슈",
      value: `${safeCount(project.issueCount)}건`,
      tone: getStatusTone("issues", project.issueCount),
      icon: "alert",
    },
    {
      key: "qa",
      label: "QA 상태",
      value: safeText(project.qaStatus, "미설정"),
      tone: getStatusTone("qaStatus", project.qaStatus),
      icon: "shield",
    },
  ];
}

function getKanbanColumns(tasks) {
  const normalize = (status) => {
    if (status === "완료") return "완료";
    if (status === "QA") return "QA";
    if (status === "진행중") return "진행중";
    return "예정";
  };

  return [
    { key: "예정", title: "예정", items: tasks.filter((task) => normalize(task.status) === "예정") },
    { key: "진행중", title: "진행중", items: tasks.filter((task) => normalize(task.status) === "진행중") },
    { key: "QA", title: "QA", items: tasks.filter((task) => normalize(task.status) === "QA") },
    { key: "완료", title: "완료", items: tasks.filter((task) => normalize(task.status) === "완료") },
  ];
}

function createTaskDraft() {
  return {
    title: "",
    status: "예정",
    assignee: "",
    startDate: "",
    dueDate: "",
    priority: "보통",
    description: "",
  };
}

function createIssueDraft() {
  return {
    title: "",
    description: "",
    assignee: "",
    severity: "보통",
    status: "예정",
    createdDate: "2026-05-11",
  };
}

function createProjectDraft() {
  return {
    name: "",
    description: "",
    team: "",
    owner: "",
    startDate: "",
    endDate: "",
    status: "예정",
    priority: "보통",
  };
}

function getQaChecklist(project) {
  const status = safeText(project.qaStatus, "미설정");
  return [
    { label: "체크리스트 준비", done: status !== "테스트 전" && status !== "미설정" },
    { label: "핵심 시나리오 검증", done: ["테스트 중", "재검증 중", "QA 완료"].includes(status) },
    { label: "이슈 수정 반영 확인", done: ["이슈 수정 중", "재검증 중", "QA 완료"].includes(status) },
    { label: "최종 QA 승인", done: status === "QA 완료" },
  ];
}

function getIssues(project) {
  return Array.isArray(project.issues) ? project.issues : [];
}

function DashboardPage({ projects, query, statusFilter, sortOrder, onQueryChange, onStatusFilterChange, onSortOrderChange, onOpenProject, onCreateProject }) {
  const filteredProjects = useMemo(() => {
    const q = query.trim().toLowerCase();
    const result = projects.filter((project) => {
      const name = safeText(project.name, "").toLowerCase();
      const owner = safeText(project.owner, "").toLowerCase();
      const team = safeText(project.team, "").toLowerCase();
      const matchesQuery = !q || name.includes(q) || owner.includes(q) || team.includes(q);
      const matchesStatus = statusFilter === "전체" || safeText(project.status, "예정") === statusFilter;
      return matchesQuery && matchesStatus;
    });

    return result.sort((a, b) => {
      if (sortOrder === "추천순") {
        return getProjectRecommendationScore(b) - getProjectRecommendationScore(a);
      }
      if (sortOrder === "진행률 높은순") {
        return safePercent(b.progress) - safePercent(a.progress);
      }
      if (sortOrder === "우선순위 높은순") {
        return getProjectPriorityScore(b) - getProjectPriorityScore(a);
      }
      if (sortOrder === "이름순") {
        return safeText(a.name, "").localeCompare(safeText(b.name, ""), "ko");
      }

      const aDate = new Date(a.endDate).getTime();
      const bDate = new Date(b.endDate).getTime();
      const safeADate = Number.isFinite(aDate) ? aDate : Number.MAX_SAFE_INTEGER;
      const safeBDate = Number.isFinite(bDate) ? bDate : Number.MAX_SAFE_INTEGER;
      return safeADate - safeBDate;
    });
  }, [projects, query, statusFilter, sortOrder]);

  const kpis = useMemo(() => getKpis(projects), [projects]);
  const tasks = useMemo(() => getFocusTasks(projects), [projects]);
  const activity = useMemo(() => getRecentActivity(projects), [projects]);

  return h(
    React.Fragment,
    null,
    h(
      "header",
      { className: "global-header" },
      h(
        "div",
        { className: "header-inner" },
        h(
          "div",
          { className: "header-brand" },
          h("div", { className: "brand-mark" }, "PD"),
          h(
            "div",
            null,
            h("strong", { className: "brand-title" }, "PhoenixDart 운영 데스크"),
            h("div", { className: "small muted" }, "프로젝트 · 배포 · QA 진행 관리")
          )
        ),
        h(
          "div",
          { className: "header-tools" },
          h("input", {
            className: "field",
            placeholder: "프로젝트명, 팀, 담당자 검색",
            value: query,
            onChange: (event) => onQueryChange(event.target.value),
          }),
          h(
            "select",
            {
              className: "field field-select",
              value: statusFilter,
              onChange: (event) => onStatusFilterChange(event.target.value),
            },
            STATUS_OPTIONS.map((option) => h("option", { key: option, value: option }, option))
          ),
          h("button", { className: "primary-action", type: "button", onClick: onCreateProject }, "새 프로젝트 등록")
        )
      )
    ),
    h(
      "main",
      { className: "main-shell" },
      h(
        "div",
        { className: "workspace-grid" },
        h(
          "section",
          { className: "section-card section-card-main" },
          h(
            "div",
            { className: "section-head" },
            h(
              "div",
              null,
              h("h1", { className: "section-title" }, "프로젝트 목록"),
              h("p", { className: "section-copy" }, "진행 중인 프로젝트를 빠르게 확인하고 상세 화면으로 이동할 수 있습니다.")
            ),
            h(
              "div",
              { className: "section-actions" },
              h("span", { className: "small muted" }, `${filteredProjects.length}개 표시 중`),
              h("span", { className: "small muted" }, "정렬"),
              h(
                "select",
                {
                  className: "field field-select field-compact",
                  value: sortOrder,
                  onChange: (event) => onSortOrderChange(event.target.value),
                },
                SORT_OPTIONS.map((option) => h("option", { key: option, value: option }, option))
              )
            )
          ),
          h(
            "div",
            { className: "project-list" },
            filteredProjects.map((project) =>
              h(
                "button",
                {
                  key: project.id,
                  type: "button",
                  className: `project-row${project.status === "진행중" ? " is-live" : ""}`,
                  onClick: () => onOpenProject(project.id),
                },
                h(
                  "div",
                  { className: "project-row-top" },
                  h(
                    "div",
                    { className: "project-main" },
                    h("strong", { className: "project-title" }, project.name),
                    h("p", { className: "muted" }, project.description)
                  ),
                  h(
                    "div",
                    { className: "project-badges" },
                    h("span", { className: `badge badge-${statusClassName(project.status)}` }, project.status)
                  )
                ),
                h("div", { className: "project-card-info" }, h("div", { className: "project-card-meta muted" }, `${project.owner} · ${formatDate(project.endDate)}`)),
                h(
                  "div",
                  { className: "project-card-progress-head" },
                  h("span", { className: "small muted" }, "진행률"),
                  h("strong", { className: "project-progress-value" }, `${project.progress}%`)
                ),
                h("div", { className: "progress-track project-progress-track" }, h("div", { className: "progress-fill", style: { width: `${project.progress}%` } }))
              )
            )
          )
        ),
        h(
          "aside",
          { className: "side-column side-column-sticky" },
          h(
            "article",
            { className: "section-card side-card" },
            h(
              "div",
              { className: "section-head section-head-compact" },
              h(
                "div",
                null,
                h("h2", { className: "section-title section-title-compact" }, "우선 확인해야 할 현황"),
                h("p", { className: "section-copy section-copy-compact" }, "중요 지표를 빠르게 스캔합니다.")
              )
            ),
            h(
              "div",
              { className: "kpi-grid-side" },
              kpis.map((item, index) =>
                h(
                  "article",
                  {
                    key: item.label,
                    className: `kpi-card${index >= 3 ? " span-two" : ""}`,
                  },
                  h(
                    "div",
                    { className: "kpi-top" },
                    h("span", { className: "small muted" }, item.label),
                    h(Icon, { name: item.icon, className: `kpi-icon kpi-icon-${item.tone}` })
                  ),
                  h("p", { className: "kpi-value" }, item.value)
                )
              )
            )
          ),
          h(
            "article",
            { className: "section-card side-card" },
            h(
              "div",
              { className: "section-head section-head-compact" },
              h(
                "div",
                null,
                h("h2", { className: "section-title section-title-compact" }, "지금 대응해야 할 업무"),
                h("p", { className: "section-copy section-copy-compact" }, "우선순위가 높은 업무 3건입니다.")
              )
            ),
            h(
              "div",
              { className: "task-list" },
              tasks.map((task) =>
                h(
                  "article",
                  { key: task.id, className: "task-row" },
                  h(
                    "div",
                    { className: "task-main" },
                    h("strong", null, task.title),
                    h("div", { className: "task-meta small muted" }, `${task.projectName} · ${task.assignee}`)
                  ),
                  h(
                    "div",
                    { className: "task-side" },
                    h("span", { className: `priority-tag priority-${priorityClassName(task.priority)}` }, task.priority),
                    h("span", { className: `badge badge-${statusClassName(task.status)}` }, task.status)
                  )
                )
              )
            )
          ),
          h(
            "article",
            { className: "section-card side-card" },
            h(
              "div",
              { className: "section-head section-head-compact" },
              h(
                "div",
                null,
                h("h2", { className: "section-title section-title-compact" }, "최근 활동"),
                h("p", { className: "section-copy section-copy-compact" }, "최근 변경 이력 3건입니다.")
              )
            ),
            h(
              "div",
              { className: "activity-list" },
              activity.map((item) =>
                h(
                  "article",
                  { key: item.id, className: "activity-row" },
                  h(Avatar, { name: item.actor }),
                  h(
                    "div",
                    { className: "activity-main" },
                    h(
                      "div",
                      { className: "activity-head" },
                      h("strong", null, item.actor),
                      h("span", { className: "small muted activity-date" }, formatDate(item.timestamp))
                    ),
                    h("div", { className: "activity-message" }, `${item.message} · ${item.projectName}`)
                  )
                )
              )
            )
          )
        )
      )
    )
  );
}

function InboxPage({ projects, onBack, onOpenProject }) {
  const sections = useMemo(() => getInboxSections(projects), [projects]);

  return h(
    React.Fragment,
    null,
    h(
      "header",
      { className: "global-header" },
      h(
        "div",
        { className: "header-inner" },
        h(
          "div",
          { className: "header-brand" },
          h(
            "button",
            { className: "back-link", type: "button", onClick: onBack },
            h(Icon, { name: "arrowLeft" }),
            h("span", null, "대시보드로")
          ),
          h(
            "div",
            null,
            h("strong", { className: "brand-title" }, "확인 / 전달 대기함"),
            h("div", { className: "small muted" }, "각 팀이 지금 바로 처리해야 할 확인과 일정 회신 항목을 모았습니다.")
          )
        )
      )
    ),
    h(
      "main",
      { className: "main-shell detail-shell" },
      h(
        "section",
        { className: "section-card" },
        h(
          "div",
          { className: "section-head" },
          h(
            "div",
            null,
            h("h1", { className: "section-title" }, "오늘 확인해야 할 항목"),
            h("p", { className: "section-copy" }, "전달 확인, 일정 회신, QA 확인 요청을 우선순위 기준으로 빠르게 확인합니다.")
          )
        ),
        h(
          "div",
          { className: "detail-grid" },
          sections.map((section) =>
            h(
              "section",
              { key: section.key, className: "section-card detail-side-card" },
              h(
                "div",
                { className: "section-head section-head-compact" },
                h(
                  "div",
                  null,
                  h("h2", { className: "section-title section-title-compact" }, section.title),
                  h("p", { className: "section-copy section-copy-compact" }, section.copy)
                )
              ),
              section.items.length
                ? h(
                    "div",
                    { className: "detail-list" },
                    section.items.map((item) =>
                      h(
                        "button",
                        {
                          key: item.id,
                          type: "button",
                          className: "detail-list-row inbox-row",
                          onClick: () => onOpenProject(item.projectId),
                        },
                        h(
                          "div",
                          { className: "detail-list-main" },
                          h("strong", null, item.title),
                          h("div", { className: "small muted" }, item.meta)
                        ),
                        h("span", { className: `badge badge-${item.tone}` }, item.badge)
                      )
                    )
                  )
                : h("div", { className: "empty-inline-state" }, h("strong", null, "대기 중인 항목이 없습니다."))
            )
          )
        )
      )
    )
  );
}

function ProjectCreatePage({ onBack, onCreateProject }) {
  const [form, setForm] = useState(createProjectDraft);
  const [error, setError] = useState("");

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const submitProject = () => {
    const name = safeText(form.name, "").trim();
    const owner = safeText(form.owner, "").trim();
    if (!name) {
      setError("프로젝트명은 필수입니다.");
      return;
    }
    if (!owner) {
      setError("담당자는 필수입니다.");
      return;
    }

    onCreateProject({
      name,
      description: safeText(form.description, "").trim() || "프로젝트 설명이 아직 등록되지 않았습니다.",
      team: safeText(form.team, "").trim() || "미지정",
      owner,
      startDate: form.startDate || "",
      endDate: form.endDate || "",
      status: safeText(form.status, "예정"),
      priority: safeText(form.priority, "보통"),
    });
  };

  return h(
    React.Fragment,
    null,
    h(
      "header",
      { className: "global-header" },
      h(
        "div",
        { className: "header-inner" },
        h(
          "div",
          { className: "header-brand" },
          h(
            "button",
            { className: "back-link", type: "button", onClick: onBack },
            h(Icon, { name: "arrowLeft" }),
            h("span", null, "목록으로")
          ),
          h(
            "div",
            null,
            h("strong", { className: "brand-title" }, "새 프로젝트 등록"),
            h("div", { className: "small muted" }, "운영할 프로젝트의 기본 정보를 먼저 세팅합니다.")
          )
        )
      )
    ),
    h(
      "main",
      { className: "main-shell detail-shell" },
      h(
        "section",
        { className: "section-card create-page-card" },
        h(
          "div",
          { className: "section-head" },
          h(
            "div",
            null,
            h("h1", { className: "section-title" }, "프로젝트 생성"),
            h("p", { className: "section-copy" }, "프로젝트명, 담당자, 기간, 상태를 먼저 설정한 뒤 이후 업무와 QA 이슈를 이어서 관리할 수 있습니다.")
          )
        ),
        h(
          "div",
          { className: "task-form-grid create-form-grid" },
          h(
            "label",
            { className: "task-form-field task-form-field-wide" },
            h("span", { className: "small muted" }, "프로젝트명"),
            h("input", {
              className: "field",
              value: form.name,
              placeholder: "예: 고객센터 응대 시나리오 개편",
              onChange: (event) => updateField("name", event.target.value),
            })
          ),
          h(
            "label",
            { className: "task-form-field task-form-field-wide" },
            h("span", { className: "small muted" }, "설명"),
            h("textarea", {
              className: "field task-form-textarea",
              value: form.description,
              placeholder: "프로젝트 목적과 현재 운영 배경을 입력하세요.",
              onChange: (event) => updateField("description", event.target.value),
            })
          ),
          h(
            "label",
            { className: "task-form-field" },
            h("span", { className: "small muted" }, "담당팀"),
            h("input", {
              className: "field",
              value: form.team,
              placeholder: "예: 서비스운영팀",
              onChange: (event) => updateField("team", event.target.value),
            })
          ),
          h(
            "label",
            { className: "task-form-field" },
            h("span", { className: "small muted" }, "담당자"),
            h("input", {
              className: "field",
              value: form.owner,
              placeholder: "예: 김지훈",
              onChange: (event) => updateField("owner", event.target.value),
            })
          ),
          h(
            "label",
            { className: "task-form-field" },
            h("span", { className: "small muted" }, "시작일"),
            h("input", {
              className: "field",
              type: "date",
              value: form.startDate,
              onChange: (event) => updateField("startDate", event.target.value),
            })
          ),
          h(
            "label",
            { className: "task-form-field" },
            h("span", { className: "small muted" }, "종료일"),
            h("input", {
              className: "field",
              type: "date",
              value: form.endDate,
              onChange: (event) => updateField("endDate", event.target.value),
            })
          ),
          h(
            "div",
            { className: "task-form-field task-form-field-wide" },
            h("span", { className: "small muted" }, "상태"),
            h(
              "div",
              { className: "status-chip-group", role: "group", "aria-label": "프로젝트 상태 선택" },
              PROJECT_CREATE_STATUS_OPTIONS.map((option) =>
                h(
                  "button",
                  {
                    key: option,
                    type: "button",
                    className: `status-chip status-chip-${statusClassName(option)}${form.status === option ? " is-active" : ""}`,
                    "aria-pressed": form.status === option ? "true" : "false",
                    onClick: () => updateField("status", option),
                  },
                  option
                )
              )
            )
          ),
          h(
            "div",
            { className: "task-form-field task-form-field-wide" },
            h("span", { className: "small muted" }, "우선순위"),
            h(
              "div",
              { className: "priority-chip-group", role: "group", "aria-label": "프로젝트 우선순위 선택" },
              TASK_PRIORITY_OPTIONS.map((option) =>
                h(
                  "button",
                  {
                    key: option,
                    type: "button",
                    className: `priority-chip priority-chip-${priorityClassName(option)}${form.priority === option ? " is-active" : ""}`,
                    "aria-pressed": form.priority === option ? "true" : "false",
                    onClick: () => updateField("priority", option),
                  },
                  option
                )
              )
            )
          )
        ),
        error ? h("div", { className: "task-form-error" }, error) : null,
        h(
          "div",
          { className: "task-form-actions" },
          h(
            "button",
            { type: "button", className: "ghost-action subtle-action", onClick: onBack },
            "취소"
          ),
          h(
            "button",
            { type: "button", className: "primary-action task-submit-button", onClick: submitProject },
            "프로젝트 생성"
          )
        )
      )
    )
  );
}

function ProjectDetailPage({ project, onBack, onAddTask, onUpdateTask, onAddIssue }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [taskView, setTaskView] = useState("list");
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showIssueForm, setShowIssueForm] = useState(false);
  const [showQaChecklist, setShowQaChecklist] = useState(true);
  const [openTaskStatusMenuId, setOpenTaskStatusMenuId] = useState(null);
  const [roadmapQuery, setRoadmapQuery] = useState("");
  const [taskForm, setTaskForm] = useState(createTaskDraft);
  const [issueForm, setIssueForm] = useState(createIssueDraft);
  const [taskError, setTaskError] = useState("");
  const [issueError, setIssueError] = useState("");

  const issues = useMemo(() => getIssues(project), [project]);
  const qaChecklist = useMemo(() => getQaChecklist(project), [project]);
  const roadmapItems = useMemo(() => getRoadmapItems(project), [project]);
  const kanbanColumns = useMemo(() => getKanbanColumns(project.tasks), [project]);
  const stageItems = useMemo(() => getProjectStageData(project), [project]);
  const overviewMetaCards = useMemo(() => getOverviewMetaCards(project), [project]);
  const summaryMetaCards = useMemo(() => getSummaryMetaCards(project), [project]);
  const filteredRoadmapRows = useMemo(() => {
    const query = roadmapQuery.trim().toLowerCase();
    if (!query) return roadmapItems.rows;
    return roadmapItems.rows.filter((item) => {
      const title = safeText(item.title, "").toLowerCase();
      const key = safeText(item.key, "").toLowerCase();
      const assignee = safeText(item.assignee, "").toLowerCase();
      return title.includes(query) || key.includes(query) || assignee.includes(query);
    });
  }, [roadmapItems, roadmapQuery]);

  const updateTaskForm = (field, value) => {
    setTaskForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateIssueForm = (field, value) => {
    setIssueForm((prev) => ({ ...prev, [field]: value }));
  };

  const submitTask = () => {
    const title = safeText(taskForm.title, "").trim();
    const status = safeText(taskForm.status, "").trim();
    if (!title) {
      setTaskError("제목은 필수입니다.");
      return;
    }
    if (!status) {
      setTaskError("상태는 필수입니다.");
      return;
    }

    onAddTask(project.id, {
      title,
      status,
      assignee: safeText(taskForm.assignee, "").trim() || "미지정",
      startDate: taskForm.startDate || "",
      dueDate: taskForm.dueDate || "",
      priority: safeText(taskForm.priority, "보통"),
      description: safeText(taskForm.description, "").trim(),
    });

    setTaskForm(createTaskDraft());
    setTaskError("");
    setShowTaskForm(false);
  };

  const submitIssue = () => {
    const title = safeText(issueForm.title, "").trim();
    if (!title) {
      setIssueError("이슈 제목은 필수입니다.");
      return;
    }

    onAddIssue(project.id, {
      title,
      description: safeText(issueForm.description, "").trim(),
      assignee: safeText(issueForm.assignee, "").trim() || "미지정",
      severity: safeText(issueForm.severity, "보통"),
      status: safeText(issueForm.status, "예정"),
      createdDate: issueForm.createdDate || "2026-05-11",
    });

    setIssueForm(createIssueDraft());
    setIssueError("");
    setShowIssueForm(false);
  };

  const renderTaskStatusPicker = (task, variant = "list") =>
    h(
      "div",
      { className: `task-status-picker task-status-picker-${variant}` },
      h(
        "button",
        {
          type: "button",
          className: `status-chip status-chip-${statusClassName(safeText(task.status, "예정"))} is-active status-chip-trigger`,
          "aria-haspopup": "menu",
          "aria-expanded": openTaskStatusMenuId === task.id ? "true" : "false",
          onClick: () => setOpenTaskStatusMenuId((prev) => (prev === task.id ? null : task.id)),
        },
        safeText(task.status, "예정")
      ),
      openTaskStatusMenuId === task.id
        ? h(
            "div",
            { className: "status-chip-popover", role: "menu" },
            TASK_STATUS_OPTIONS.map((option) =>
              h(
                "button",
                {
                  key: option,
                  type: "button",
                  role: "menuitemradio",
                  "aria-checked": safeText(task.status, "예정") === option ? "true" : "false",
                  className: `status-chip status-chip-${statusClassName(option)}${safeText(task.status, "예정") === option ? " is-active" : ""}`,
                  onClick: () => {
                    onUpdateTask(project.id, task.id, { status: option });
                    setOpenTaskStatusMenuId(null);
                  },
                },
                option
              )
            )
          )
        : null
    );

  let mainContent = null;

  if (activeTab === "overview") {
    mainContent = h(
      React.Fragment,
      null,
      h(
        "section",
        { className: "section-card" },
        h(
          "div",
          { className: "section-head" },
          h(
            "div",
            null,
            h("h2", { className: "section-title section-title-compact" }, "개요"),
            h("p", { className: "section-copy section-copy-compact" }, "현재 상태와 핵심 정보를 한 번에 확인합니다.")
          )
        ),
        h(
          "div",
          { className: "detail-stage-card" },
          h(
            "div",
            { className: "detail-stage-head" },
            h("strong", { className: "detail-stage-title" }, "프로젝트 진행 단계")
          ),
          h(
            "div",
            { className: "detail-stepper", style: { "--step-progress": `${safePercent(project.progress)}%` } },
            h("span", { className: "detail-stepper-rail" }),
            h("span", { className: "detail-stepper-fill" }),
            stageItems.map((item, index) =>
              h(
                "div",
                { key: item.label, className: `detail-step-item is-${item.state}` },
                h(
                  "span",
                  { className: `detail-step-node detail-step-node-${item.state}` },
                  item.state === "done" ? "✓" : null
                ),
                h(
                  "div",
                  { className: "detail-step-copy" },
                  h("strong", { className: "detail-step-label" }, item.label),
                  h("span", { className: "small muted" }, item.dateLabel)
                )
              )
            )
          )
        ),
        h(
          "div",
          { className: "detail-overview-grid" },
          overviewMetaCards.map((card) =>
            h(
              "div",
              { key: card.key, className: "detail-overview-item" },
              h(
                "div",
                { className: "detail-overview-top" },
                h("span", { className: `detail-status-dot detail-status-dot-${card.tone}` }),
                h(Icon, { name: card.icon, className: `detail-overview-icon detail-overview-icon-${card.tone}` }),
                h("span", { className: "small muted" }, card.label)
              ),
              h("strong", { className: `detail-overview-value detail-overview-value-${card.tone}` }, card.value)
            )
          )
        )
      ),
      h(
        "section",
        { className: "section-card" },
        h(
          "div",
          { className: "section-head" },
          h(
            "div",
            null,
            h("h2", { className: "section-title section-title-compact" }, "최근 업데이트"),
            h("p", { className: "section-copy section-copy-compact" }, "프로젝트 최신 활동을 확인합니다.")
          )
        ),
        h(
          "div",
          { className: "history-list" },
          project.activity.map((item) =>
            h(
              "article",
              { key: item.id, className: "history-row" },
              h(Avatar, { name: item.actor }),
              h(
                "div",
                { className: "history-main" },
                h(
                  "div",
                  { className: "history-head" },
                  h("strong", null, item.actor),
                  h("span", { className: "small muted" }, formatDateTime(item.timestamp))
                ),
                h("div", { className: "activity-message" }, item.message)
              )
            )
          )
        )
      )
    );
  } else if (activeTab === "tasks") {
    const taskModal =
      showTaskForm
        ? h(
            "div",
            {
              className: "task-modal-backdrop",
              onClick: () => {
                setShowTaskForm(false);
                setTaskError("");
                setTaskForm(createTaskDraft());
              },
            },
            h(
              "div",
              {
                className: "task-modal-card",
                onClick: (event) => event.stopPropagation(),
              },
              h(
                "div",
                { className: "section-head" },
                h(
                  "div",
                  null,
                  h("h2", { className: "section-title section-title-compact" }, "작업 추가"),
                  h("p", { className: "section-copy section-copy-compact" }, "업무 정보를 입력하면 리스트와 칸반에 바로 반영됩니다.")
                )
              ),
              h(
                "div",
                { className: "task-form-grid" },
                h(
                  "label",
                  { className: "task-form-field task-form-field-wide" },
                  h("span", { className: "small muted" }, "작업 제목"),
                  h("input", {
                    className: "field",
                    value: taskForm.title,
                    placeholder: "업무 제목 입력",
                    onChange: (event) => updateTaskForm("title", event.target.value),
                  })
                ),
                h(
                  "div",
                  { className: "task-form-field task-form-field-wide" },
                  h("span", { className: "small muted" }, "상태"),
                  h(
                    "div",
                    { className: "status-chip-group", role: "group", "aria-label": "상태 선택" },
                    TASK_STATUS_OPTIONS.map((option) =>
                      h(
                        "button",
                        {
                          key: option,
                          type: "button",
                          className: `status-chip status-chip-${statusClassName(option)}${taskForm.status === option ? " is-active" : ""}`,
                          "aria-pressed": taskForm.status === option ? "true" : "false",
                          onClick: () => updateTaskForm("status", option),
                        },
                        option
                      )
                    )
                  )
                ),
                h(
                  "label",
                  { className: "task-form-field" },
                  h("span", { className: "small muted" }, "담당자"),
                  h("input", {
                    className: "field",
                    value: taskForm.assignee,
                    placeholder: "선택 사항",
                    onChange: (event) => updateTaskForm("assignee", event.target.value),
                  })
                ),
                h(
                  "label",
                  { className: "task-form-field" },
                  h("span", { className: "small muted" }, "시작일"),
                  h("input", {
                    className: "field",
                    type: "date",
                    value: taskForm.startDate,
                    onChange: (event) => updateTaskForm("startDate", event.target.value),
                  })
                ),
                h(
                  "label",
                  { className: "task-form-field" },
                  h("span", { className: "small muted" }, "마감일"),
                  h("input", {
                    className: "field",
                    type: "date",
                    value: taskForm.dueDate,
                    onChange: (event) => updateTaskForm("dueDate", event.target.value),
                  })
                ),
                h(
                  "label",
                  { className: "task-form-field task-form-field-wide" },
                  h("span", { className: "small muted" }, "우선순위"),
                  h(
                    "div",
                    { className: "priority-chip-group", role: "group", "aria-label": "우선순위 선택" },
                    TASK_PRIORITY_OPTIONS.map((option) =>
                      h(
                        "button",
                        {
                          key: option,
                          type: "button",
                          className: `priority-chip priority-chip-${priorityClassName(option)}${taskForm.priority === option ? " is-active" : ""}`,
                          "aria-pressed": taskForm.priority === option ? "true" : "false",
                          onClick: () => updateTaskForm("priority", option),
                        },
                        option
                      )
                    )
                  )
                ),
                h(
                  "label",
                  { className: "task-form-field task-form-field-wide" },
                  h("span", { className: "small muted" }, "설명"),
                  h("textarea", {
                    className: "field task-form-textarea",
                    value: taskForm.description,
                    placeholder: "업무 설명 입력",
                    onChange: (event) => updateTaskForm("description", event.target.value),
                  })
                )
              ),
              taskError ? h("div", { className: "task-form-error" }, taskError) : null,
              h(
                "div",
                { className: "task-form-actions" },
                h(
                  "button",
                  {
                    type: "button",
                    className: "ghost-action subtle-action",
                    onClick: () => {
                      setShowTaskForm(false);
                      setTaskError("");
                      setTaskForm(createTaskDraft());
                    },
                  },
                  "취소"
                ),
                h(
                  "button",
                  { type: "button", className: "primary-action task-submit-button", onClick: submitTask },
                  "작업 추가"
                )
              )
            )
          )
        : null;

    const listView = project.tasks.length
      ? h(
          "div",
          { className: "detail-list" },
          project.tasks.map((task) =>
            h(
              "article",
              { key: task.id, className: "detail-list-row task-list-row" },
              h(
                "div",
                { className: "detail-list-main task-list-main" },
                h(
                  "div",
                  { className: "task-list-top task-list-top-left" },
                  h("span", { className: `priority-tag priority-${priorityClassName(task.priority)}` }, `우선순위: ${safeText(task.priority, "보통")}`),
                  renderTaskStatusPicker(task, "list-inline")
                ),
                h("strong", null, task.title),
                h("div", { className: "small muted" }, `${safeText(task.assignee, "미지정")} · ${formatDate(task.dueDate)}`),
                task.memo ? h("div", { className: "small muted" }, task.memo) : null
              )
            )
          )
        )
      : h(
          "div",
          { className: "section-card empty-inline-state" },
          h("strong", null, "등록된 업무가 없습니다."),
          h("p", { className: "section-copy section-copy-compact" }, "업무를 추가해 프로젝트 실행 계획을 시작하세요."),
          h(
            "button",
            {
              type: "button",
              className: "ghost-action subtle-action",
              onClick: () => {
                setShowTaskForm(true);
                setTaskError("");
              },
            },
            h(Icon, { name: "plus" }),
            h("span", null, "작업 추가")
          )
        );

    const kanbanView = h(
      "div",
      { className: "kanban-board" },
      kanbanColumns.map((column) =>
        h(
          "section",
          { key: column.key, className: "kanban-column" },
          h(
            "div",
            { className: "kanban-column-head" },
            h("strong", null, column.title),
            h("span", { className: "small muted" }, `${column.items.length}`)
          ),
          h(
            "div",
            { className: "kanban-card-list" },
            column.items.length
              ? column.items.map((task) =>
                  h(
                    "article",
                    { key: task.id, className: "kanban-card" },
                    h(
                      "div",
                      { className: "task-list-top kanban-card-top" },
                      h("span", { className: `priority-tag priority-${priorityClassName(task.priority)}` }, `우선순위: ${safeText(task.priority, "보통")}`),
                                          ),
                    h("strong", null, task.title),
                    h("div", { className: "small muted" }, safeText(task.assignee, "미지정")),
                    task.dueDate ? h("div", { className: "small muted" }, formatDate(task.dueDate)) : null
                  )
                )
              : h("div", { className: "kanban-empty small muted" }, "업무 없음")
          )
        )
      )
    );

    mainContent = h(
      "section",
      { className: "section-card" },
      h(
        "div",
        { className: "section-head" },
        h(
          "div",
          null,
          h("h2", { className: "section-title section-title-compact" }, "업무"),
          h("p", { className: "section-copy section-copy-compact" }, "리스트 또는 칸반으로 업무 흐름을 확인합니다.")
        ),
        h(
          "div",
          { className: "section-actions" },
          h(
            "div",
            { className: "view-toggle" },
            h(
              "button",
              {
                type: "button",
                className: `view-toggle-button${taskView === "list" ? " is-active" : ""}`,
                onClick: () => setTaskView("list"),
              },
              "리스트 보기"
            ),
            h(
              "button",
              {
                type: "button",
                className: `view-toggle-button${taskView === "kanban" ? " is-active" : ""}`,
                onClick: () => setTaskView("kanban"),
              },
              "칸반 보기"
            )
          ),
          h(
            "button",
            {
              type: "button",
              className: "ghost-action subtle-action",
              onClick: () => {
                setShowTaskForm(true);
                setTaskError("");
              },
            },
            h(Icon, { name: "plus" }),
            h("span", null, "작업 추가")
          )
        )
      ),
      taskView === "list" ? listView : kanbanView
    );
    mainContent = h(React.Fragment, null, mainContent, taskModal);

} else if (activeTab === "roadmap") {
    const roadmapAssignees = Array.from(new Set(filteredRoadmapRows.map((item) => item.assignee))).slice(0, 4);
    mainContent = h(
      "section",
      { className: "section-card roadmap-shell" },
      h(
        "div",
        { className: "section-head" },
        h(
          "div",
          null,
          h("h2", { className: "section-title section-title-compact" }, "로드맵"),
          h("p", { className: "section-copy section-copy-compact" }, "업무 탭에서 시작일과 마감일이 입력된 작업만 자동으로 표시됩니다.")
        )
      ),
      h(
        "div",
        { className: "roadmap-toolbar" },
        h("input", {
          className: "field field-compact roadmap-search",
          placeholder: "작업 검색",
          value: roadmapQuery,
          onChange: (event) => setRoadmapQuery(event.target.value),
        }),
        h(
          "div",
          { className: "roadmap-avatar-group" },
          roadmapAssignees.map((name) => h(Avatar, { key: name, name })),
          filteredRoadmapRows.length > roadmapAssignees.length
            ? h("span", { className: "roadmap-avatar-more" }, `+${Math.max(0, filteredRoadmapRows.length - roadmapAssignees.length)}`)
            : null
        )
      ),
      filteredRoadmapRows.length
        ? h(
            "div",
            { className: "roadmap-board" },
            h(
              "div",
              { className: "roadmap-header" },
              h("div", { className: "roadmap-header-list" }, "Epic / 작업"),
              h(
                "div",
                { className: "roadmap-header-timeline" },
                roadmapItems.months.map((month) =>
                  h(
                    "div",
                    {
                      key: month.key,
                      className: "roadmap-month",
                      style: { left: `${month.left}%`, width: `${month.width}%` },
                    },
                    month.label
                  )
                ),
                roadmapItems.weekLines.map((line, index) =>
                  h("span", { key: `head-line-${index}`, className: "roadmap-week-line", style: { left: `${line}%` } })
                ),
                h("span", { className: "roadmap-today-line roadmap-today-line-header", style: { left: `${roadmapItems.todayLeft}%` } })
              )
            ),
            h(
              "div",
              { className: "roadmap-body" },
              filteredRoadmapRows.map((item) =>
                h(
                  "div",
                  { key: item.id, className: "roadmap-grid-row", title: `${item.title} · ${item.period} · ${item.status}` },
                  h(
                    "div",
                    { className: `roadmap-list-cell${item.level ? " is-child" : ""}` },
                    h(
                      "div",
                      { className: "roadmap-item-main" },
                      h("span", { className: "roadmap-item-key" }, item.key),
                      h("strong", { className: "roadmap-item-title" }, item.title)
                    ),
                    h(
                      "div",
                      { className: "roadmap-item-meta" },
                      h("span", { className: `badge badge-${statusClassName(item.status)}` }, item.status),
                      h("span", { className: "small muted" }, item.assignee),
                      h("span", { className: "small muted" }, item.period)
                    )
                  ),
                  h(
                    "div",
                    { className: "roadmap-timeline-cell" },
                    roadmapItems.weekLines.map((line, index) =>
                      h("span", { key: `line-${item.id}-${index}`, className: "roadmap-grid-line", style: { left: `${line}%` } })
                    ),
                    h("span", { className: "roadmap-today-line", style: { left: `${roadmapItems.todayLeft}%` } }),
                    h(
                      "div",
                      {
                        className: `roadmap-timeline-bar roadmap-timeline-bar-${roadmapStatusClass(item.status)}`,
                        style: { left: `${item.left}%`, width: `${item.width}%` },
                      },
                      h(
                        "div",
                        { className: "roadmap-tooltip", role: "tooltip" },
                        h("strong", { className: "roadmap-tooltip-title" }, `${item.key} ${item.title}`),
                        h("div", { className: "roadmap-tooltip-line" }, `담당: ${item.assignee}`),
                        h("div", { className: "roadmap-tooltip-line" }, `기간: ${item.period}`),
                        h("div", { className: "roadmap-tooltip-line" }, `상태: ${item.status}`)
                      )
                    )
                  )
                )
              )
            )
          )
        : h(
            "div",
            { className: "empty-inline-state roadmap-empty-state" },
            h("strong", null, roadmapQuery.trim() ? "검색 결과가 없습니다." : "표시할 로드맵 작업이 없습니다."),
            h("p", { className: "section-copy section-copy-compact" }, roadmapQuery.trim() ? "다른 검색어로 다시 찾아보세요." : "업무 탭에서 시작일과 마감일을 함께 입력한 작업이 자동으로 타임라인에 표시됩니다.")
          )
    );
  
} else if (activeTab === "qa") {
    const qaIssueModal =
      showIssueForm
        ? h(
            "div",
            {
              className: "task-modal-backdrop",
              onClick: () => {
                setShowIssueForm(false);
                setIssueError("");
                setIssueForm(createIssueDraft());
              },
            },
            h(
              "div",
              {
                className: "task-modal-card",
                onClick: (event) => event.stopPropagation(),
              },
              h(
                "div",
                { className: "section-head" },
                h(
                  "div",
                  null,
                  h("h2", { className: "section-title section-title-compact" }, "QA 이슈 추가"),
                  h("p", { className: "section-copy section-copy-compact" }, "이슈를 등록하면 QA 목록과 오픈 이슈 수에 바로 반영됩니다.")
                )
              ),
              h(
                "div",
                { className: "task-form-grid" },
                h(
                  "label",
                  { className: "task-form-field task-form-field-wide" },
                  h("span", { className: "small muted" }, "이슈 제목"),
                  h("input", {
                    className: "field",
                    value: issueForm.title,
                    placeholder: "예: 배포 후 쿠폰 발급 실패",
                    onChange: (event) => updateIssueForm("title", event.target.value),
                  })
                ),
                h(
                  "label",
                  { className: "task-form-field" },
                  h("span", { className: "small muted" }, "담당자"),
                  h("input", {
                    className: "field",
                    value: issueForm.assignee,
                    placeholder: "선택 사항",
                    onChange: (event) => updateIssueForm("assignee", event.target.value),
                  })
                ),
                h(
                  "label",
                  { className: "task-form-field" },
                  h("span", { className: "small muted" }, "등록일"),
                  h("input", {
                    className: "field",
                    type: "date",
                    value: issueForm.createdDate,
                    onChange: (event) => updateIssueForm("createdDate", event.target.value),
                  })
                ),
                h(
                  "div",
                  { className: "task-form-field" },
                  h("span", { className: "small muted" }, "상태"),
                  h(
                    "div",
                    { className: "status-chip-group", role: "group", "aria-label": "이슈 상태 선택" },
                    QA_ISSUE_STATUS_OPTIONS.map((option) =>
                      h(
                        "button",
                        {
                          key: option,
                          type: "button",
                          className: `status-chip status-chip-${statusClassName(option)}${issueForm.status === option ? " is-active" : ""}`,
                          "aria-pressed": issueForm.status === option ? "true" : "false",
                          onClick: () => updateIssueForm("status", option),
                        },
                        option
                      )
                    )
                  )
                ),
                h(
                  "div",
                  { className: "task-form-field" },
                  h("span", { className: "small muted" }, "심각도"),
                  h(
                    "div",
                    { className: "priority-chip-group", role: "group", "aria-label": "이슈 심각도 선택" },
                    QA_ISSUE_SEVERITY_OPTIONS.map((option) =>
                      h(
                        "button",
                        {
                          key: option,
                          type: "button",
                          className: `priority-chip priority-chip-${priorityClassName(option)}${issueForm.severity === option ? " is-active" : ""}`,
                          "aria-pressed": issueForm.severity === option ? "true" : "false",
                          onClick: () => updateIssueForm("severity", option),
                        },
                        option
                      )
                    )
                  )
                ),
                h(
                  "label",
                  { className: "task-form-field task-form-field-wide" },
                  h("span", { className: "small muted" }, "설명"),
                  h("textarea", {
                    className: "field task-form-textarea",
                    value: issueForm.description,
                    placeholder: "재현 경로, 영향 범위, 필요한 대응 내용을 입력하세요.",
                    onChange: (event) => updateIssueForm("description", event.target.value),
                  })
                )
              ),
              issueError ? h("div", { className: "task-form-error" }, issueError) : null,
              h(
                "div",
                { className: "task-form-actions" },
                h(
                  "button",
                  {
                    type: "button",
                    className: "ghost-action subtle-action",
                    onClick: () => {
                      setShowIssueForm(false);
                      setIssueError("");
                      setIssueForm(createIssueDraft());
                    },
                  },
                  "취소"
                ),
                h(
                  "button",
                  { type: "button", className: "primary-action task-submit-button", onClick: submitIssue },
                  "QA 이슈 추가"
                )
              )
            )
          )
        : null;

    const issuesContent = issues.length
      ? h(
          "div",
          { className: "detail-list" },
          issues.map((issue) =>
            h(
              "article",
              { key: issue.id, className: "detail-list-row issue-list-row" },
                h(
                  "div",
                  { className: "detail-list-main task-list-main" },
                  h(
                    "div",
                    { className: "task-list-top" },
                    h("span", { className: `priority-tag priority-${priorityClassName(issue.severity)}` }, `우선순위: ${safeText(issue.severity, "보통")}`),
                    h("span", { className: `badge badge-${statusClassName(issue.status)}` }, issue.status)
                  ),
                  h("strong", null, issue.title),
                  h("div", { className: "small muted" }, `${safeText(issue.assignee, "미지정")} · ${formatDate(issue.createdDate)}`),
                  issue.description ? h("div", { className: "small muted" }, issue.description) : null
                )
              )
            )
        )
      : h(
          "div",
          { className: "section-card empty-inline-state" },
          h("strong", null, "등록된 이슈가 없습니다."),
          h("p", { className: "section-copy section-copy-compact" }, "새 이슈를 등록해 QA 대응 흐름을 시작하세요."),
          h(
            "button",
            {
              type: "button",
              className: "ghost-action subtle-action",
              onClick: () => {
                setShowIssueForm(true);
                setIssueError("");
              },
            },
            h(Icon, { name: "plus" }),
            h("span", null, "QA 이슈 추가")
          )
        );

    mainContent = h(
      "div",
      { className: "qa-layout" },
      h(
        "section",
        { className: "section-card qa-issues-panel" },
        h(
          "div",
          { className: "section-head" },
          h(
            "div",
            null,
            h("h2", { className: "section-title section-title-compact" }, "이슈 / 버그"),
            h("p", { className: "section-copy section-copy-compact" }, "현재 대응 중인 오픈 이슈와 버그를 확인합니다.")
          ),
          h(
            "button",
            {
              type: "button",
              className: "ghost-action subtle-action",
              onClick: () => {
                setShowIssueForm(true);
                setIssueError("");
              },
            },
            h(Icon, { name: "plus" }),
            h("span", null, "QA 이슈 추가")
          )
        ),
        issuesContent
      ),
      h(
        "aside",
        { className: "qa-side-panel" },
        h(
          "section",
          { className: "section-card qa-summary-card" },
          h(
            "div",
            { className: "section-head section-head-compact qa-summary-head" },
            h(
              "div",
              null,
              h("h2", { className: "section-title section-title-compact" }, "QA 진행 현황"),
              h("p", { className: "section-copy section-copy-compact" }, "현재 QA 상태와 체크리스트를 빠르게 확인합니다.")
            )
          ),
          h(
            "div",
            { className: "qa-status-summary qa-status-summary-compact" },
            h("span", { className: `qa-badge ${qaClassName(project.qaStatus)}` }, project.qaStatus),
            h("span", { className: "small muted" }, "현재 QA 상태")
          ),
          h(
            "div",
            { className: "qa-accordion" },
            h(
              "button",
              {
                type: "button",
                className: `qa-accordion-toggle${showQaChecklist ? " is-open" : ""}`,
                onClick: () => setShowQaChecklist((prev) => !prev),
                "aria-expanded": showQaChecklist,
              },
              h("span", null, "QA 체크리스트"),
              h(Icon, { name: showQaChecklist ? "chevronUp" : "chevronDown", className: "mini-icon" })
            ),
            showQaChecklist
              ? h(
                  "div",
                  { className: "qa-checklist qa-checklist-compact" },
                  qaChecklist.map((item) =>
                    h(
                      "div",
                      { key: item.label, className: `qa-check-item${item.done ? " is-done" : ""}` },
                      h(Icon, { name: item.done ? "checkCircle" : "clock", className: "mini-icon" }),
                      h("span", null, item.label)
                    )
                  )
                )
              : null
          )
        )
      )
    );
    mainContent = h(React.Fragment, null, mainContent, qaIssueModal);
  }

  return h(
    React.Fragment,
    null,
    h(
      "header",
      { className: "global-header" },
      h(
        "div",
        { className: "header-inner" },
        h(
          "div",
          { className: "header-brand" },
          h(
            "button",
            { className: "back-link", type: "button", onClick: onBack },
            h(Icon, { name: "arrowLeft" }),
            h("span", null, "목록으로")
          ),
          h(
            "div",
            null,
            h("strong", { className: "brand-title" }, "프로젝트 상세"),
            h("div", { className: "small muted" }, "프로젝트 운영과 QA 대응을 한 화면에서 관리합니다.")
          )
        ),
        h(
          "div",
          { className: "header-tools" }
        )
      )
    ),
    h(
      "main",
      { className: "main-shell detail-shell" },
      h(
        "section",
        { className: "section-card detail-hero" },
        h(
          "div",
          { className: "detail-hero-top" },
          h(
            "div",
            null,
            h("span", { className: "small muted" }, "프로젝트 정보"),
            h("h1", { className: "section-title detail-title" }, project.name),
            h("p", { className: "section-copy detail-copy" }, project.description)
          ),
          h(
            "div",
            { className: "project-badges detail-badges" },
            h("span", { className: `badge badge-${statusClassName(project.status)}` }, project.status),
            h("span", { className: `qa-badge ${qaClassName(project.qaStatus)}` }, project.qaStatus)
          )
        ),
        h(
          "div",
          { className: "detail-hero-meta" },
          h("div", { className: "detail-meta-chip" }, h(Icon, { name: "team" }), h("span", null, `담당팀 ${project.team}`)),
          h("div", { className: "detail-meta-chip" }, h(Avatar, { name: project.owner }), h("span", null, `담당자 ${project.owner}`)),
          h("div", { className: "detail-meta-chip" }, h(Icon, { name: "calendar" }), h("span", null, `${formatDate(project.startDate)} ~ ${formatDate(project.endDate)}`)),
          h("div", { className: "detail-meta-chip" }, h(Icon, { name: "issue", className: "issue-icon" }), h("span", null, `오픈 이슈 ${safeCount(project.issueCount)}건`))
        ),
        h(
          "div",
          { className: "detail-progress" },
          h(
            "div",
            { className: "detail-progress-head" },
            h("span", { className: "small muted" }, "진행률"),
            h("strong", { className: "project-progress-value" }, `${project.progress}%`)
          ),
          h("div", { className: "progress-track" }, h("div", { className: "progress-fill", style: { width: `${project.progress}%` } }))
        )
      ),
      h(
        "section",
        { className: "section-card detail-tab-shell" },
        h(
          "div",
          { className: "detail-tab-bar" },
          DETAIL_TABS.map((tab) =>
            h(
              "button",
              {
                key: tab.key,
                type: "button",
                className: `detail-tab${activeTab === tab.key ? " is-active" : ""}`,
                onClick: () => setActiveTab(tab.key),
              },
              tab.label
            )
          )
        )
      ),
      h(
        "div",
        { className: "detail-grid" },
        h("div", { className: "detail-main" }, mainContent),
        h(
          "aside",
          { className: "detail-side detail-side-sticky" },
          h(
            "section",
            { className: "section-card" },
            h(
              "div",
              { className: "section-head section-head-compact" },
              h(
                "div",
                null,
                h("h2", { className: "section-title section-title-compact" }, "프로젝트 요약"),
                h("p", { className: "section-copy section-copy-compact" }, "운영에 필요한 핵심 정보를 모았습니다.")
              )
            ),
            h(
              "div",
              { className: "detail-side-grid" },
              summaryMetaCards.map((card) =>
                h(
                  "div",
                  { key: card.key, className: "detail-side-item" },
                  h(
                    "div",
                    { className: "detail-overview-top" },
                    h("span", { className: `detail-status-dot detail-status-dot-${card.tone}` }),
                    h(Icon, { name: card.icon, className: `detail-overview-icon detail-overview-icon-${card.tone}` }),
                    h("span", { className: "small muted" }, card.label)
                  ),
                  h("strong", { className: `detail-overview-value detail-overview-value-${card.tone}` }, card.value)
                )
              )
            )
          ),
          h(
            "section",
            { className: "section-card" },
            h(
              "div",
              { className: "section-head section-head-compact" },
              h(
                "div",
                null,
                h("h2", { className: "section-title section-title-compact" }, "참여자"),
                h("p", { className: "section-copy section-copy-compact" }, "현재 참여 중인 담당자입니다.")
              )
            ),
            h(
              "div",
              { className: "participant-list" },
              project.participants.map((participant) =>
                h(
                  "div",
                  { key: participant, className: "participant-row" },
                  h(
                    "div",
                    { className: "meta-inline" },
                    h(Avatar, { name: participant }),
                    h("strong", null, participant)
                  )
                )
              )
            )
          ),
          h(
            "section",
            { className: "section-card" },
            h(
              "div",
              { className: "section-head section-head-compact" },
              h(
                "div",
                null,
                h("h2", { className: "section-title section-title-compact" }, "최근 활동"),
                h("p", { className: "section-copy section-copy-compact" }, "상세 화면에서도 최신 활동을 바로 확인합니다.")
              )
            ),
            h(
              "div",
              { className: "activity-list" },
              project.activity.map((item) =>
                h(
                  "article",
                  { key: item.id, className: "activity-row" },
                  h(Avatar, { name: item.actor }),
                  h(
                    "div",
                    { className: "activity-main" },
                    h(
                      "div",
                      { className: "activity-head" },
                      h("strong", null, item.actor),
                      h("span", { className: "small muted activity-date" }, formatDate(item.timestamp))
                    ),
                    h("div", { className: "activity-message" }, item.message)
                  )
                )
              )
            )
          )
        )
      )
    )
  );
}

function FallbackView({ message }) {
  return h(
    "main",
    { className: "main-shell" },
    h(
      "section",
      { className: "section-card empty-state-card" },
      h("h1", { className: "section-title" }, "화면을 불러오지 못했습니다."),
      h("p", { className: "section-copy" }, safeText(message, "알 수 없는 오류가 발생했습니다.")),
      h(
        "button",
        {
          className: "primary-action",
          type: "button",
          onClick: () => window.location.assign("/"),
        },
        "메인으로 이동"
      )
    )
  );
}

function App() {
  const [route, setRoute] = useState(() => parseRoute(window.location.pathname));
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("전체");
  const [sortOrder, setSortOrder] = useState("마감 임박순");
  const [projects, setProjects] = useState(() => loadProjects());

  const createProject = (projectData) => {
    const projectId = `proj-${Date.now()}`;
    const nextProject = withDerivedProjectFields({
      id: projectId,
      name: safeText(projectData.name, "새 프로젝트"),
      description: safeText(projectData.description, "-"),
      team: safeText(projectData.team, "미지정"),
      owner: safeText(projectData.owner, "미지정"),
      status: safeText(projectData.status, "예정"),
      qaStatus: projectData.status === "QA 진행중" ? "테스트 중" : projectData.status === "QA 준비" ? "테스트 전" : "미설정",
      startDate: projectData.startDate || "",
      endDate: projectData.endDate || "",
      participants: [safeText(projectData.owner, "미지정"), "QA 담당", "운영팀"],
      tasks: [],
      issues: [],
      activity: [
        {
          id: `${projectId}-activity-created`,
          actor: safeText(projectData.owner, "미지정"),
          message: "프로젝트가 생성되었습니다.",
          timestamp: "2026-05-11T09:30:00",
        },
      ],
      priority: safeText(projectData.priority, "보통"),
    });

    setProjects((prev) => [nextProject, ...prev]);
    navigateTo(`/project/${projectId}`);
  };

  const addTaskToProject = (projectId, taskData) => {
    setProjects((prev) =>
      prev.map((project) => {
        if (project.id !== projectId) return project;
        const nextTask = {
          id: `${projectId}-task-${Date.now()}`,
          title: safeText(taskData.title, "새 업무"),
          assignee: safeText(taskData.assignee, "미지정"),
          type: taskData.status === "QA" ? "QA" : "업무",
          status: safeText(taskData.status, "예정"),
          priority: safeText(taskData.priority, "보통"),
          dueDate: taskData.dueDate || "",
          startDate: taskData.startDate || "",
          memo: safeText(taskData.description, "").trim(),
        };
        return withDerivedProjectFields({
          ...project,
          tasks: [nextTask, ...project.tasks],
        });
      })
    );
  };

  const updateTaskInProject = (projectId, taskId, updates) => {
    setProjects((prev) =>
      prev.map((project) => {
        if (project.id !== projectId) return project;
        return withDerivedProjectFields({
          ...project,
          tasks: project.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  ...updates,
                  type: updates.status === "QA" ? "QA" : task.type,
                }
              : task
          ),
        });
      })
    );
  };

  const addIssueToProject = (projectId, issueData) => {
    setProjects((prev) =>
      prev.map((project) => {
        if (project.id !== projectId) return project;
        const nextIssue = {
          id: `${projectId}-issue-${Date.now()}`,
          title: safeText(issueData.title, "새 이슈"),
          description: safeText(issueData.description, "").trim(),
          assignee: safeText(issueData.assignee, "미지정"),
          severity: safeText(issueData.severity, "보통"),
          status: safeText(issueData.status, "예정"),
          createdDate: issueData.createdDate || "2026-05-11",
        };

        return withDerivedProjectFields({
          ...project,
          issues: [nextIssue, ...(Array.isArray(project.issues) ? project.issues : [])],
          activity: [
            {
              id: `${projectId}-activity-issue-${Date.now()}`,
              actor: nextIssue.assignee,
              message: `${nextIssue.title} 이슈가 등록되었습니다.`,
              timestamp: `${nextIssue.createdDate || "2026-05-11"}T10:00:00`,
            },
            ...project.activity,
          ],
        });
      })
    );
  };

  useEffect(() => {
    const handleRouteChange = () => setRoute(parseRoute(window.location.pathname));
    window.addEventListener("popstate", handleRouteChange);
    return () => window.removeEventListener("popstate", handleRouteChange);
  }, []);

  const selectedProject = useMemo(() => projects.find((project) => project.id === route.id) || null, [projects, route.id]);

  if (route.page === "detail" && !selectedProject) {
    return h(FallbackView, { message: "선택한 프로젝트를 찾을 수 없습니다." });
  }

  return h(
    "div",
    { className: "page" },
    route.page === "detail"
      ? h(ProjectDetailPage, {
          project: selectedProject,
          onBack: () => navigateTo("/"),
          onAddTask: addTaskToProject,
          onUpdateTask: updateTaskInProject,
          onAddIssue: addIssueToProject,
        })
      : route.page === "inbox"
        ? h(InboxPage, {
            projects,
            onBack: () => navigateTo("/"),
            onOpenProject: (projectId) => navigateTo(`/project/${projectId}`),
          })
      : route.page === "new-project"
        ? h(ProjectCreatePage, {
            onBack: () => navigateTo("/"),
            onCreateProject: createProject,
          })
      : h(DashboardPage, {
          projects,
          query,
          statusFilter,
          sortOrder,
          onQueryChange: setQuery,
          onStatusFilterChange: setStatusFilter,
          onSortOrderChange: setSortOrder,
          onOpenProject: (projectId) => navigateTo(`/project/${projectId}`),
          onCreateProject: () => navigateTo("/projects/new"),
        })
  );
}

function renderFallback(message) {
  const rootElement = document.getElementById("root");
  if (!rootElement) return;
  const root = ReactDOM.createRoot(rootElement);
  root.render(h(FallbackView, { message }));
}

window.addEventListener("error", (event) => {
  renderFallback(event.error?.message || "런타임 오류가 발생했습니다.");
});

window.addEventListener("unhandledrejection", (event) => {
  renderFallback(event.reason?.message || "비동기 처리 중 오류가 발생했습니다.");
});

try {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("root mount 요소를 찾을 수 없습니다.");
  }
  const root = ReactDOM.createRoot(rootElement);
  root.render(h(App));
} catch (error) {
  renderFallback(error?.message || "앱을 시작하지 못했습니다.");
}
