import React, { createElement as h, useEffect, useMemo, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";
import AppLayout from "./components/AppLayout.js";
import OperationsDashboardPage from "./pages/OperationsDashboardPage.js";
import ProjectDetailPage from "./pages/ProjectDetailPage.js";
import {
  buildProjectDraft,
  buildTaskDraft,
  calculateProjectProgress,
  cloneProjects,
  createActivityEntry,
  createCommentEntry,
  createId,
  getProjectMetrics,
  getSelectedProject,
  getSelectedTask,
  normalizeProjects,
  seedProjects,
} from "./data/projectData.js";
import {
  loadCurrentUser,
  loadProjects,
  loadSelectedProjectId,
  loadSelectedTaskId,
  saveCurrentUser,
  saveProjects,
  saveSelectedProjectId,
  saveSelectedTaskId,
} from "./utils/storage.js";

function AppStateRouter() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState(() => normalizeProjects(loadProjects() || seedProjects));
  const [selectedProjectId, setSelectedProjectId] = useState(() => loadSelectedProjectId());
  const [selectedTaskId, setSelectedTaskId] = useState(() => loadSelectedTaskId());
  const [currentUser, setCurrentUser] = useState(() => loadCurrentUser());
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("전체");
  const [projectEditorMode, setProjectEditorMode] = useState("edit");
  const [projectDraft, setProjectDraft] = useState(null);
  const [taskDraft, setTaskDraft] = useState(null);
  const [pendingTaskStatus, setPendingTaskStatus] = useState({});

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(search.toLowerCase()) ||
        project.owner.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "전체" || project.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [projects, search, statusFilter]);

  const selectedProject = getSelectedProject(projects, selectedProjectId);
  const selectedTask = getSelectedTask(selectedProject, selectedTaskId);
  const metrics = useMemo(() => getProjectMetrics(projects), [projects]);

  useEffect(() => {
    if (projects.length) {
      saveProjects(projects);
    }
  }, [projects]);

  useEffect(() => {
    saveCurrentUser(currentUser);
  }, [currentUser]);

  useEffect(() => {
    if (selectedProjectId) {
      saveSelectedProjectId(selectedProjectId);
    }
  }, [selectedProjectId]);

  useEffect(() => {
    saveSelectedTaskId(selectedTaskId || "");
  }, [selectedTaskId]);

  useEffect(() => {
    if (!projects.length) return;

    const hasProject = projects.some((project) => project.id === selectedProjectId);
    const resolvedProject = hasProject ? getSelectedProject(projects, selectedProjectId) : projects[0];

    if (!hasProject && resolvedProject) {
      setSelectedProjectId(resolvedProject.id);
      setSelectedTaskId(resolvedProject.tasks[0]?.id || "");
      setProjectDraft(buildProjectDraft(resolvedProject));
    }

    if (
      projectEditorMode === "edit" &&
      resolvedProject &&
      (!projectDraft || projectDraft.id !== resolvedProject.id)
    ) {
      setProjectDraft(buildProjectDraft(resolvedProject));
    }
  }, [projects, selectedProjectId, projectEditorMode, projectDraft]);

  function persistProjectsOptimistically(nextProjects, options = {}) {
    const { taskId, rollbackProjects } = options;
    if (taskId) {
      setPendingTaskStatus((current) => ({ ...current, [taskId]: true }));
    }

    setProjects(nextProjects);

    Promise.resolve()
      .then(() => saveProjects(nextProjects))
      .catch(() => {
        if (rollbackProjects) {
          setProjects(rollbackProjects);
        }
      })
      .finally(() => {
        if (!taskId) return;
        setPendingTaskStatus((current) => {
          const next = { ...current };
          delete next[taskId];
          return next;
        });
      });
  }

  function selectProject(projectId, shouldNavigate = true) {
    const project = projects.find((item) => item.id === projectId);
    if (!project) return;
    setSelectedProjectId(projectId);
    setSelectedTaskId(project.tasks[0]?.id || "");
    setProjectEditorMode("edit");
    setProjectDraft(buildProjectDraft(project));
    setTaskDraft(null);
    if (shouldNavigate) {
      navigate(`/project/${projectId}`);
    }
  }

  function handleProjectDraftChange(field, value) {
    setProjectDraft((current) => ({ ...current, [field]: value }));
  }

  function startNewProject() {
    setProjectEditorMode("create");
    setProjectDraft(buildProjectDraft());
  }

  function editCurrentProject() {
    if (!selectedProject) return;
    setProjectEditorMode("edit");
    setProjectDraft(buildProjectDraft(selectedProject));
  }

  function submitProject() {
    if (!projectDraft?.name?.trim() || !projectDraft?.owner?.trim()) return;

    if (projectEditorMode === "create") {
      const newProject = {
        ...projectDraft,
        id: createId("proj"),
        progress: 0,
        tasks: [],
      };
      setProjects((current) => [newProject, ...current]);
      setSelectedProjectId(newProject.id);
      setSelectedTaskId("");
      setProjectEditorMode("edit");
      setProjectDraft(buildProjectDraft(newProject));
      navigate(`/project/${newProject.id}`);
      return;
    }

    setProjects((current) =>
      current.map((project) =>
        project.id === projectDraft.id
          ? {
              ...project,
              ...projectDraft,
              progress: calculateProjectProgress(project.tasks),
            }
          : project
      )
    );
  }

  function cancelProjectEdit() {
    if (!selectedProject) return;
    setProjectEditorMode("edit");
    setProjectDraft(buildProjectDraft(selectedProject));
  }

  function startNewTask() {
    setTaskDraft(buildTaskDraft());
  }

  function editTask(task) {
    setTaskDraft(buildTaskDraft(task));
    setSelectedTaskId(task.id);
  }

  function updateTaskDraft(field, value) {
    setTaskDraft((current) => ({ ...current, [field]: value }));
  }

  function submitTask() {
    if (!selectedProject || !taskDraft?.title?.trim() || !taskDraft?.assignee?.trim()) return;

    const timestamp = new Date().toISOString();
    const createdTaskId = taskDraft.id || createId("task");

    setProjects((current) =>
      current.map((project) => {
        if (project.id !== selectedProject.id) return project;
        const existing = project.tasks.find((task) => task.id === taskDraft.id);
        let nextTasks = cloneProjects([project])[0].tasks;

        if (existing) {
          const changes = [];
          if (existing.status !== taskDraft.status) {
            changes.push(
              createActivityEntry({
                user: currentUser,
                timestamp,
                type: "status",
                message: `상태를 ${existing.status}에서 ${taskDraft.status}(으)로 변경`,
              })
            );
          }
          if (existing.priority !== taskDraft.priority) {
            changes.push(
              createActivityEntry({
                user: currentUser,
                timestamp,
                type: "priority",
                message: `우선순위를 ${existing.priority}에서 ${taskDraft.priority}(으)로 변경`,
              })
            );
          }
          changes.push(
            createActivityEntry({
              user: currentUser,
              timestamp,
              type: "update",
              message: "업무 정보를 수정",
            })
          );

          nextTasks = nextTasks.map((task) =>
            task.id === taskDraft.id
              ? {
                  ...task,
                  ...taskDraft,
                  comments: task.comments || [],
                  activity: [...changes, ...(task.activity || [])],
                }
              : task
          );
        } else {
          nextTasks = [
            {
              ...taskDraft,
              id: createdTaskId,
              comments: [],
              activity: [
                createActivityEntry({
                  user: currentUser,
                  timestamp,
                  type: "create",
                  message: "업무를 등록",
                }),
              ],
            },
            ...nextTasks,
          ];
        }

        return {
          ...project,
          tasks: nextTasks,
          progress: calculateProjectProgress(nextTasks),
        };
      })
    );

    if (!taskDraft.id) {
      setSelectedTaskId(createdTaskId);
    }
    setTaskDraft(null);
  }

  function changeTaskStatus(taskId, nextStatus) {
    if (!selectedProject) return;
    const rollbackProjects = projects;
    const timestamp = new Date().toISOString();
    const nextProjects = projects.map((project) => {
      if (project.id !== selectedProject.id) return project;
      const nextTasks = project.tasks.map((task) => {
        if (task.id !== taskId || task.status === nextStatus) return task;
        return {
          ...task,
          status: nextStatus,
          activity: [
            createActivityEntry({
              user: currentUser,
              timestamp,
              type: "status",
              message: `상태를 ${task.status}에서 ${nextStatus}(으)로 변경`,
            }),
            ...(task.activity || []),
          ],
        };
      });
      return {
        ...project,
        tasks: nextTasks,
        progress: calculateProjectProgress(nextTasks),
      };
    });

    persistProjectsOptimistically(nextProjects, { taskId, rollbackProjects });
  }

  function changeTaskPriority(taskId, nextPriority) {
    if (!selectedProject) return;
    const timestamp = new Date().toISOString();

    setProjects((current) =>
      current.map((project) => {
        if (project.id !== selectedProject.id) return project;
        return {
          ...project,
          tasks: project.tasks.map((task) =>
            task.id === taskId && task.priority !== nextPriority
              ? {
                  ...task,
                  priority: nextPriority,
                  activity: [
                    createActivityEntry({
                      user: currentUser,
                      timestamp,
                      type: "priority",
                      message: `우선순위를 ${task.priority}에서 ${nextPriority}(으)로 변경`,
                    }),
                    ...(task.activity || []),
                  ],
                }
              : task
          ),
        };
      })
    );
  }

  function addTaskComment(taskId, message) {
    if (!selectedProject || !message.trim()) return;
    const timestamp = new Date().toISOString();

    setProjects((current) =>
      current.map((project) => {
        if (project.id !== selectedProject.id) return project;
        return {
          ...project,
          tasks: project.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  comments: [
                    createCommentEntry({
                      user: currentUser,
                      timestamp,
                      message,
                    }),
                    ...(task.comments || []),
                  ],
                  activity: [
                    createActivityEntry({
                      user: currentUser,
                      timestamp,
                      type: "comment",
                      message: "댓글을 추가",
                    }),
                    ...(task.activity || []),
                  ],
                }
              : task
          ),
        };
      })
    );
  }

  return h(
    AppLayout,
    {
      projects: filteredProjects,
      selectedProject,
      search,
      statusFilter,
      currentUser,
      onSearchChange: setSearch,
      onStatusFilterChange: setStatusFilter,
      onCurrentUserChange: setCurrentUser,
      onSelectProject: selectProject,
      onStartNewProject: startNewProject,
    },
    h(
      Routes,
      null,
      h(Route, {
        path: "/",
        element: h(OperationsDashboardPage, {
          metrics,
          projects: filteredProjects,
          selectedProject,
          onSelectProject: selectProject,
          onEditCurrentProject: editCurrentProject,
          onStartNewTask: startNewTask,
        }),
      }),
      h(Route, {
        path: "/project/:id",
        element: h(ProjectDetailRoute, {
          projects,
          selectedProject,
          selectedTask,
          projectEditorMode,
          projectDraft,
          taskDraft,
          pendingTaskStatus,
          metrics,
          onSelectProject: selectProject,
          onSelectTask: setSelectedTaskId,
          onEditCurrentProject: editCurrentProject,
          onStartNewTask: startNewTask,
          onProjectDraftChange: handleProjectDraftChange,
          onSubmitProject: submitProject,
          onCancelProjectEdit: cancelProjectEdit,
          onEditTask: editTask,
          onTaskDraftChange: updateTaskDraft,
          onSubmitTask: submitTask,
          onCancelTaskEdit: () => setTaskDraft(null),
          onTaskStatusChange: changeTaskStatus,
          onTaskPriorityChange: changeTaskPriority,
          onAddTaskComment: addTaskComment,
        }),
      }),
      h(Route, {
        path: "*",
        element: h(Navigate, { to: "/" }),
      })
    )
  );
}

