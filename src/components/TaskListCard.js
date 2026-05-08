import React, { createElement as h } from "react";
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from "../data/projectData.js";
import { formatDate } from "../utils/format.js";
import StatusBadge from "./StatusBadge.js";

export default function TaskListCard({
  project,
  selectedTaskId,
  pendingTaskStatus = {},
  onSelectTask,
  onEditTask,
  onTaskStatusChange,
  onTaskPriorityChange,
}) {
  return h(
    "section",
    { className: "panel-card panel-card-tall" },
    h(
      "div",
      { className: "panel-header" },
      h(
        "div",
        null,
        h("p", { className: "section-kicker" }, "Task List"),
        h("h3", null, "업무 현황")
      ),
      h("span", { className: "chip-label" }, `${project?.tasks?.length || 0}건`)
    ),
    project?.tasks?.length
      ? h(
          "div",
          { className: "task-list" },
          project.tasks.map((task) =>
            h(
              "article",
              {
                key: task.id,
                className: `task-card ${selectedTaskId === task.id ? "is-selected" : ""}`,
                onClick: () => onSelectTask(task.id),
              },
              h(
                "div",
                { className: "task-card-top" },
                h(
                  "div",
                  null,
                  h("strong", { className: "task-title" }, task.title),
                  h("p", { className: "task-copy" }, task.memo || "메모 없음")
                ),
                h(StatusBadge, { status: task.status })
              ),
              h(
                "div",
                { className: "task-card-meta" },
                h("span", null, `담당 ${task.assignee}`),
                h("span", null, `마감 ${formatDate(task.dueDate)}`),
                h("span", null, `우선 ${task.priority}`)
              ),
              h(
                "div",
                { className: "task-card-controls" },
                h(
                  "select",
                  {
                    className: "field-input compact-input",
                    value: task.status,
                    disabled: Boolean(pendingTaskStatus[task.id]),
                    onClick: (event) => event.stopPropagation(),
                    onChange: (event) => onTaskStatusChange(task.id, event.target.value),
                  },
                  STATUS_OPTIONS.map((status) =>
                    h("option", { key: status, value: status }, status)
                  )
                ),
                h(
                  "select",
                  {
                    className: "field-input compact-input",
                    value: task.priority,
                    onClick: (event) => event.stopPropagation(),
                    onChange: (event) => onTaskPriorityChange(task.id, event.target.value),
                  },
                  PRIORITY_OPTIONS.map((priority) =>
                    h("option", { key: priority, value: priority }, priority)
                  )
                ),
                h(
                  "span",
                  { className: "task-sync-state" },
                  pendingTaskStatus[task.id] ? "저장 중..." : ""
                ),
                h(
                  "button",
                  {
                    className: "ghost-button",
                    type: "button",
                    onClick: (event) => {
                      event.stopPropagation();
                      onEditTask(task);
                    },
                  },
                  "수정"
                )
              )
            )
          )
        )
      : h("p", { className: "empty-copy" }, "등록된 업무가 없습니다.")
  );
}
