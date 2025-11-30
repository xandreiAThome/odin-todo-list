import { format } from "date-fns";
import LuAlarmClock from "../../../public/LuAlarmClock.svg";

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

  // Metadata section with priority, project, deadline, status
  const metadataSection = document.createElement("div");
  metadataSection.className = "detail-metadata";

  // Priority badge
  const priorityBadge = document.createElement("div");
  priorityBadge.className = `detail-badge priority-${task.priority}`;
  priorityBadge.textContent =
    task.priority.charAt(0).toUpperCase() + task.priority.slice(1);

  // Project badge
  const projectBadge = document.createElement("div");
  projectBadge.className = "detail-badge project-badge";
  projectBadge.textContent =
    task.project.charAt(0).toUpperCase() + task.project.slice(1);

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

  content.appendChild(metadataSection);
  content.appendChild(deadlineSection);
  content.appendChild(contentSection);

  modal.appendChild(header);
  modal.appendChild(content);
  modalOverlay.appendChild(modal);

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

  editBtn.addEventListener("click", () => {
    closeModalWithAnimation();
    if (onEdit) {
      onEdit(task);
    }
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
