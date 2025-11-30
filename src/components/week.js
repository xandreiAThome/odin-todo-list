import { format, addDays, startOfWeek } from "date-fns";

function WeekPageHeader() {
  const headerContainer = document.createElement("div");
  headerContainer.className = "task-header";

  const startDate = startOfWeek(new Date());
  const endDate = addDays(startDate, 6);

  const headerText = document.createElement("h4");
  headerText.textContent = `This Week (${format(startDate, "MMM d")} - ${format(
    endDate,
    "MMM d, yyyy"
  )})`;

  const actionButton = document.createElement("button");
  actionButton.id = "action-btn";
  actionButton.textContent = "+ Add";

  headerContainer.appendChild(headerText);
  headerContainer.appendChild(actionButton);
  return headerContainer;
}

export default function ShowWeekPage() {
  const main = document.getElementById("main-content");
  main.replaceChildren(WeekPageHeader());
}
