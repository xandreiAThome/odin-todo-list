import { CreateTaskForm } from "./createTaskForm.js";
import { CreateNoteForm } from "./createNoteForm.js";
import { CreateProjectForm } from "./createProjectForm.js";
import { CreateModalTabs } from "./createModalTabs.js";

export function CreateModal(onClose) {
  const modalOverlay = document.createElement("div");
  modalOverlay.className = "modal-overlay";

  const modal = document.createElement("div");
  modal.className = "modal";

  const header = document.createElement("div");
  header.className = "modal-header";

  const title = document.createElement("h2");
  title.textContent = "Add New";

  const closeBtn = document.createElement("button");
  closeBtn.className = "modal-close";
  closeBtn.textContent = "×";

  header.appendChild(title);
  header.appendChild(closeBtn);

  const { tabsContainer, taskTab, noteTab, projectTab } = CreateModalTabs();

  // Helper function to close modal with animation
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

  const taskFormData = CreateTaskForm(closeModalWithAnimation);
  const noteFormData = CreateNoteForm(closeModalWithAnimation);
  const projectFormData = CreateProjectForm(closeModalWithAnimation);

  const {
    form: taskForm,
    submitBtn: taskSubmitBtn,
    cancelBtn: taskCancelBtn,
  } = taskFormData;
  const {
    form: noteForm,
    submitBtn: noteSubmitBtn,
    cancelBtn: noteCancelBtn,
  } = noteFormData;
  const {
    form: projectForm,
    submitBtn: projectSubmitBtn,
    cancelBtn: projectCancelBtn,
  } = projectFormData;

  // Tab switching logic
  const switchTab = (tabName) => {
    taskForm.classList.remove("active");
    noteForm.classList.remove("active");
    projectForm.classList.remove("active");
    taskTab.classList.remove("active");
    noteTab.classList.remove("active");
    projectTab.classList.remove("active");

    if (tabName === "task") {
      taskForm.classList.add("active");
      taskTab.classList.add("active");
    } else if (tabName === "note") {
      noteForm.classList.add("active");
      noteTab.classList.add("active");
    } else if (tabName === "project") {
      projectForm.classList.add("active");
      projectTab.classList.add("active");
    }
  };

  // Initialize task form as active
  taskForm.classList.add("active");

  taskTab.addEventListener("click", () => switchTab("task"));
  noteTab.addEventListener("click", () => switchTab("note"));
  projectTab.addEventListener("click", () => switchTab("project"));

  taskCancelBtn.addEventListener("click", closeModalWithAnimation);
  noteCancelBtn.addEventListener("click", closeModalWithAnimation);
  projectCancelBtn.addEventListener("click", closeModalWithAnimation);

  modal.appendChild(header);
  modal.appendChild(tabsContainer);
  modal.appendChild(taskForm);
  modal.appendChild(noteForm);
  modal.appendChild(projectForm);

  modalOverlay.appendChild(modal);

  closeBtn.addEventListener("click", closeModalWithAnimation);

  // Close modal when clicking outside
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      closeModalWithAnimation();
    }
  });

  return modalOverlay;
}
