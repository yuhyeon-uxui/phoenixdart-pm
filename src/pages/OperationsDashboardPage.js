import React, { createElement as h } from "react";
import KpiCards from "../components/KpiCards.js";
import ProjectPortfolioCard from "../components/ProjectPortfolioCard.js";
import ProjectSummaryCard from "../components/ProjectSummaryCard.js";

export default function OperationsDashboardPage({
  metrics,
  projects,
  selectedProject,
  onSelectProject,
  onEditCurrentProject,
  onStartNewTask,
}) {
  return h(
    React.Fragment,
    null,
    h(KpiCards, { metrics }),
    h(
      "section",
      { className: "content-grid content-grid-top" },
      h(ProjectPortfolioCard, {
        projects,
        onSelectProject,
      }),
      h(ProjectSummaryCard, {
        project: selectedProject,
        onEditCurrentProject,
        onStartNewTask,
        showDetailLink: true,
      })
    )
  );
}
