import React, { createElement as h } from "react";
import KpiCards from "../components/KpiCards.js";
import ProjectSummaryCard from "../components/ProjectSummaryCard.js";
import ProjectEditorCard from "../components/ProjectEditorCard.js";
import TaskComposerCard from "../components/TaskComposerCard.js";
import TaskListCard from "../components/TaskListCard.js";
import TaskActivityPanel from "../components/TaskActivityPanel.js";

export default function ProjectDetailPage({
  metrics,
  selectedProject,
  selectedTask,
  projectEditorMode,
  projectDraft,
  taskDraft,
  pendingTaskStatus,
  onEditCurrentProject,
  onStartNewTask,
  onProjectDraftChange,
  onSubmitProject,
  onCancelProjectEdit,
  onSelectTask,
  onEditTask,
  onTaskDraftChange,
  onSubmitTask,
  onCancelTaskEdit,
  onTaskStatusChange,
  onTaskPriorityChange,
  onAddTaskComment,
}) {
  return h(
    React.Fragment,
    null,
    h(KpiCards, { metrics }),
    h(
      "section",
      { className: "content-grid content-grid-top" },
      h(ProjectSummaryCard, {
        project: selectedProject,
        onEditCurrentProject,
        onStartNewTask,
      }),
      h(ProjectEditorCard, {
        mode: projectEditorMode,
        draft: projectDraft,
        onDraftChange: onProjectDraftChange,
        onSubmit: onSubmitProject,
        onCancel: onCancelProjectEdit,
      })
    ),
    h(
      "section",
      { className: "content-grid content-grid-bottom" },
      h(TaskComposerCard, {
        draft: taskDraft,
        onStartNewTask,
        onDraftChange: onTaskDraftChange,
        onSubmit: onSubmitTask,
        onCancel: onCancelTaskEdit,
      }),
      h(TaskListCard, {
        project: selectedProject,
        selectedTaskId: selectedTask?.id,
        pendingTaskStatus,
        onSelectTask,
        onEditTask,
        onTaskStatusChange,
        onTaskPriorityChange,
      }),
      h(TaskActivityPanel, {
        key: selectedTask?.id || "empty-task",
        task: selectedTask,
        onAddComment: onAddTaskComment,
      })
    )
  );
}
