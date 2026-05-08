import React, { createElement as h } from "react";
import { STATUS_OPTIONS } from "../data/projectData.js";

export default function ProjectEditorCard({ mode, draft, onDraftChange, onSubmit, onCancel }) {
  return h(
    "section",
    { className: "panel-card" },
    h(
      "div",
      { className: "panel-header" },
      h(
        "div",
        null,
        h("p", { className: "section-kicker" }, "Project Editor"),
        h("h3", null, mode === "create" ? "새 프로젝트 등록" : "프로젝트 정보 수정")
      ),
      h(
        "button",
        { className: "ghost-button", type: "button", onClick: onCancel },
        "초기화"
      )
    ),
    h(
      "div",
      { className: "form-grid" },
      h("input", {
        className: "field-input",
        value: draft?.name || "",
        onChange: (event) => onDraftChange("name", event.target.value),
        placeholder: "프로젝트명",
      }),
      h("input", {
        className: "field-input",
        value: draft?.owner || "",
        onChange: (event) => onDraftChange("owner", event.target.value),
        placeholder: "담당자",
      }),
      h(
        "select",
        {
          className: "field-input",
          value: draft?.status || STATUS_OPTIONS[0],
          onChange: (event) => onDraftChange("status", event.target.value),
        },
        STATUS_OPTIONS.map((status) => h("option", { key: status, value: status }, status))
      ),
      h("input", {
        className: "field-input",
        type: "date",
        value: draft?.startDate || "",
        onChange: (event) => onDraftChange("startDate", event.target.value),
      }),
      h("input", {
        className: "field-input",
        type: "date",
        value: draft?.endDate || "",
        onChange: (event) => onDraftChange("endDate", event.target.value),
      }),
      h("textarea", {
        className: "field-input field-textarea",
        value: draft?.description || "",
        onChange: (event) => onDraftChange("description", event.target.value),
        placeholder: "프로젝트 설명",
      })
    ),
    h(
      "button",
      { className: "primary-button", type: "button", onClick: onSubmit },
      mode === "create" ? "프로젝트 생성" : "프로젝트 저장"
    )
  );
}
