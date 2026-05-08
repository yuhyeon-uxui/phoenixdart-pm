import React, { createElement as h } from "react";

const STATUS_CLASS = {
  예정: "status-planned",
  "진행 중": "status-active",
  "검토 중": "status-review",
  완료: "status-done",
  보류: "status-hold",
};

export default function StatusBadge({ status }) {
  return h("span", { className: `status-badge ${STATUS_CLASS[status] || ""}` }, status);
}
