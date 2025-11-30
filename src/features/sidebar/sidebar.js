import IoTodayOutline from "../../../public/IoTodayOutline.svg";
import BsCalendar2Week from "../../../public/BsCalendar2Week.svg";
import BiNote from "../../../public/BiNote.svg";
import ShowTaskPage from "../tasks/tasks";
import ShowNotesPage from "../notes/notes";

export default function SideBar() {
  const sidebar = document.createElement("nav");
  sidebar.id = "sidebar";

  const todayNav = document.createElement("button");
  todayNav.className = "nav-item active-nav-item";
  todayNav.id = "today-nav";
  const todayText = document.createElement("p");
  todayText.textContent = "Today";
  const todayImg = document.createElement("img");
  todayImg.src = IoTodayOutline;
  todayNav.appendChild(todayImg);
  todayNav.appendChild(todayText);
  todayNav.addEventListener("click", () => {
    updateActiveNav("today-nav");
    ShowTaskPage();
    closeSidebarOnMobile();
  });

  const weekNav = document.createElement("button");
  weekNav.className = "nav-item";
  weekNav.id = "week-nav";
  const weekText = document.createElement("p");
  weekText.textContent = "Week";
  const weekImg = document.createElement("img");
  weekImg.src = BsCalendar2Week;
  weekNav.appendChild(weekImg);
  weekNav.appendChild(weekText);
  weekNav.addEventListener("click", () => {
    updateActiveNav("week-nav");
    ShowTaskPage("week");
    closeSidebarOnMobile();
  });

  const notesNav = document.createElement("button");
  notesNav.className = "nav-item";
  notesNav.id = "notes-nav";
  const notesText = document.createElement("p");
  notesText.textContent = "Notes";
  const notesImg = document.createElement("img");
  notesImg.src = BiNote;
  notesNav.appendChild(notesImg);
  notesNav.appendChild(notesText);
  notesNav.addEventListener("click", () => {
    updateActiveNav("notes-nav");
    ShowNotesPage();
    closeSidebarOnMobile();
  });

  sidebar.appendChild(todayNav);
  sidebar.appendChild(weekNav);
  sidebar.appendChild(notesNav);

  const line = document.createElement("hr");
  line.className = "line";
  sidebar.appendChild(line);

  const projectNavContainer = document.createElement("div");
  projectNavContainer.id = "project-nav-container";
  const projectNavHeader = document.createElement("h4");
  projectNavHeader.textContent = "Projects";
  projectNavContainer.appendChild(projectNavHeader);

  sidebar.appendChild(projectNavContainer);

  function updateActiveNav(activeId) {
    document.querySelectorAll(".nav-item").forEach((item) => {
      item.classList.remove("active-nav-item");
    });
    document.getElementById(activeId).classList.add("active-nav-item");
  }

  function closeSidebarOnMobile() {
    const width = window.innerWidth;
    if (width < 1024) {
      sidebar.classList.remove("open");
      const overlay = document.querySelector(".sidebar-overlay");
      overlay.classList.remove("active");
    }
  }

  return sidebar;
}
