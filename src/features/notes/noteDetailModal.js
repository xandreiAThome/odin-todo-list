import NoteService from "../../service/notes.service.js";
import ProjectService from "../../service/project.service.js";

export function NoteDetailModal(note, onClose) {
  const modalOverlay = document.createElement("div");
  modalOverlay.className = "modal-overlay";

  const modal = document.createElement("div");
  modal.className = "modal";

  const header = document.createElement("div");
  header.className = "modal-header";

  const title = document.createElement("h2");
  title.textContent = "Note";

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
  actionsContainer.appendChild(closeBtn);

  header.appendChild(title);
  header.appendChild(actionsContainer);

  const content = document.createElement("div");
  content.className = "modal-content note-detail-content";

  // Read-only view
  const viewSection = document.createElement("div");
  viewSection.className = "note-view-section active";

  const titleDisplay = document.createElement("h3");
  titleDisplay.className = "note-display-title";
  titleDisplay.textContent = note.title;

  const contentDisplay = document.createElement("p");
  contentDisplay.className = "note-display-content";
  contentDisplay.textContent = note.content || "No content";

  const projectService = ProjectService();
  const projects = projectService.getProjects();
  const projectName =
    projects.find((p) => p.id === note.projectId)?.name || "General";

  const metadataContainer = document.createElement("div");
  metadataContainer.className = "note-metadata";

  const projectBadge = document.createElement("span");
  projectBadge.className = "note-badge project-badge";
  projectBadge.textContent = projectName;

  metadataContainer.appendChild(projectBadge);

  viewSection.appendChild(metadataContainer);
  viewSection.appendChild(titleDisplay);
  viewSection.appendChild(contentDisplay);

  content.appendChild(viewSection);

  modal.appendChild(header);
  modal.appendChild(content);
  modalOverlay.appendChild(modal);

  const noteService = NoteService();

  const closeModalWithAnimation = () => {
    modal.classList.add("closing");
    modalOverlay.classList.add("closing");
    setTimeout(() => {
      modalOverlay.remove();
      if (onClose) {
        onClose();
      }
    }, 300);
  };

  editBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    switchToEditMode();
  });

  deleteBtn.addEventListener("click", () => {
    const confirm = window.confirm(
      `Are you sure you want to delete "${note.title}"?`
    );
    if (confirm) {
      noteService.deleteNote(note.id);
      closeModalWithAnimation();
    }
  });

  closeBtn.addEventListener("click", closeModalWithAnimation);

  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      closeModalWithAnimation();
    }
  });

  const switchToEditMode = () => {
    viewSection.classList.remove("active");
    const form = document.createElement("form");
    form.className = "modal-form note-detail-form active";

    const titleLabel = document.createElement("label");
    titleLabel.textContent = "Note Title";
    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.placeholder = "Enter note title";
    titleInput.value = note.title;
    titleInput.required = true;

    const contentLabel = document.createElement("label");
    contentLabel.textContent = "Content";
    const contentTextarea = document.createElement("textarea");
    contentTextarea.placeholder = "Enter note content";
    contentTextarea.className = "modal-textarea";
    contentTextarea.value = note.content || "";
    contentTextarea.required = true;

    const projectLabel = document.createElement("label");
    projectLabel.textContent = "Project";
    const projectSelect = document.createElement("select");
    projectSelect.required = true;
    projects.forEach((project) => {
      const option = document.createElement("option");
      option.value = project.id;
      option.textContent = project.name;
      if (project.id === note.projectId) {
        option.selected = true;
      }
      projectSelect.appendChild(option);
    });

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
    form.appendChild(contentLabel);
    form.appendChild(contentTextarea);
    form.appendChild(projectLabel);
    form.appendChild(projectSelect);
    form.appendChild(buttonContainer);

    // Save changes
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      noteService.updateNote(note.id, {
        title: titleInput.value,
        content: contentTextarea.value,
        projectId: projectSelect.value,
      });
      closeModalWithAnimation();
    });

    cancelBtn.addEventListener("click", () => {
      form.classList.remove("active");
      viewSection.classList.add("active");
      editBtn.style.display = "block";
    });

    content.appendChild(form);
    editBtn.style.display = "none";
  };

  return modalOverlay;
}
