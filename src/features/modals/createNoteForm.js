import NoteService from "../../service/notes.service.js";
import ProjectService from "../../service/project.service.js";

export function CreateNoteForm(onNoteCreate) {
  const form = document.createElement("form");
  form.className = "modal-form";

  const titleLabel = document.createElement("label");
  titleLabel.textContent = "Note Title";
  const titleInput = document.createElement("input");
  titleInput.type = "text";
  titleInput.placeholder = "Enter note title";
  titleInput.required = true;

  const contentLabel = document.createElement("label");
  contentLabel.textContent = "Content";
  const contentTextarea = document.createElement("textarea");
  contentTextarea.placeholder = "Enter note content";
  contentTextarea.className = "modal-textarea";
  contentTextarea.required = true;

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

  const buttonContainer = document.createElement("div");
  buttonContainer.className = "modal-buttons";

  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.className = "modal-submit";
  submitBtn.textContent = "Add Note";

  const cancelBtn = document.createElement("button");
  cancelBtn.type = "button";
  cancelBtn.className = "modal-cancel";
  cancelBtn.textContent = "Cancel";

  buttonContainer.appendChild(submitBtn);
  buttonContainer.appendChild(cancelBtn);

  form.appendChild(titleLabel);
  form.appendChild(titleInput);
  form.appendChild(contentLabel);
  form.appendChild(contentTextarea);
  form.appendChild(projectLabel);
  form.appendChild(projectSelect);
  form.appendChild(buttonContainer);

  const noteService = NoteService();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    noteService.createNote({
      title: titleInput.value,
      content: contentTextarea.value,
      projectId: projectSelect.value,
    });
    if (onNoteCreate) {
      onNoteCreate();
    }
  });

  return {
    form,
    submitBtn,
    cancelBtn,
  };
}
