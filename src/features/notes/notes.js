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

export default function ShowNotesPage() {
  const main = document.getElementById("main-content");
  main.replaceChildren(NotesPageHeader());
}
