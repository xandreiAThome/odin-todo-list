import {
  format,
  addDays,
  startOfWeek,
  isToday,
  isWithinInterval,
} from "date-fns";
import LuAlarmClock from "../../../public/LuAlarmClock.svg";
import { CreateModal } from "../modals/createModal.js";
import { CreateTaskDetailModal } from "./taskDetailModal.js";
import TaskServce from "../../service/task.service.js";

export function TaskPageHeader(pageType = "today") {
  const headerContainer = document.createElement("div");
  headerContainer.className = "task-header";

  const headerText = document.createElement("h4");

  if (pageType === "week") {
    const startDate = startOfWeek(new Date());
    const endDate = addDays(startDate, 6);
    headerText.textContent = `This Week (${format(
      startDate,
      "MMM d"
    )} - ${format(endDate, "MMM d, yyyy")})`;
  } else if (pageType === "all") {
    headerText.textContent = "All Tasks";
  } else {
    headerText.textContent = `Today (${format(new Date(), "MMM d, yyyy")})`;
  }

  const actionButton = document.createElement("button");
  actionButton.id = "action-btn";
  actionButton.textContent = "+ Add";

  headerContainer.appendChild(headerText);
  headerContainer.appendChild(actionButton);
  return headerContainer;
}

export function TaskItem(
  priority,
  titleText,
  deadline,
  id,
  pageType = "today",
  done = false,
  taskObject = null,
  onTaskUpdate = null
) {
  const task = document.createElement("div");
  task.classList = "task-item";
  task.id = id;
  task.style.cursor = "pointer";
  const taskService = TaskServce();

  if (done) {
    task.classList.add("task-done");
  }

  if (priority === "high") {
    task.classList.add("high-prio");
  } else if (priority === "medium") {
    task.classList.add("medium-prio");
  } else if (priority === "low") {
    task.classList.add("low-prio");
  }

  const title = document.createElement("h4");
  title.textContent = titleText;

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = done;

  const titleContainer = document.createElement("div");
  titleContainer.className = "task-title-container";
  titleContainer.appendChild(checkbox);
  titleContainer.appendChild(title);

  const deadlineElement = document.createElement("span");
  const dlText = document.createElement("p");
  const dlIcon = document.createElement("img");
  dlIcon.src = LuAlarmClock;
  const date = new Date(deadline);
  let dateFormat = "HH:mm";
  if (pageType === "week") {
    dateFormat = "MMM d, HH:mm";
  } else if (pageType === "all") {
    dateFormat = "PPp";
  }
  dlText.textContent = format(date, dateFormat);
  deadlineElement.appendChild(dlText);
  deadlineElement.appendChild(dlIcon);

  task.appendChild(titleContainer);
  task.appendChild(deadlineElement);

  // Add checkbox change handler
  checkbox.addEventListener("change", (e) => {
    e.stopPropagation();
    const isDone = e.target.checked;
    const toggle = { done: isDone };
    taskService.updateTask(id, toggle);
    if (isDone) {
      task.classList.add("task-done");
    } else {
      task.classList.remove("task-done");
    }
    // Notify parent to update
    if (onTaskUpdate) {
      onTaskUpdate();
    }
  });

  // Add click handler to show task details
  if (taskObject) {
    task.addEventListener("click", (e) => {
      // Don't open modal if checkbox was clicked
      if (e.target.type === "checkbox") {
        return;
      }
      e.stopPropagation();
      const detailModal = CreateTaskDetailModal(
        taskObject,
        () => {
          detailModal.remove();
          ShowTaskPage(pageType);
        },
        null,
        (taskId) => {
          taskService.deleteTask(taskId);
          detailModal.remove();
          ShowTaskPage(pageType);
        },
        (taskId, isDone) => {
          taskService.updateTask(taskId, { done: isDone });
          ShowTaskPage(pageType);
        }
      );
      document.body.appendChild(detailModal);
    });
  }

  return task;
}

export default function ShowTaskPage(pageType = "today", projectId = null) {
  const main = document.getElementById("main-content");

  // If being called from project view, append to existing container
  const container = projectId
    ? document.getElementById("project-content-container")
    : main;

  const header = !projectId ? TaskPageHeader(pageType) : null;
  const taskService = TaskServce();

  const renderTask = () => {
    // Close any open modals
    const modals = document.querySelectorAll(".modal-overlay");
    modals.forEach((modal) => modal.remove());
    // Refresh the page
    ShowTaskPage(pageType, projectId);
  };

  if (header) {
    const actionBtn = header.querySelector("#action-btn");
    actionBtn.addEventListener("click", () => {
      const modal = CreateModal(() => {
        ShowTaskPage(pageType, projectId);
      });
      document.body.appendChild(modal);
    });
  }

  let tasks = taskService.getTasks();

  // Filter by project if specified
  if (projectId) {
    tasks = tasks.filter((t) => t.project === projectId);
  } else {
    // Filter tasks based on page type
    if (pageType === "today") {
      tasks = tasks.filter((t) => t.deadline && isToday(new Date(t.deadline)));
    } else if (pageType === "week") {
      const startDate = startOfWeek(new Date());
      const endDate = addDays(startDate, 6);
      tasks = tasks.filter(
        (t) =>
          t.deadline &&
          isWithinInterval(new Date(t.deadline), {
            start: startDate,
            end: endDate,
          })
      );
    }
  }
  // "all" page type shows all tasks without filtering

  const content = [
    ...(header ? [header] : []),
    ...tasks.map((t) =>
      TaskItem(
        t.priority,
        t.title,
        t.deadline,
        t.id,
        pageType,
        t.done,
        t,
        renderTask
      )
    ),
  ];

  if (projectId) {
    container.replaceChildren(...content);
  } else {
    main.replaceChildren(...content);
  }
}

function renderTask() {
  // Close any open modals
  const modals = document.querySelectorAll(".modal-overlay");
  modals.forEach((modal) => modal.remove());
  // Refresh the page
  ShowTaskPage(pageType);
}
