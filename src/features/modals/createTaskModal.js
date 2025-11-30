import flatpickr from "flatpickr";
import ProjectService from "../../service/project.service.js";

export function CreateTaskModal(onSubmit, onCancel) {
  const modalOverlay = document.createElement("div");
  modalOverlay.className = "modal-overlay";

  const modal = document.createElement("div");
  modal.className = "modal";

  const header = document.createElement("div");
  header.className = "modal-header";

  const title = document.createElement("h2");
  title.textContent = "Add New Task";

  const closeBtn = document.createElement("button");
  closeBtn.className = "modal-close";
  closeBtn.textContent = "×";

  header.appendChild(title);
  header.appendChild(closeBtn);

  const form = document.createElement("form");
  form.className = "modal-form";

  const titleLabel = document.createElement("label");
  titleLabel.textContent = "Task Title";
  const titleInput = document.createElement("input");
  titleInput.type = "text";
  titleInput.placeholder = "Enter task title";
  titleInput.required = true;

  const priorityLabel = document.createElement("label");
  priorityLabel.textContent = "Priority";
  const prioritySelect = document.createElement("select");
  prioritySelect.required = true;
  const priorities = ["low", "medium", "high"];
  priorities.forEach((priority) => {
    const option = document.createElement("option");
    option.value = priority;
    option.textContent = priority.charAt(0).toUpperCase() + priority.slice(1);
    prioritySelect.appendChild(option);
  });

  const projectLabel = document.createElement("label");
  projectLabel.textContent = "Project";
  const projectSelect = document.createElement("select");
  projectSelect.required = true;
  const projectService = ProjectService();
  const projects = projectService.getProjects();
  projects.forEach((project) => {
    const option = document.createElement("option");
    option.value = project.id;
    option.textContent = project.name;
    projectSelect.appendChild(option);
  });

  const priorityProjectContainer = document.createElement("div");
  priorityProjectContainer.className = "priority-project-container";

  const priorityGroup = document.createElement("div");
  priorityGroup.className = "form-group";
  priorityGroup.appendChild(priorityLabel);
  priorityGroup.appendChild(prioritySelect);

  const projectGroup = document.createElement("div");
  projectGroup.className = "form-group";
  projectGroup.appendChild(projectLabel);
  projectGroup.appendChild(projectSelect);

  priorityProjectContainer.appendChild(priorityGroup);
  priorityProjectContainer.appendChild(projectGroup);

  const deadlineLabel = document.createElement("label");
  deadlineLabel.textContent = "Due Date";

  const deadlineContainer = document.createElement("div");
  deadlineContainer.className = "deadline-container";

  const dateInput = document.createElement("input");
  dateInput.type = "date";
  dateInput.required = true;
  // Set default date to today
  const today = new Date().toISOString().split("T")[0];
  dateInput.value = today;

  const timeInput = document.createElement("input");
  timeInput.type = "text";
  timeInput.className = "time-input";
  timeInput.placeholder = "HH:MM";
  timeInput.required = true;

  deadlineContainer.appendChild(dateInput);
  deadlineContainer.appendChild(timeInput);

  // Calculate default time (one hour from now)
  const now = new Date();
  const nextHour = new Date(now.getTime() + 60 * 60 * 1000);
  const defaultTime = `${String(nextHour.getHours()).padStart(2, "0")}:${String(
    nextHour.getMinutes()
  ).padStart(2, "0")}`;

  // Initialize Flatpickr for time input
  flatpickr(timeInput, {
    enableTime: true,
    noCalendar: true,
    dateFormat: "H:i",
    time_24hr: true,
    defaultDate: defaultTime,
    onOpen: () => {
      const hourInput = document.querySelector(".flatpickr-hour");
      const minuteInput = document.querySelector(".flatpickr-minute");
      if (hourInput) hourInput.required = true;
      if (minuteInput) minuteInput.required = true;
    },
  });
  timeInput.value = defaultTime;

  const contentLabel = document.createElement("label");
  contentLabel.textContent = "Content";
  const contentTextarea = document.createElement("textarea");
  contentTextarea.placeholder = "Enter task content";
  contentTextarea.className = "modal-textarea";
  contentTextarea.required = false;

  const buttonContainer = document.createElement("div");
  buttonContainer.className = "modal-buttons";

  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.className = "modal-submit";
  submitBtn.textContent = "Add Task";

  const cancelBtn = document.createElement("button");
  cancelBtn.type = "button";
  cancelBtn.className = "modal-cancel";
  cancelBtn.textContent = "Cancel";

  buttonContainer.appendChild(submitBtn);
  buttonContainer.appendChild(cancelBtn);

  form.appendChild(titleLabel);
  form.appendChild(titleInput);
  form.appendChild(priorityProjectContainer);
  form.appendChild(deadlineLabel);
  form.appendChild(deadlineContainer);
  form.appendChild(contentLabel);
  form.appendChild(contentTextarea);
  form.appendChild(buttonContainer);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const deadline =
      dateInput.value && timeInput.value
        ? `${dateInput.value}T${timeInput.value}`
        : null;
    onSubmit({
      title: titleInput.value,
      priority: prioritySelect.value,
      project: projectSelect.value,
      deadline: deadline,
      content: contentTextarea.value,
    });
  });

  modal.appendChild(header);
  modal.appendChild(form);

  modalOverlay.appendChild(modal);

  // Helper function to close modal with animation
  const closeModalWithAnimation = () => {
    modal.classList.add("closing");
    modalOverlay.classList.add("closing");
    setTimeout(() => {
      onCancel();
    }, 300);
  };

  closeBtn.addEventListener("click", closeModalWithAnimation);
  cancelBtn.addEventListener("click", closeModalWithAnimation);

  // Close modal when clicking outside
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      closeModalWithAnimation();
    }
  });

  return modalOverlay;
}
