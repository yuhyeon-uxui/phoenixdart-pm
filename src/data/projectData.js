export const STATUS_OPTIONS = ["예정", "진행 중", "검토 중", "완료", "보류"];
export const PRIORITY_OPTIONS = ["높음", "보통", "낮음"];

export const seedProjects = [
  {
    id: "proj-1",
    name: "PhoenixDart 사내 포털 리뉴얼",
    description: "내부 운영 포털 UI 개편과 접근성 개선을 위한 대표 프로젝트",
    status: "진행 중",
    owner: "김지훈",
    startDate: "2026-04-01",
    endDate: "2026-05-16",
    progress: 64,
    tasks: [
      {
        id: "task-1",
        title: "대시보드 와이어프레임 확정",
        assignee: "박서윤",
        status: "완료",
        priority: "높음",
        dueDate: "2026-04-08",
        memo: "기획 승인 완료",
        comments: [
          {
            id: "comment-1",
            user: "김지훈",
            timestamp: "2026-04-08T10:20:00+09:00",
            message: "승인 반영까지 마무리되었습니다.",
          },
        ],
        activity: [
          {
            id: "log-1",
            user: "박서윤",
            timestamp: "2026-04-08T09:00:00+09:00",
            type: "status",
            message: "상태를 진행 중에서 완료로 변경",
          },
        ],
      },
      {
        id: "task-2",
        title: "프로젝트 목록 API 연동 준비",
        assignee: "최민석",
        status: "진행 중",
        priority: "높음",
        dueDate: "2026-04-27",
        memo: "백엔드 스펙 정리 중",
        comments: [],
        activity: [
          {
            id: "log-2",
            user: "최민석",
            timestamp: "2026-04-21T14:10:00+09:00",
            type: "update",
            message: "API 필드 정의 문서를 업데이트",
          },
        ],
      },
      {
        id: "task-3",
        title: "상세 화면 QA 체크리스트 작성",
        assignee: "이하은",
        status: "검토 중",
        priority: "보통",
        dueDate: "2026-04-29",
        memo: "시나리오 1차 초안 작성됨",
        comments: [],
        activity: [
          {
            id: "log-3",
            user: "이하은",
            timestamp: "2026-04-22T11:00:00+09:00",
            type: "status",
            message: "상태를 진행 중에서 검토 중으로 변경",
          },
        ],
      },
    ],
  },
  {
    id: "proj-2",
    name: "영업지원 CRM 경량화",
    description: "영업팀 핵심 기능만 빠르게 다룰 수 있는 경량 CRM 개선",
    status: "예정",
    owner: "정도윤",
    startDate: "2026-05-02",
    endDate: "2026-06-20",
    progress: 25,
    tasks: [
      {
        id: "task-4",
        title: "요구사항 우선순위 재정의",
        assignee: "정도윤",
        status: "진행 중",
        priority: "높음",
        dueDate: "2026-05-04",
        memo: "현업 인터뷰 일정 확정 필요",
        comments: [],
        activity: [
          {
            id: "log-4",
            user: "정도윤",
            timestamp: "2026-04-23T09:30:00+09:00",
            type: "create",
            message: "업무를 등록",
          },
        ],
      },
      {
        id: "task-5",
        title: "권한 정책 초안 작성",
        assignee: "신예린",
        status: "예정",
        priority: "보통",
        dueDate: "2026-05-08",
        memo: "사내 보안 정책 참고",
        comments: [],
        activity: [],
      },
    ],
  },
  {
    id: "proj-3",
    name: "채용 파이프라인 자동화",
    description: "채용 상태와 인터뷰 일정을 한 번에 관리하는 내부 도구 구축",
    status: "보류",
    owner: "한주원",
    startDate: "2026-03-15",
    endDate: "2026-05-30",
    progress: 33,
    tasks: [
      {
        id: "task-6",
        title: "캘린더 연동 방식 검토",
        assignee: "오세린",
        status: "보류",
        priority: "높음",
        dueDate: "2026-04-18",
        memo: "외부 캘린더 정책 확인 대기",
        comments: [],
        activity: [
          {
            id: "log-5",
            user: "오세린",
            timestamp: "2026-04-18T16:00:00+09:00",
            type: "status",
            message: "상태를 진행 중에서 보류로 변경",
          },
        ],
      },
      {
        id: "task-7",
        title: "후보자 상태 맵핑 정의",
        assignee: "한주원",
        status: "진행 중",
        priority: "낮음",
        dueDate: "2026-04-30",
        memo: "HR팀 피드백 반영 예정",
        comments: [],
        activity: [],
      },
    ],
  },
];

export function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

export function createActivityEntry({ user, timestamp, type, message }) {
  return { id: createId("log"), user, timestamp, type, message };
}

export function createCommentEntry({ user, timestamp, message }) {
  return { id: createId("comment"), user, timestamp, message };
}

export function calculateProjectProgress(tasks) {
  if (!tasks?.length) return 0;
  const score = tasks.reduce((total, task) => {
    if (task.status === "완료") return total + 100;
    if (task.status === "검토 중") return total + 80;
    if (task.status === "진행 중") return total + 55;
    if (task.status === "보류") return total + 15;
    return total;
  }, 0);
  return Math.round(score / tasks.length);
}

export function buildProjectDraft(project) {
  return {
    id: project?.id || "",
    name: project?.name || "",
    description: project?.description || "",
    status: project?.status || "예정",
    owner: project?.owner || "",
    startDate: project?.startDate || "",
    endDate: project?.endDate || "",
  };
}

export function buildTaskDraft(task) {
  return {
    id: task?.id || "",
    title: task?.title || "",
    assignee: task?.assignee || "",
    status: task?.status || "예정",
    priority: task?.priority || "보통",
    dueDate: task?.dueDate || "",
    memo: task?.memo || "",
  };
}

export function normalizeProjects(projects) {
  return (projects || []).map((project) => {
    const tasks = (project.tasks || []).map((task) => ({
      ...task,
      comments: task.comments || [],
      activity: task.activity || [],
    }));
    return {
      ...project,
      progress: calculateProjectProgress(tasks),
      tasks,
    };
  });
}

export function cloneProjects(projects) {
  return JSON.parse(JSON.stringify(projects));
}

export function getSelectedProject(projects, projectId) {
  return projects.find((project) => project.id === projectId) || projects[0] || null;
}

export function getSelectedTask(project, taskId) {
  if (!project) return null;
  return project.tasks.find((task) => task.id === taskId) || project.tasks[0] || null;
}

export function getProjectMetrics(projects) {
  const today = new Date("2026-04-23T00:00:00+09:00");
  const tasks = projects.flatMap((project) => project.tasks || []);
  const doneTasks = tasks.filter((task) => task.status === "완료").length;
  const completionRate = tasks.length ? Math.round((doneTasks / tasks.length) * 100) : 0;
  const dueThisWeek = tasks.filter((task) => {
    if (!task.dueDate || task.status === "완료") return false;
    const diffDays = Math.ceil((new Date(task.dueDate) - today) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  }).length;

  return {
    projectCount: projects.length,
    activeCount: projects.filter(
      (project) => project.status === "진행 중" || project.status === "검토 중"
    ).length,
    doneTasks,
    completionRate,
    dueThisWeek,
    overdueCount: tasks.filter(
      (task) => task.status !== "완료" && task.dueDate && new Date(task.dueDate) < today
    ).length,
  };
}
