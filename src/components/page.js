import SideBar from "./sidebar";

export default function Page() {
  const content = document.getElementById("content");
  const main = document.createElement("main");
  main.id = "main-content";

  const h1 = document.createElement("h1");

  content.appendChild(SideBar());
  content.appendChild(main);
}
