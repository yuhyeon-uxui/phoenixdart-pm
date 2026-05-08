import React, { createElement as h } from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../utils/format.js";
import StatusBadge from "./StatusBadge.js";

export default function ProjectPortfolioCard({ projects, onSelectProject }) {
  return h(
    "section",
    { className: "panel-card" },
    h(
      "div",
      { className: "panel-header" },
      h(
        "div",
        null,
        h("p", { className: "section-kicker" }, "Portfolio"),
        h("h3", null, "프로젝트 포트폴리오")
      ),
      h("span", { className: "chip-label" }, `${projects.length}개 프로젝트`)
    ),
    h(
      "div",
      { className: "portfolio-list" },
      projects.map((project) =>
        h(
          Link,
          {
            key: project.id,
            to: `/project/${project.id}`,
            className: "portfolio-row",
            onClick: () => onSelectProject(project.id),
          },
          h(
            "div",
            { className: "portfolio-main" },
            h("strong", null, project.name),
            h("p", { className: "task-copy" }, project.description)
          ),
          h("span", { className: "portfolio-owner" }, project.owner),
          h("span", { className: "portfolio-date" }, formatDate(project.endDate)),
          h("strong", { className: "portfolio-progress" }, `${project.progress}%`),
          h(StatusBadge, { status: project.status })
        )
      )
    )
  );
}
