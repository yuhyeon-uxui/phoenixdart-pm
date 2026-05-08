import React, { createElement as h } from "react";
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from "../data/projectData.js";

export default function TaskComposerCard({
  draft,
  onStartNewTask,
  onDraftChange,
  onSubmit,
  onCancel,
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
        h("p", { className: "section-kicker" }, "Task Composer"),
        h("h3", null, draft?.id ? "업무 수정" : "업무 등록")
      ),
      h(
        "div",
        { className: "panel-actions" },
        h(
          "button",
          { className: "secondary-button", type: "button", onClick: onStartNewTask },
          "새 업무"
        ),
        draft
          ? h(
              "button",
              { className: "ghost-button", type: "button", onClick: onCancel },
              "취소"
            )
          : null
      )
    ),
    draft
      ? h(
          React.Fragment,
          null,
          h(
            "div",
            { className: "form-grid" },
            h("input", {
              className: "field-input",
              value: draft.title,
              onChange: (event) => onDraftChange("title", event.target.value),
              placeholder: "업무명",
            }),
            h("input", {
              className: "field-input",
              value: draft.assignee,
              onChange: (event) => onDraftChange("assignee", event.target.value),
              placeholder: "담당자",
            }),
            h(
              "select",
              {
                className: "field-input",
                value: draft.status,
                onChange: (event) => onDraftChange("status", event.target.value),
              },
              STATUS_OPTIONS.map((status) =>
                h("option", { key: status, value: status }, status)
              )
            ),
            h(
              "select",
              {
                className: "field-input",
                value: draft.priority,
                onChange: (event) => onDraftChange("priority", event.target.value),
              },
              PRIORITY_OPTIONS.map((priority) =>
                h("option", { key: priority, value: priority }, priority)
              )
            ),
            h("input", {
              className: "field-input",
              type: "date",
              value: draft.dueDate,
              onChange: (event) => onDraftChange("dueDate", event.target.value),
            }),
            h("textarea", {
              className: "field-input field-textarea",
              value: draft.memo,
              onChange: (event) => onDraftChange("memo", event.target.value),
              placeholder: "메모",
            })
          ),
          h(
            "button",
            { className: "primary-button", type: "button", onClick: onSubmit },
            draft.id ? "업무 저장" : "업무 생성"
          )
        )
      : h(
          "div",
          { className: "empty-state" },
          h("p", { className: "empty-copy" }, "새 업무를 만들거나 기존 업무를 수정해 주세요.")
        )
  );
}
