import { format } from "date-fns";
import LuAlarmClock from "../../../public/LuAlarmClock.svg";
import ProjectService from "../../service/project.service.js";
import TaskService from "../../service/task.service.js";
import Flatpickr from "flatpickr";

export function CreateTaskDetailModal(
  task,
  onClose,
  onEdit = null,
  onDelete = null,
  onToggleDone = null
) {
  const modalOverlay = document.createElement("div");
  modalOverlay.className = "modal-overlay";

  const modal = document.createElement("div");
  modal.className = "modal";

  const header = document.createElement("div");
  header.className = "modal-header";

  const titleContainer = document.createElement("div");
  titleContainer.className = "modal-title-container";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.done;

  const title = document.createElement("h2");
  title.textContent = task.title;

  titleContainer.appendChild(checkbox);
  titleContainer.appendChild(title);

  const actionsContainer = document.createElement("div");
  actionsContainer.className = "modal-actions";

  const editBtn = document.createElement("button");
  editBtn.className = "modal-action-btn edit-btn";
  editBtn.textContent = "Edit";

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "modal-action-btn delete-btn";
  deleteBtn.textContent = "Delete";

  const closeBtn = document.createElement("button");
  closeBtn.className = "modal-close";
  closeBtn.textContent = "×";

  actionsContainer.appendChild(editBtn);
  actionsContainer.appendChild(deleteBtn);

  header.appendChild(titleContainer);
  header.appendChild(actionsContainer);
  header.appendChild(closeBtn);

  const content = document.createElement("div");
  content.className = "modal-content";

  // Read-only view section
  const viewSection = document.createElement("div");
  viewSection.className = "task-view-section active";

  // Metadata section with priority, project, deadline, status
  const metadataSection = document.createElement("div");
  metadataSection.className = "detail-metadata";

  // Priority badge
  const priorityBadge = document.createElement("div");
  priorityBadge.className = `detail-badge priority-${task.priority}`;
  priorityBadge.textContent =
    task.priority.charAt(0).toUpperCase() + task.priority.slice(1);

  // Project badge
  const projectService = ProjectService();
  const projects = projectService.getProjects();
  const projectName =
    projects.find((p) => p.id === task.project)?.name || task.project;
  const projectBadge = document.createElement("div");
  projectBadge.className = "detail-badge project-badge";
  projectBadge.textContent = projectName;

  // Status badge
  const statusBadge = document.createElement("div");
  statusBadge.className = `detail-badge status-${
    task.done ? "completed" : "pending"
  }`;
  statusBadge.textContent = task.done ? "✓ Completed" : "◯ Pending";

  metadataSection.appendChild(priorityBadge);
  metadataSection.appendChild(projectBadge);
  metadataSection.appendChild(statusBadge);

  // Deadline section
  const deadlineSection = document.createElement("div");
  deadlineSection.className = "detail-deadline-section";
  const deadlineValue = document.createElement("span");
  deadlineValue.className = "detail-deadline-value";
  const date = new Date(task.deadline);
  deadlineValue.textContent = format(date, "PPp");
  deadlineSection.appendChild(deadlineValue);
  const clockIcon = document.createElement("img");
  clockIcon.src = LuAlarmClock;
  deadlineSection.appendChild(clockIcon);

  // Content section
  const contentSection = document.createElement("div");
  contentSection.className = "detail-section";
  const contentLabel = document.createElement("label");
  contentLabel.textContent = "Details";
  const contentValue = document.createElement("p");
  contentValue.textContent = task.content || "No content";
  contentValue.className = "detail-content";
  contentSection.appendChild(contentLabel);
  contentSection.appendChild(contentValue);

  viewSection.appendChild(metadataSection);
  viewSection.appendChild(deadlineSection);
  viewSection.appendChild(contentSection);

  content.appendChild(viewSection);

  modal.appendChild(header);
  modal.appendChild(content);
  modalOverlay.appendChild(modal);

  const taskService = TaskService();

  // Helper function to close modal with animation
  const closeModalWithAnimation = () => {
    modal.classList.add("closing");
    modalOverlay.classList.add("closing");
    setTimeout(() => {
      onClose();
    }, 300);
  };

  closeBtn.addEventListener("click", closeModalWithAnimation);

  checkbox.addEventListener("change", (e) => {
    const isDone = e.target.checked;

    // Update status badge
    statusBadge.className = `detail-badge status-${
      isDone ? "completed" : "pending"
    }`;
    statusBadge.textContent = isDone ? "✓ Completed" : "◯ Pending";

    if (onToggleDone) {
      onToggleDone(task.id, isDone);
    }
  });

  // Switch to edit mode
  const switchToEditMode = () => {
    // Hide view section
    viewSection.classList.remove("active");

    // Create edit form
    const form = document.createElement("form");
    form.className = "modal-form task-edit-form active";

    // Title input
    const titleLabel = document.createElement("label");
    titleLabel.textContent = "Task Title";
    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.placeholder = "Enter task title";
    titleInput.value = task.title;
    titleInput.required = true;

    // Priority select
    const priorityLabel = document.createElement("label");
    priorityLabel.textContent = "Priority";
    const prioritySelect = document.createElement("select");
    prioritySelect.required = true;
    const priorities = ["low", "medium", "high"];
    priorities.forEach((p) => {
      const option = document.createElement("option");
      option.value = p;
      option.textContent = p.charAt(0).toUpperCase() + p.slice(1);
      if (p === task.priority) {
        option.selected = true;
      }
      prioritySelect.appendChild(option);
    });

    // Project select
    const projectLabel = document.createElement("label");
    projectLabel.textContent = "Project";
    const projectSelect = document.createElement("select");
    projectSelect.required = true;
    projects.forEach((project) => {
      const option = document.createElement("option");
      option.value = project.id;
      option.textContent = project.name;
      if (project.id === task.project) {
        option.selected = true;
      }
      projectSelect.appendChild(option);
    });

    // Deadline input
    const deadlineLabel = document.createElement("label");
    deadlineLabel.textContent = "Deadline";
    const deadlineInput = document.createElement("input");
    deadlineInput.type = "text";
    deadlineInput.className = "deadline-input";
    deadlineInput.value = format(new Date(task.deadline), "yyyy-MM-dd HH:mm");
    deadlineInput.required = true;

    // Content textarea
    const contentLabel = document.createElement("label");
    contentLabel.textContent = "Details";
    const contentTextarea = document.createElement("textarea");
    contentTextarea.placeholder = "Enter task details";
    contentTextarea.className = "modal-textarea";
    contentTextarea.value = task.content || "";
    contentTextarea.required = true;

    // Buttons
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "modal-buttons";

    const saveBtn = document.createElement("button");
    saveBtn.type = "submit";
    saveBtn.className = "modal-submit";
    saveBtn.textContent = "Save Changes";

    const cancelBtn = document.createElement("button");
    cancelBtn.type = "button";
    cancelBtn.className = "modal-cancel";
    cancelBtn.textContent = "Cancel";

    buttonContainer.appendChild(saveBtn);
    buttonContainer.appendChild(cancelBtn);

    form.appendChild(titleLabel);
    form.appendChild(titleInput);
    form.appendChild(priorityLabel);
    form.appendChild(prioritySelect);
    form.appendChild(projectLabel);
    form.appendChild(projectSelect);
    form.appendChild(deadlineLabel);
    form.appendChild(deadlineInput);
    form.appendChild(contentLabel);
    form.appendChild(contentTextarea);
    form.appendChild(buttonContainer);

    // Setup Flatpickr for deadline
    Flatpickr(deadlineInput, {
      enableTime: true,
      dateFormat: "Y-m-d H:i",
      defaultDate: new Date(task.deadline),
    });

    // Handle form submission
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const updatedDeadline = new Date(deadlineInput.value).toISOString();
      taskService.updateTask(task.id, {
        title: titleInput.value,
        priority: prioritySelect.value,
        project: projectSelect.value,
        deadline: updatedDeadline,
        content: contentTextarea.value,
      });
      closeModalWithAnimation();
    });

    // Handle cancel
    cancelBtn.addEventListener("click", () => {
      form.classList.remove("active");
      viewSection.classList.add("active");
      editBtn.style.display = "block";
    });

    content.appendChild(form);
    editBtn.style.display = "none";
  };

  editBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    switchToEditMode();
  });

  deleteBtn.addEventListener("click", () => {
    const confirmDelete = confirm(
      `Are you sure you want to delete "${task.title}"? This action cannot be undone.`
    );
    if (confirmDelete) {
      closeModalWithAnimation();
      if (onDelete) {
        onDelete(task.id);
      }
    }
  });

  // Close modal when clicking outside
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      closeModalWithAnimation();
    }
  });

  return modalOverlay;
}
