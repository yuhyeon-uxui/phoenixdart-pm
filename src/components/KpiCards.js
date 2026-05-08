import React, { createElement as h } from "react";

export default function KpiCards({ metrics }) {
  const cards = [
    { label: "전체 프로젝트", value: `${metrics.projectCount}개`, tone: "blue" },
    { label: "활성 프로젝트", value: `${metrics.activeCount}개`, tone: "amber" },
    { label: "완료 업무", value: `${metrics.doneTasks}건`, tone: "green" },
    { label: "전체 완료율", value: `${metrics.completionRate}%`, tone: "rose" },
    { label: "이번 주 마감", value: `${metrics.dueThisWeek}건`, tone: "slate" },
    { label: "지연 업무", value: `${metrics.overdueCount}건`, tone: "red" },
  ];

  return h(
    "section",
    { className: "kpi-grid" },
    cards.map((card) =>
      h(
        "article",
        { key: card.label, className: `kpi-card tone-${card.tone}` },
        h("span", { className: "kpi-label" }, card.label),
        h("strong", { className: "kpi-value" }, card.value)
      )
    )
  );
}
