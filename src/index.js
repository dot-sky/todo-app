import "./main.css";
import { TodoApp } from "./app.js";
import { add } from "date-fns";

class ScreenController {
  constructor(doc) {
    this.doc = doc;
    this.todoApp = new TodoApp();
    this.todoApp.addData();
  }

  updateWindow() {
    this.populateSideBarSection();
  }

  populateSideBarSection() {
    this.asideSection = this.doc.querySelector(".side-bar-section");
    const appSection = this.doc.createElement("div");

    const userSection = this.doc.createElement("div");
    userSection.textContent = "Derek";

    // Tasks
    const tasksMenu = this.doc.createElement("div");
    const taskHeading = this.doc.createElement("div");
    const taskTitle = this.doc.createElement("h4");
    taskTitle.textContent = this.todoApp.getTaskMenu().title;
    const addTaskIcon = this.doc.createElement("i");
    const addTaskLink = this.doc.createElement("a");

    const taskMenuList = this.doc.createElement("ul");
    for (const item of this.todoApp.getTaskMenu().items) {
      const listItem = this.doc.createElement("li");
      const itemLink = this.doc.createElement("a");
      itemLink.textContent = item;

      listItem.appendChild(itemLink);
      taskMenuList.appendChild(listItem);
    }

    this.elementAddClass(addTaskIcon, "fi-rr-add menu-icon");
    taskHeading.classList.add("menu-segment-heading");
    taskMenuList.classList.add("menu-elements");

    addTaskLink.appendChild(addTaskIcon);
    taskHeading.appendChild(taskTitle);
    taskHeading.appendChild(addTaskLink);

    tasksMenu.appendChild(taskHeading);
    tasksMenu.appendChild(taskMenuList);

    // Projects
    const projectsMenu = this.doc.createElement("div");
    const projectHeading = this.doc.createElement("div");
    const projectTitle = this.doc.createElement("h4");
    projectTitle.textContent = this.todoApp.getProjectMenu().title;
    const addProjectIcon = this.doc.createElement("i");
    const addProjectLink = this.doc.createElement("a");

    const projectMenuList = this.doc.createElement("ul");
    for (const project of this.todoApp.getAllProjects()) {
      const listItem = this.doc.createElement("li");
      const itemLink = this.doc.createElement("a");
      itemLink.textContent = project.getName();

      listItem.appendChild(itemLink);
      projectMenuList.appendChild(listItem);
    }

    this.elementAddClass(addProjectIcon, "fi-rr-add menu-icon");
    projectHeading.classList.add("menu-segment-heading");
    projectMenuList.classList.add("menu-elements");

    addProjectLink.appendChild(addProjectIcon);
    projectHeading.appendChild(projectTitle);
    projectHeading.appendChild(addProjectLink);

    projectsMenu.appendChild(projectHeading);
    projectsMenu.appendChild(projectMenuList);

    this.asideSection.textContent = "";
    this.asideSection.appendChild(appSection);
    this.asideSection.appendChild(userSection);
    this.asideSection.appendChild(tasksMenu);
    this.asideSection.appendChild(projectsMenu);
  }

  elementAddClass(elem, classes) {
    const classNames = classes.split(" ");
    for (const className of classNames) {
      if (className) elem.classList.add(className);
    }
  }
}
const screenCont = new ScreenController(document);
screenCont.updateWindow();
