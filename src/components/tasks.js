import {
  format,
  addDays,
  startOfWeek,
  isToday,
  isWithinInterval,
} from "date-fns";
import BsThreeDotsVertical from "../../public/BsThreeDotsVertical.svg";
import LuAlarmClock from "../../public/LuAlarmClock.svg";
import { CreateTaskModal } from "./modal";
import TaskServce from "../service/task.service.js";

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

export function TaskItem(priority, titleText, deadline, id) {
  const task = document.createElement("div");
  task.classList = "task-item";
  task.id = id;
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

  const titleContainer = document.createElement("div");
  titleContainer.className = "task-title-container";
  titleContainer.appendChild(checkbox);
  titleContainer.appendChild(title);

  const utilBtn = document.createElement("button");
  const icon = document.createElement("img");
  icon.src = BsThreeDotsVertical;
  utilBtn.appendChild(icon);

  const deadlineElement = document.createElement("span");
  const dlText = document.createElement("p");
  const dlIcon = document.createElement("img");
  dlIcon.src = LuAlarmClock;
  const date = new Date(deadline);
  dlText.textContent = format(date, "HH:mm");
  deadlineElement.appendChild(dlText);
  deadlineElement.appendChild(dlIcon);

  const rightContainer = document.createElement("div");
  rightContainer.appendChild(deadlineElement);
  rightContainer.appendChild(utilBtn);
  rightContainer.className = "task-right-container";

  task.appendChild(titleContainer);
  task.appendChild(rightContainer);

  return task;
}

export default function ShowTaskPage(pageType = "today") {
  const main = document.getElementById("main-content");
  const header = TaskPageHeader(pageType);
  const taskService = TaskServce();

  const actionBtn = header.querySelector("#action-btn");
  actionBtn.addEventListener("click", () => {
    const modal = CreateTaskModal(
      (taskData) => {
        taskService.addTask(taskData);
        modal.remove();
        ShowTaskPage(pageType);
      },
      () => {
        modal.remove();
      }
    );
    document.body.appendChild(modal);
  });

  let tasks = taskService.getTasks();

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

  main.replaceChildren(
    header,
    ...tasks.map((t) => TaskItem(t.priority, t.title, t.deadline, t.id))
  );
}
