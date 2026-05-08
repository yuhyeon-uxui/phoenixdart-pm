import React, { createElement as h } from "react";
import { Link } from "react-router-dom";
import { STATUS_OPTIONS } from "../data/projectData.js";
import StatusBadge from "./StatusBadge.js";

export default function Sidebar({
  projects,
  selectedProjectId,
  search,
  statusFilter,
  onSearchChange,
  onStatusFilterChange,
  onSelectProject,
  onStartNewProject,
}) {
  return h(
    "aside",
    { className: "sidebar" },
    h(
      "div",
      { className: "sidebar-brand" },
      h("div", { className: "brand-mark" }, "PD"),
      h(
        "div",
        null,
        h("p", { className: "sidebar-label" }, "PhoenixDart"),
        h("h1", { className: "sidebar-title" }, "Operations PM")
      )
    ),
    h(
      "button",
      {
        className: "primary-button sidebar-button",
        type: "button",
        onClick: onStartNewProject,
      },
      "새 프로젝트"
    ),
    h(
      "div",
      { className: "sidebar-panel" },
      h("p", { className: "section-kicker" }, "Filter"),
      h("input", {
        className: "field-input",
        value: search,
        onChange: (event) => onSearchChange(event.target.value),
        placeholder: "프로젝트명 또는 담당자 검색",
      }),
      h(
        "select",
        {
          className: "field-input",
          value: statusFilter,
          onChange: (event) => onStatusFilterChange(event.target.value),
        },
        ["전체", ...STATUS_OPTIONS].map((status) =>
          h("option", { key: status, value: status }, status)
        )
      )
    ),
    h(
      "div",
      { className: "sidebar-projects" },
      projects.map((project) =>
        h(
          Link,
          {
            key: project.id,
            to: `/project/${project.id}`,
            className: `nav-project ${selectedProjectId === project.id ? "is-active" : ""}`,
            onClick: () => onSelectProject(project.id, false),
          },
          h(
            "div",
            { className: "nav-project-top" },
            h("strong", null, project.name),
            h(StatusBadge, { status: project.status })
          ),
          h("p", null, project.description),
          h(
            "div",
            { className: "nav-project-meta" },
            h("span", null, `담당 ${project.owner}`),
            h("span", null, `${project.progress}%`)
          )
        )
      )
    )
  );
}
