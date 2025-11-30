import SideBar from "./sidebar";

export default function Page() {
  const content = document.getElementById("content");
  const main = document.createElement("main");
  main.id = "main-content";

  const h1 = document.createElement("h1");

  // Create overlay for mobile drawer
  const sidebarOverlay = document.createElement("div");
  sidebarOverlay.className = "sidebar-overlay";
  sidebarOverlay.addEventListener("click", () => {
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.remove("open");
    sidebarOverlay.classList.remove("active");
  });

  // Get hamburger button from header
  const hamburgerBtn = document.getElementById("sidebar-toggle");
  if (hamburgerBtn) {
    hamburgerBtn.addEventListener("click", () => {
      const sidebar = document.getElementById("sidebar");
      sidebar.classList.toggle("open");
      sidebarOverlay.classList.toggle("active");
    });
  }

  content.appendChild(sidebarOverlay);
  content.appendChild(SideBar());
  content.appendChild(main);
}
