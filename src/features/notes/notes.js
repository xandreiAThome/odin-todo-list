import NoteService from "../../service/notes.service.js";
import ProjectService from "../../service/project.service.js";
import { CreateModal } from "../modals/createModal.js";
import { NoteDetailModal } from "./noteDetailModal.js";
import "./noteDetailModal.css";

function NotesPageHeader() {
  const headerContainer = document.createElement("div");
  headerContainer.className = "task-header";

  const headerText = document.createElement("h4");
  headerText.textContent = "Notes";

  const actionButton = document.createElement("button");
  actionButton.id = "action-btn";
  actionButton.textContent = "+ Add";

  headerContainer.appendChild(headerText);
  headerContainer.appendChild(actionButton);
  return headerContainer;
}

function NoteComponent(note, onNoteUpdated) {
  const noteCard = document.createElement("div");
  noteCard.className = "note-card";
  noteCard.style.cursor = "pointer";

  const noteHeader = document.createElement("div");
  noteHeader.className = "note-header";

  const noteTitle = document.createElement("h3");
  noteTitle.textContent = note.title;
  noteTitle.className = "note-title";

  noteHeader.appendChild(noteTitle);

  const noteContent = document.createElement("p");
  noteContent.className = "note-content";
  noteContent.textContent = note.content || "No content";

  const projectService = ProjectService();
  const projects = projectService.getProjects();
  const projectName =
    projects.find((p) => p.id === note.projectId)?.name || "General";

  const noteFooter = document.createElement("div");
  noteFooter.className = "note-footer";
  const noteProject = document.createElement("span");
  noteProject.className = "note-project";
  noteProject.textContent = projectName;
  noteFooter.appendChild(noteProject);

  noteCard.appendChild(noteHeader);
  noteCard.appendChild(noteContent);
  noteCard.appendChild(noteFooter);

  // Open detail modal on click
  noteCard.addEventListener("click", () => {
    const modal = NoteDetailModal(note, onNoteUpdated);
    document.body.appendChild(modal);
  });

  return noteCard;
}

export default function ShowNotesPage(pageType = "all", projectId = null) {
  const main = document.getElementById("main-content");

  // If being called from project view, append to existing container
  const targetContainer = projectId
    ? document.getElementById("project-content-container")
    : main;

  const header = !projectId ? NotesPageHeader() : null;
  const container = document.createElement("div");
  container.className = "notes-container";
  const noteService = NoteService();

  if (header) {
    const actionBtn = header.querySelector("#action-btn");
    actionBtn.addEventListener("click", () => {
      const modal = CreateModal(() => {
        ShowNotesPage(pageType, projectId);
      });
      document.body.appendChild(modal);
    });
  }

  let notes = noteService.getNotes();

  // Filter by project if specified
  if (projectId) {
    notes = notes.filter((n) => n.projectId === projectId);
  }

  container.replaceChildren(
    ...notes.map((note) =>
      NoteComponent(note, () => {
        ShowNotesPage(pageType, projectId);
      })
    )
  );

  if (projectId) {
    targetContainer.replaceChildren(container);
  } else {
    main.replaceChildren(header, container);
  }
}
