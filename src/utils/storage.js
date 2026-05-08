const STORAGE_KEYS = {
  projects: "phoenixdart-pm-projects",
  selectedProjectId: "phoenixdart-pm-selected-project",
  selectedTaskId: "phoenixdart-pm-selected-task",
  currentUser: "phoenixdart-pm-current-user",
};

function read(key) {
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    return null;
  }
}

function write(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("localStorage write failed", error);
  }
}

export function loadProjects() {
  return read(STORAGE_KEYS.projects);
}

export function saveProjects(projects) {
  write(STORAGE_KEYS.projects, projects);
}

export function loadSelectedProjectId() {
  return read(STORAGE_KEYS.selectedProjectId) || "";
}

export function saveSelectedProjectId(projectId) {
  write(STORAGE_KEYS.selectedProjectId, projectId);
}

export function loadSelectedTaskId() {
  return read(STORAGE_KEYS.selectedTaskId) || "";
}

export function saveSelectedTaskId(taskId) {
  write(STORAGE_KEYS.selectedTaskId, taskId);
}

export function loadCurrentUser() {
  return read(STORAGE_KEYS.currentUser) || "운영 담당자";
}

export function saveCurrentUser(user) {
  write(STORAGE_KEYS.currentUser, user || "운영 담당자");
}
