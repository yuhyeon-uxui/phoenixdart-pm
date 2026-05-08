import React, { createElement as h } from "react";
import Sidebar from "./Sidebar.js";
import HeaderBar from "./HeaderBar.js";

export default function AppLayout({
  projects,
  selectedProject,
  search,
  statusFilter,
  currentUser,
  onSearchChange,
  onStatusFilterChange,
  onCurrentUserChange,
  onSelectProject,
  onStartNewProject,
  children,
}) {
  return h(
    "div",
    { className: "app-shell" },
    h(Sidebar, {
      projects,
      selectedProjectId: selectedProject?.id,
      search,
      statusFilter,
      onSearchChange,
      onStatusFilterChange,
      onSelectProject,
      onStartNewProject,
    }),
    h(
      "main",
      { className: "workspace" },
      h(HeaderBar, {
        selectedProject,
        currentUser,
        onCurrentUserChange,
      }),
      children
    )
  );
}
