import React, { createElement as h, useState } from "react";
import { formatDateTime } from "../utils/format.js";

export default function TaskActivityPanel({ task, onAddComment }) {
  const [comment, setComment] = useState("");

  function submitComment() {
    if (!task || !comment.trim()) return;
    onAddComment(task.id, comment.trim());
    setComment("");
  }

  return h(
    "section",
    { className: "panel-card panel-card-tall" },
    h(
      "div",
      { className: "panel-header" },
      h(
        "div",
        null,
        h("p", { className: "section-kicker" }, "Activity"),
        h("h3", null, "댓글 및 업데이트 로그")
      ),
      task ? h("span", { className: "chip-label" }, task.title) : null
    ),
    task
      ? h(
          React.Fragment,
          null,
          h(
            "div",
            { className: "comment-composer" },
            h("textarea", {
              className: "field-input field-textarea",
              value: comment,
              onChange: (event) => setComment(event.target.value),
              placeholder: "업데이트 코멘트를 남겨 주세요.",
            }),
            h(
              "button",
              { className: "primary-button", type: "button", onClick: submitComment },
              "댓글 추가"
            )
          ),
          h(
            "div",
            { className: "activity-columns" },
            h(
              "div",
              null,
              h("h4", { className: "subsection-title" }, "최근 댓글"),
              task.comments?.length
                ? h(
                    "div",
                    { className: "timeline-list" },
                    task.comments.map((entry) =>
                      h(
                        "article",
                        { key: entry.id, className: "timeline-card" },
                        h(
                          "div",
                          { className: "timeline-top" },
                          h("strong", null, entry.user),
                          h("span", null, formatDateTime(entry.timestamp))
                        ),
                        h("p", { className: "timeline-copy" }, entry.message)
                      )
                    )
                  )
                : h("p", { className: "empty-copy" }, "아직 댓글이 없습니다.")
            ),
            h(
              "div",
              null,
              h("h4", { className: "subsection-title" }, "변경 히스토리"),
              task.activity?.length
                ? h(
                    "div",
                    { className: "timeline-list" },
                    task.activity.map((entry) =>
                      h(
                        "article",
                        { key: entry.id, className: "timeline-card" },
                        h(
                          "div",
                          { className: "timeline-top" },
                          h("strong", null, entry.user),
                          h("span", null, formatDateTime(entry.timestamp))
                        ),
                        h("p", { className: "timeline-copy" }, entry.message)
                      )
                    )
                  )
                : h("p", { className: "empty-copy" }, "변경 이력이 없습니다.")
            )
          )
        )
      : h("p", { className: "empty-copy" }, "업무를 선택하면 댓글과 이력이 표시됩니다.")
  );
}
