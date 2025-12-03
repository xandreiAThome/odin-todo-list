import ProjectService from "../../service/project.service.js";

export function CreateProjectForm(onProjectCreate) {
  const form = document.createElement("form");
  form.className = "modal-form";

  const nameLabel = document.createElement("label");
  nameLabel.textContent = "Project Name";
  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.placeholder = "Enter project name";
  nameInput.required = true;

  const buttonContainer = document.createElement("div");
  buttonContainer.className = "modal-buttons";

  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.className = "modal-submit";
  submitBtn.textContent = "Add Project";

  const cancelBtn = document.createElement("button");
  cancelBtn.type = "button";
  cancelBtn.className = "modal-cancel";
  cancelBtn.textContent = "Cancel";

  buttonContainer.appendChild(submitBtn);
  buttonContainer.appendChild(cancelBtn);

  form.appendChild(nameLabel);
  form.appendChild(nameInput);
  form.appendChild(buttonContainer);

  const projectService = ProjectService();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    projectService.createProject({
      name: nameInput.value,
    });
    if (onProjectCreate) {
      onProjectCreate();
    }
  });

  return {
    form,
    submitBtn,
    cancelBtn,
  };
}
