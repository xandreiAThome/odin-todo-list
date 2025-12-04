import ProjectService from "../../service/project.service.js";
import ShowTaskPage from "../tasks/tasks";
import ShowNotesPage from "../notes/notes";
import { CreateModal } from "../modals/createModal.js";

export function ShowProjectContent(projectId) {
  const main = document.getElementById("main-content");
  main.innerHTML = "";

  // Get fresh projects data
  const projectService = ProjectService();
  const freshProjects = projectService.getProjects();
  const projectName =
    freshProjects.find((p) => p.id === projectId)?.name || "Project";

  // Create header with project name and filter options
  const header = document.createElement("div");
  header.className = "project-content-header";

  const title = document.createElement("h2");
  title.textContent = projectName;

  // Radio button filter for Tasks/Notes
  const filterContainer = document.createElement("div");
  filterContainer.className = "content-filter";

  const tasksLabel = document.createElement("label");
  tasksLabel.className = "filter-label";
  const tasksRadio = document.createElement("input");
  tasksRadio.type = "radio";
  tasksRadio.name = "content-type";
  tasksRadio.value = "tasks";
  tasksRadio.checked = true;
  tasksLabel.appendChild(tasksRadio);
  tasksLabel.appendChild(document.createTextNode(" Tasks"));

  const notesLabel = document.createElement("label");
  notesLabel.className = "filter-label";
  const notesRadio = document.createElement("input");
  notesRadio.type = "radio";
  notesRadio.name = "content-type";
  notesRadio.value = "notes";
  notesLabel.appendChild(notesRadio);
  notesLabel.appendChild(document.createTextNode(" Notes"));

  filterContainer.appendChild(tasksLabel);
  filterContainer.appendChild(notesLabel);

  // Add button
  const addBtn = document.createElement("button");
  addBtn.id = "action-btn";
  addBtn.textContent = "+ Add";
  addBtn.addEventListener("click", () => {
    const modal = CreateModal(() => {
      // Refresh the project content
      ShowProjectContent(projectId);
    });
    document.body.appendChild(modal);
  });

  header.appendChild(title);
  header.appendChild(filterContainer);
  header.appendChild(addBtn);
  main.appendChild(header);

  // Container for content
  const contentContainer = document.createElement("div");
  contentContainer.id = "project-content-container";
  main.appendChild(contentContainer);

  // Function to render content based on selection
  const renderContent = () => {
    contentContainer.innerHTML = "";
    const selectedType = document.querySelector(
      'input[name="content-type"]:checked'
    ).value;

    if (selectedType === "tasks") {
      ShowTaskPage("project", projectId);
    } else {
      ShowNotesPage("project", projectId);
    }
  };

  // Add event listeners to radio buttons
  tasksRadio.addEventListener("change", renderContent);
  notesRadio.addEventListener("change", renderContent);

  // Initial render
  renderContent();
}
