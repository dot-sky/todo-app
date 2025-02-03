import "./main.css";
import { TodoApp } from "./app.js";
import { add } from "date-fns";

class ScreenController {
  constructor(doc) {
    this.doc = doc;
    this.todoApp = new TodoApp();

    this.todoApp.loadData();
    this.cacheDOM();
  }

  cacheDOM() {
    this.asideSection = this.doc.querySelector(".side-bar-section");
    this.mainSection = this.doc.querySelector(".main-section");
  }

  updateWindow() {
    this.populateSideBarSection();
    this.populateMainSection(this.todoApp.getProject(2));
  }

  populateMainSection(list) {
    // remove previous content
    this.mainSection.textContent = "";

    const header = this.doc.createElement("div");
    const mainList = this.doc.createElement("div");

    // Header
    const headerTitle = this.doc.createElement("div");
    const title = this.createElement("h4", list.name);
    const editLink = this.doc.createElement("a");
    const editIcon = this.createElement("i", "", "fi fi-rr-edit icon");
    const headerDesc = this.doc.createElement("div");
    const descText = this.doc.createElement("p");

    editLink.setAttribute("href", "#");
    descText.textContent = list.desc;

    this.elementAddClass(header, "main-header");
    this.elementAddClass(headerTitle, "main-title");
    this.elementAddClass(headerDesc, "main-desc");

    headerDesc.appendChild(descText);
    editLink.appendChild(editIcon);
    headerTitle.appendChild(title);
    headerTitle.appendChild(editLink);
    header.appendChild(headerTitle);
    header.appendChild(headerDesc);

    // List
    const tasks = this.todoApp.getProjectTasks(list.getId());
    for (const task of tasks) {
      const itemContainer = this.doc.createElement("div");
      const desc = this.doc.createElement("div");
      const dateContainer = this.doc.createElement("div");
      const date = this.doc.createElement("div");
      const checkBoxLink = this.doc.createElement("a");
      const checkBoxIcon = this.createElement(
        "i",
        "",
        "fi fi-rr-square menu-icon check-box"
      );
      const taskTitle = this.doc.createElement("a");
      const taskPriority = this.doc.createElement("a");
      const priorityIcon = this.createElement(
        "i",
        "",
        "fi fi-rr-flag-alt icon priority-icon"
      );

      taskTitle.textContent = task.title;
      taskTitle.textContent = task.title;
      date.textContent = task.dueDate;

      itemContainer.classList.add("main-item");
      desc.classList.add("main-item-desc");
      dateContainer.classList.add("main-item-date");
      checkBoxLink.classList.add("check-box-link");

      checkBoxLink.appendChild(checkBoxIcon);
      taskPriority.appendChild(priorityIcon);

      desc.appendChild(checkBoxLink);
      desc.appendChild(taskTitle);
      desc.appendChild(taskPriority);
      dateContainer.appendChild(date);

      itemContainer.appendChild(desc);
      itemContainer.appendChild(dateContainer);
      mainList.appendChild(itemContainer);
    }

    this.mainSection.appendChild(header);
    this.mainSection.appendChild(mainList);
  }
  populateSideBarSection() {
    const appSection = this.doc.createElement("div");
    const userSection = this.doc.createElement("div");
    userSection.textContent = "Derek";

    // Tasks
    const tasksMenu = this.doc.createElement("div");
    const taskHeading = this.doc.createElement("div");
    const taskTitle = this.doc.createElement("h5");
    const addTaskIcon = this.doc.createElement("i");
    const addTaskLink = this.doc.createElement("a");

    taskTitle.textContent = this.todoApp.getTaskMenu().title;

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
    const projectTitle = this.doc.createElement("h5");
    const addProjectIcon = this.doc.createElement("i");
    const addProjectLink = this.doc.createElement("a");

    projectTitle.textContent = this.todoApp.getProjectMenu().title;

    const projectMenuList = this.doc.createElement("ul");
    for (const project of this.todoApp.getAllProjects()) {
      const listItem = this.doc.createElement("li");
      listItem.textContent = project.name;
      listItem.addEventListener("click", () =>
        this.populateMainSection(project)
      );

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
    if (!classes) return;

    const classNames = classes.split(" ");
    for (const className of classNames) {
      if (className) elem.classList.add(className);
    }
  }

  createElement(tag, content, classes) {
    const elem = this.doc.createElement(tag);
    elem.textContent = content;
    this.elementAddClass(elem, classes);
    return elem;
  }
}
const screenCont = new ScreenController(document);
screenCont.updateWindow();
