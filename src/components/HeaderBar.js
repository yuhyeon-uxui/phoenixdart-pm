import React, { createElement as h } from "react";
import StatusBadge from "./StatusBadge.js";

export default function HeaderBar({ selectedProject, currentUser, onCurrentUserChange }) {
  return h(
    "header",
    { className: "topbar" },
    h(
      "div",
      null,
      h("p", { className: "section-kicker" }, "Workspace"),
      h("h2", { className: "topbar-title" }, "사내 프로젝트 운영 대시보드"),
      h(
        "p",
        { className: "topbar-copy" },
        "프로젝트 현황, 업무 우선순위, 진행 로그를 차분하게 관리하는 내부 운영 화면입니다."
      )
    ),
    h(
      "div",
      { className: "topbar-actions" },
      h(
        "div",
        { className: "current-project-chip" },
        h("span", { className: "chip-label" }, "선택 프로젝트"),
        h("strong", null, selectedProject?.name || "프로젝트 없음"),
        selectedProject ? h(StatusBadge, { status: selectedProject.status }) : null
      ),
      h(
        "label",
        { className: "current-user-box" },
        h("span", { className: "chip-label" }, "현재 작업자"),
        h("input", {
          className: "field-input",
          value: currentUser,
          onChange: (event) => onCurrentUserChange(event.target.value),
          placeholder: "예: 김지훈",
        })
      )
    )
  );
}
