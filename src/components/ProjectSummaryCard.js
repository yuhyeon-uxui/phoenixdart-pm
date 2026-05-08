import React, { createElement as h } from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../utils/format.js";
import StatusBadge from "./StatusBadge.js";

function SummaryItem(label, value) {
  return h(
    "div",
    { className: "summary-item", key: label },
    h("span", { className: "summary-label" }, label),
    h("strong", { className: "summary-value" }, value)
  );
}

export default function ProjectSummaryCard({
  project,
  onEditCurrentProject,
  onStartNewTask,
  showDetailLink = false,
}) {
  if (!project) {
    return h(
      "section",
      { className: "panel-card" },
      h("h3", null, "프로젝트가 없습니다."),
      h("p", { className: "empty-copy" }, "좌측에서 새 프로젝트를 추가해 주세요.")
    );
  }

  return h(
    "section",
    { className: "panel-card" },
    h(
      "div",
      { className: "panel-header" },
      h(
        "div",
        null,
        h("p", { className: "section-kicker" }, "Project Summary"),
        h("h3", null, project.name)
      ),
      h(
        "div",
        { className: "panel-actions" },
        h(StatusBadge, { status: project.status }),
        h(
          "button",
          { className: "secondary-button", type: "button", onClick: onEditCurrentProject },
          "프로젝트 수정"
        ),
        showDetailLink
          ? h(
              Link,
              {
                className: "secondary-button button-link",
                to: `/project/${project.id}`,
              },
              "상세 보기"
            )
          : null,
        h(
          "button",
          { className: "primary-button", type: "button", onClick: onStartNewTask },
          "업무 추가"
        )
      )
    ),
    h("p", { className: "panel-copy" }, project.description),
    h(
      "div",
      { className: "summary-grid" },
      [
        SummaryItem("담당자", project.owner),
        SummaryItem("시작일", formatDate(project.startDate)),
        SummaryItem("종료일", formatDate(project.endDate)),
        SummaryItem("진행률", `${project.progress}%`),
      ]
    ),
    h(
      "div",
      { className: "progress-wrap" },
      h(
        "div",
        { className: "progress-meta" },
        h("span", null, "업무 기준 진행률"),
        h("strong", null, `${project.progress}%`)
      ),
      h(
        "div",
        { className: "progress-track" },
        h("div", {
          className: "progress-bar",
          style: { width: `${project.progress}%` },
        })
      )
    )
  );
}
