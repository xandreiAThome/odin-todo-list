import { format } from "date-fns";
import BsThreeDotsVertical from "../../public/BsThreeDotsVertical.svg";
import LuAlarmClock from "../../public/LuAlarmClock.svg";

export function TaskPageHeader() {
  const headerContainer = document.createElement("div");
  headerContainer.className = "task-header";

  const headerText = document.createElement("h4");
  headerText.textContent = `Today (${format(new Date(), "MMM d, yyyy")})`;

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

export default function ShowTaskPage() {
  const main = document.getElementById("main-content");
  main.replaceChildren(
    TaskPageHeader(),
    TaskItem("high", "Sample Task", new Date().toISOString(), "task-1")
  );
}