function ProjectDetailRoute(props) {
  const { id } = useParams();
  const project = props.projects.find((item) => item.id === id) || null;

  useEffect(() => {
    if (project && project.id !== props.selectedProject?.id) {
      props.onSelectProject(project.id, false);
    }
  }, [project, props.selectedProject?.id, props.onSelectProject]);

  if (!project) {
    return h(Navigate, { to: "/" });
  }

  const selectedTask = getSelectedTask(project, props.selectedTask?.id);

  return h(ProjectDetailPage, {
    metrics: props.metrics,
    selectedProject: project,
    selectedTask,
    projectEditorMode: props.projectEditorMode,
    projectDraft:
      props.projectDraft?.id === project.id || props.projectEditorMode === "create"
        ? props.projectDraft
        : buildProjectDraft(project),
    taskDraft: props.taskDraft,
    pendingTaskStatus: props.pendingTaskStatus,
    onEditCurrentProject: props.onEditCurrentProject,
    onStartNewTask: props.onStartNewTask,
    onProjectDraftChange: props.onProjectDraftChange,
    onSubmitProject: props.onSubmitProject,
    onCancelProjectEdit: props.onCancelProjectEdit,
    onSelectTask: props.onSelectTask,
    onEditTask: props.onEditTask,
    onTaskDraftChange: props.onTaskDraftChange,
    onSubmitTask: props.onSubmitTask,
    onCancelTaskEdit: props.onCancelTaskEdit,
    onTaskStatusChange: props.onTaskStatusChange,
    onTaskPriorityChange: props.onTaskPriorityChange,
    onAddTaskComment: props.onAddTaskComment,
  });
}

export default function App() {
  return h(BrowserRouter, null, h(AppStateRouter));
}
