export function CreateModalTabs() {
  const tabsContainer = document.createElement("div");
  tabsContainer.className = "modal-tabs";

  const taskTab = document.createElement("button");
  taskTab.className = "modal-tab active";
  taskTab.textContent = "Task";
  taskTab.type = "button";
  taskTab.dataset.tab = "task";

  const noteTab = document.createElement("button");
  noteTab.className = "modal-tab";
  noteTab.textContent = "Note";
  noteTab.type = "button";
  noteTab.dataset.tab = "note";

  const projectTab = document.createElement("button");
  projectTab.className = "modal-tab";
  projectTab.textContent = "Project";
  projectTab.type = "button";
  projectTab.dataset.tab = "project";

  tabsContainer.appendChild(taskTab);
  tabsContainer.appendChild(noteTab);
  tabsContainer.appendChild(projectTab);

  return {
    tabsContainer,
    taskTab,
    noteTab,
    projectTab,
  };
}
