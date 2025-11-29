import SideBar from "./sidebar";

export default function Page() {
  const content = document.getElementById("content");
  const main = document.createElement("main");

  const h1 = document.createElement("h1");

  main.appendChild(SideBar());
  content.appendChild(main);
}
