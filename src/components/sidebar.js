import IoTodayOutline from "../../public/IoTodayOutline.svg";
import BsCalendar2Week from "../../public/BsCalendar2Week.svg";
import BiNote from "../../public/BiNote.svg";

export default function SideBar() {
  const sidebar = document.createElement("nav");
  sidebar.id = "sidebar";

  const todayNav = document.createElement("span");
  todayNav.className = "nav-item active-nav-item";
  todayNav.id = "today-nav";
  const todayText = document.createElement("p");
  todayText.textContent = "Today";
  const todayImg = document.createElement("img");
  todayImg.src = IoTodayOutline;
  todayNav.appendChild(todayImg);
  todayNav.appendChild(todayText);

  const weekNav = document.createElement("span");
  weekNav.className = "nav-item";
  weekNav.id = "week-nav";
  const weekText = document.createElement("p");
  weekText.textContent = "Week";
  const weekImg = document.createElement("img");
  weekImg.src = BsCalendar2Week;
  weekNav.appendChild(weekImg);
  weekNav.appendChild(weekText);

  const notesNav = document.createElement("span");
  notesNav.className = "nav-item";
  notesNav.id = "notes-nav";
  const notesText = document.createElement("p");
  notesText.textContent = "Notes";
  const notesImg = document.createElement("img");
  notesImg.src = BiNote;
  notesNav.appendChild(notesImg);
  notesNav.appendChild(notesText);

  const line = document.createElement("div");
  line.className = "line";

  sidebar.appendChild(todayNav);
  sidebar.appendChild(weekNav);
  sidebar.appendChild(notesNav);
  sidebar.appendChild(line);
  return sidebar;
}
