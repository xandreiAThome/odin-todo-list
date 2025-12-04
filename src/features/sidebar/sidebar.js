import IoTodayOutline from "../../../public/IoTodayOutline.svg";
import BsCalendar2Week from "../../../public/BsCalendar2Week.svg";
import BiNote from "../../../public/BiNote.svg";
import ShowTaskPage from "../tasks/tasks";
import ShowNotesPage from "../notes/notes";
import ProjectService from "../../service/project.service.js";
import { CreateModal } from "../modals/createModal.js";
import { ShowProjectContent } from "../projects/projects.js";

export default function SideBar() {
  const sidebar = document.createElement("nav");
  sidebar.id = "sidebar";

  const homeNav = document.createElement("button");
  homeNav.className = "nav-item active-nav-item";
  homeNav.id = "home-nav";
  const homeText = document.createElement("p");
  homeText.textContent = "Home";
  homeNav.appendChild(homeText);
  homeNav.addEventListener("click", () => {
    updateActiveNav(homeNav);
    ShowTaskPage("all");
    closeSidebarOnMobile();
  });

  const todayNav = document.createElement("button");
  todayNav.className = "nav-item";
  todayNav.id = "today-nav";
  const todayText = document.createElement("p");
  todayText.textContent = "Today";
  const todayImg = document.createElement("img");
  todayImg.src = IoTodayOutline;
  todayNav.appendChild(todayImg);
  todayNav.appendChild(todayText);
  todayNav.addEventListener("click", () => {
    updateActiveNav(todayNav);
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
    updateActiveNav(weekNav);
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
    updateActiveNav(notesNav);
    ShowNotesPage();
    closeSidebarOnMobile();
  });

  sidebar.appendChild(homeNav);
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

  // Populate projects
  const projectService = ProjectService();

  function updateProjectsList() {
    // Remove all project nav items except the header
    while (projectNavContainer.children.length > 1) {
      projectNavContainer.removeChild(projectNavContainer.lastChild);
    }

    // Re-fetch and render projects
    const projects = projectService.getProjects();
    projects.forEach((project) => {
      const projectItemWrapper = document.createElement("div");
      projectItemWrapper.className = "project-item-wrapper";
      projectItemWrapper.dataset.projectId = project.id;

      const projectNav = document.createElement("button");
      projectNav.className = "nav-item project-nav-item";
      projectNav.dataset.projectId = project.id;
      projectNav.textContent = project.name;
      projectNav.addEventListener("click", () => {
        // Don't navigate if we're in edit mode
        if (!projectItemWrapper.classList.contains("editing")) {
          updateActiveNav(projectNav);
          ShowProjectContent(project.id);
          closeSidebarOnMobile();
        }
      });

      projectItemWrapper.appendChild(projectNav);

      // Add hamburger menu for non-General projects
      if (project.name !== "General") {
        const menuBtn = document.createElement("button");
        menuBtn.className = "project-menu-btn";
        menuBtn.textContent = "⋮";
        menuBtn.title = "Project options";

        const menu = document.createElement("div");
        menu.className = "project-menu";

        const editBtn = document.createElement("button");
        editBtn.className = "project-menu-item edit-item";
        editBtn.textContent = "Edit";
        editBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          menu.classList.remove("active");
          startEditingProject(projectItemWrapper, project, projectNav);
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "project-menu-item delete-item";
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          menu.classList.remove("active");
          deleteProject(project);
        });

        menu.appendChild(editBtn);
        menu.appendChild(deleteBtn);

        menuBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          // Close other open menus
          document.querySelectorAll(".project-menu.active").forEach((m) => {
            if (m !== menu) {
              m.classList.remove("active");
            }
          });
          menu.classList.toggle("active");
        });

        projectItemWrapper.appendChild(menuBtn);
        projectItemWrapper.appendChild(menu);
      }

      projectNavContainer.appendChild(projectItemWrapper);
    });
  }

  function startEditingProject(wrapper, project, projectNav) {
    wrapper.classList.add("editing");

    // Hide the original nav button
    projectNav.style.display = "none";

    // Create input container
    const inputContainer = document.createElement("div");
    inputContainer.className = "project-edit-container";

    const input = document.createElement("input");
    input.type = "text";
    input.className = "project-edit-input";
    input.value = project.name;
    input.maxLength = 50;

    const saveBtn = document.createElement("button");
    saveBtn.className = "project-edit-btn save-btn";
    saveBtn.textContent = "✓";
    saveBtn.title = "Save";

    const cancelBtn = document.createElement("button");
    cancelBtn.className = "project-edit-btn cancel-btn";
    cancelBtn.textContent = "✕";
    cancelBtn.title = "Cancel";

    const finishEditing = () => {
      inputContainer.remove();
      projectNav.style.display = "";
      wrapper.classList.remove("editing");
    };

    saveBtn.addEventListener("click", () => {
      const newName = input.value.trim();
      if (newName && newName !== project.name) {
        projectService.updateProject(project.id, { name: newName });
        updateProjectsList();
      } else {
        finishEditing();
      }
    });

    cancelBtn.addEventListener("click", finishEditing);

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        saveBtn.click();
      } else if (e.key === "Escape") {
        cancelBtn.click();
      }
    });

    inputContainer.appendChild(input);
    inputContainer.appendChild(saveBtn);
    inputContainer.appendChild(cancelBtn);

    // Insert after the project nav button
    projectNav.parentNode.insertBefore(inputContainer, projectNav.nextSibling);

    // Focus and select the input
    input.focus();
    input.select();
  }

  // Close menus when clicking elsewhere
  document.addEventListener("click", () => {
    document.querySelectorAll(".project-menu.active").forEach((menu) => {
      menu.classList.remove("active");
    });
  });

  function deleteProject(project) {
    if (confirm(`Delete project "${project.name}"?`)) {
      projectService.deleteProject(project.id);
      updateProjectsList();
    }
  }

  // Expose to window for external access
  window.updateProjectsList = updateProjectsList;

  // Initial population
  updateProjectsList();

  function updateActiveNav(activeElement) {
    document.querySelectorAll(".nav-item").forEach((item) => {
      item.classList.remove("active-nav-item");
    });
    if (activeElement.id) {
      document
        .getElementById(activeElement.id)
        .classList.add("active-nav-item");
    } else {
      activeElement.classList.add("active-nav-item");
    }
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
