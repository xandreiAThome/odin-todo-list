import "./styles.css";
import "./features/header/header.css";
import "./features/sidebar/sidebar.css";
import "./features/tasks/tasks.css";
import "./features/modals/modal.css";
import "./features/modals/createModal.css";
import "./features/tasks/taskDetailModal.css";
import "./features/notes/notes.css";
import "./features/projects/projects.css";
import "flatpickr/dist/flatpickr.min.css";
import Page from "./page";
import ShowTaskPage from "./features/tasks/tasks";

Page();
ShowTaskPage("all");
