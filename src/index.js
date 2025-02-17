import "./main.css";
import { TodoApp, Project, Task } from "./app.js";
import { add } from "date-fns";

class ScreenController {
  static FORM_EDIT_MODE = 0;
  static FORM_CREATE_MODE = 1;

  #selectedProject = null;
  #selectedTask = null;
  selectedTask;
  selectedProject;

  constructor(doc) {
    this.doc = doc;
    this.todoApp = new TodoApp(this.doc);
    this.todoApp.init();

    this.cacheDOM();
  }

  cacheDOM() {
    this.asideSection = this.doc.querySelector(".side-bar-section");
    this.mainSection = this.doc.querySelector(".main-section");
    this.taskSection = this.doc.querySelector(".task-section");
    this.taskForm = this.doc.querySelector("#task-form");
    this.projectForm = this.doc.querySelector("#project-form");
  }

  updateWindow() {
    this.displaySideBarSection();
    this.selectProject(this.todoApp.getProject(0));
    // this.selectTask(this.todoApp.getProjectTasks(0)[1]);
  }

  // Tasks
  set selectedTask(task) {
    if (task && task instanceof Task) {
      this.#selectedTask = task;
    } else {
      this.#selectedTask = null;
    }
  }

  get selectedTask() {
    return this.#selectedTask;
  }

  selectTask(task) {
    this.selectedTask = task;
    this.renderProjectSection();
    this.renderTaskSection();
  }

  renderTaskSection() {
    if (this.selectedTask) {
      this.displayTaskDetails(this.selectedTask);
    } else {
      this.displayMessage(this.taskSection, "task");
    }
  }

  displayTaskDetails(task) {
    this.taskSection.textContent = "";

    const header = this.doc.createElement("div");
    const content = this.doc.createElement("div");
    const controls = this.doc.createElement("div");
    const checkDate = this.doc.createElement("div");
    const dateWrapper = this.doc.createElement("div");
    const date = this.doc.createElement("p");
    const titleWrapper = this.doc.createElement("task-title");
    const title = this.doc.createElement("h4");
    const desc = this.doc.createElement("p");
    const checkBox = this.createElement(
      "i",
      "",
      "fi fi-rr-square clickable-icon check-box"
    );
    const editIcon = this.createElement(
      "i",
      "",
      "fi fi-rr-pen-square clickable-icon edit-icon"
    );
    const priorityIcon = this.createElement(
      "i",
      "",
      "fi fi-sr-flag-alt icon priority-icon"
    );

    //task content
    date.textContent = task.dueDate;
    title.textContent = task.title;
    desc.textContent = task.desc;
    if (task.isOverdue()) {
      this.elementAddClass(date, "date-overdue");
    }
    this.elementAddClass(header, "task-header");
    this.elementAddClass(controls, "task-controls");
    this.elementAddClass(checkDate, "task-check-date");
    this.elementAddClass(dateWrapper, "task-date");
    this.elementAddClass(titleWrapper, "task-title");
    this.elementAddClass(desc, "task-desc");

    this.assignPriorityClasses(task, priorityIcon);
    this.assignStatusIconClasses(task, checkBox);

    //events
    editIcon.addEventListener("click", () => this.buildTaskForm(task));
    checkBox.addEventListener("click", (event) =>
      this.switchTaskStatus(event, task)
    );

    dateWrapper.appendChild(date);
    checkDate.appendChild(checkBox);
    checkDate.appendChild(dateWrapper);
    controls.appendChild(checkDate);
    controls.appendChild(editIcon);
    titleWrapper.appendChild(title);
    titleWrapper.appendChild(priorityIcon);
    header.appendChild(controls);
    header.appendChild(titleWrapper);
    content.appendChild(desc);

    this.taskSection.appendChild(header);
    this.taskSection.appendChild(content);
  }

  // Projects
  set selectedProject(value) {
    if (value && value instanceof Project) {
      this.#selectedProject = value;
    } else {
      this.#selectedProject = null;
    }
  }

  get selectedProject() {
    return this.#selectedProject;
  }

  selectProject(value) {
    this.selectedProject = value;
    this.selectedTask = null;
    this.displaySideBarSection();
    this.renderProjectSection();
    this.renderTaskSection();
  }

  renderProjectSection() {
    if (this.selectedProject) {
      this.displayMainSection(this.selectedProject);
    } else {
      this.displayMessage(this.mainSection, "project");
    }
  }

  displayMainSection(list) {
    // remove previous content
    this.mainSection.textContent = "";

    const header = this.doc.createElement("div");
    const mainList = this.doc.createElement("div");

    // Header
    const headerTitle = this.doc.createElement("div");
    const title = this.createElement("h4", list.name);
    const editLink = this.doc.createElement("a");
    const editIcon = this.createElement(
      "i",
      "",
      "fi fi-rr-pen-square clickable-icon edit-icon"
    );
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
    const tasks = this.todoApp.getProjectTasks(list.id);
    for (const task of tasks) {
      const itemContainer = this.doc.createElement("div");
      const desc = this.doc.createElement("div");
      const dateContainer = this.doc.createElement("div");
      const date = this.doc.createElement("p");
      const checkBoxLink = this.doc.createElement("a");
      const checkBoxIcon = this.createElement(
        "i",
        "",
        "fi clickable-icon check-box"
      );
      const taskTitle = this.doc.createElement("a");
      const taskPriority = this.doc.createElement("a");
      const priorityIcon = this.createElement(
        "i",
        "",
        "fi fi-sr-flag-alt icon priority-icon"
      );

      taskTitle.textContent = task.title;
      date.textContent = task.getFormattedDate();
      console.log(task.getFormattedDate(), task.isOverdue());

      itemContainer.classList.add("main-item");
      desc.classList.add("main-item-desc");
      dateContainer.classList.add("main-item-date");
      if (task.isOverdue()) {
        dateContainer.classList.add("date-overdue");
      }
      checkBoxLink.classList.add("check-box-link");
      this.assignStatusIconClasses(task, checkBoxIcon);
      this.assignTitleStatusClasses(task, taskTitle, date);
      this.assignPriorityClasses(task, priorityIcon, "mainSection");

      if (this.selectedTask && task.taskId === this.selectedTask.taskId) {
        this.elementAddClass(itemContainer, "selected-task-element");
      }

      checkBoxLink.appendChild(checkBoxIcon);
      taskPriority.appendChild(priorityIcon);

      desc.appendChild(checkBoxLink);
      desc.appendChild(taskTitle);
      desc.appendChild(taskPriority);
      dateContainer.appendChild(date);

      itemContainer.appendChild(desc);
      itemContainer.appendChild(dateContainer);

      // events
      checkBoxLink.addEventListener("click", (event) =>
        this.switchTaskStatus(event, task)
      );
      itemContainer.addEventListener("click", () => this.selectTask(task));
      mainList.appendChild(itemContainer);
    }
    // project Events
    editIcon.addEventListener("click", () => this.buildProjectForm(list));

    this.mainSection.appendChild(header);
    this.mainSection.appendChild(mainList);
  }

  // Sidebar
  displaySideBarSection() {
    const appSection = this.doc.createElement("div");
    const userSection = this.doc.createElement("div");
    userSection.textContent = this.todoApp.getUser();

    // Tasks
    const tasksMenu = this.doc.createElement("div");
    const taskMenu = this.todoApp.getTaskMenu();

    const taskMenuList = this.doc.createElement("ul");
    for (const [i, item] of this.todoApp.getTaskMenu().items.entries()) {
      const listItem = this.doc.createElement("li");
      const listIcon = this.createElement("i", "", taskMenu.icons[i] + " icon");
      const listText = this.createElement("span", item, "");
      listItem.appendChild(listIcon);
      listItem.appendChild(listText);

      if (i === 0) {
        this.elementAddClass(listItem, "menu-highlight");
        // create task event
        listItem.addEventListener("click", () => this.createTaskForm());
      }
      taskMenuList.appendChild(listItem);
    }

    taskMenuList.classList.add("menu-elements");

    tasksMenu.appendChild(taskMenuList);

    // Projects
    const projectsMenu = this.doc.createElement("div");
    const projectMenu = this.todoApp.getProjectMenu();
    const projectHeading = this.doc.createElement("div");
    const addProjectIcon = this.createElement(
      "i",
      "",
      "fi fi-sr-square-plus icon"
    );
    const projectTitle = this.createElement("span", projectMenu.title, "");

    const projectMenuList = this.doc.createElement("ul");
    for (const project of this.todoApp.getAllProjects()) {
      const listItem = this.doc.createElement("li");
      const listIcon = this.createElement(
        "i",
        "",
        projectMenu.icons[0] + " icon"
      );
      const listText = this.createElement("span", project.name, "");
      if (this.selectedProject && project.id === this.selectedProject.id) {
        this.elementAddClass(listItem, "selected-menu-element");
      }

      listItem.appendChild(listIcon);
      listItem.appendChild(listText);
      listItem.addEventListener("click", () => this.selectProject(project));

      projectMenuList.appendChild(listItem);
    }

    this.elementAddClass(addProjectIcon, "fi-rr-add icon");
    projectHeading.classList.add("menu-segment-heading");
    projectMenuList.classList.add("menu-elements");

    // Event
    projectHeading.addEventListener("click", () => this.createProjectForm());

    projectHeading.appendChild(addProjectIcon);
    projectHeading.appendChild(projectTitle);
    projectsMenu.appendChild(projectHeading);
    projectsMenu.appendChild(projectMenuList);

    this.asideSection.textContent = "";
    this.asideSection.appendChild(appSection);
    this.asideSection.appendChild(userSection);
    this.asideSection.appendChild(tasksMenu);
    this.asideSection.appendChild(projectsMenu);
  }

  showtaskForm(task) {
    this.taskForm.showModal();
  }

  showProjectForm() {
    this.projectForm.showModal();
  }

  // Dialogs
  buildProjectForm(project, formMode) {
    this.projectForm.textContent = "";

    const form = this.doc.createElement("form");
    const header = this.doc.createElement("div");
    const title = this.createElement("h5", "Project editor", "");
    const btnContainer = this.doc.createElement("div");
    const deleteBtn = this.doc.createElement("button");
    const cancelBtn = this.doc.createElement("button");
    const confirmBtn = this.doc.createElement("button");
    const deleteIcon = this.createElement("i", "", "fi fi-rr-trash icon");
    const cancelIcon = this.createElement(
      "i",
      "",
      "fi fi-rr-cross icon icon-cross"
    );
    const confirmIcon = this.createElement("i", "", "fi fi-rr-check icon");

    const projectTitle = this.createInputElement("text", "title", "h4");
    const descContainer = this.doc.createElement("div");
    const projectDesc = this.doc.createElement("textarea");

    projectTitle.setAttribute("value", project.name);
    projectDesc.textContent = project.desc;
    this.elementAddClass(header, "dialog-header");
    this.elementAddClass(projectTitle, "h4");
    this.elementAddClass(btnContainer, "button-group");
    this.elementAddClass(descContainer, "desc-area");

    deleteBtn.setAttribute("id", "delete");
    cancelBtn.setAttribute("id", "cancel");
    confirmBtn.setAttribute("type", "submit");
    confirmBtn.setAttribute("id", "confirm");
    projectTitle.setAttribute("placeholder", "Project title");
    projectTitle.setAttribute("for", "priority");
    projectDesc.setAttribute("id", "desc");
    projectDesc.setAttribute("name", "desc");
    projectDesc.setAttribute(
      "placeholder",
      "Write the description of your project here..."
    );
    projectDesc.setAttribute("rows", "15");
    projectDesc.setAttribute("cols", "32");

    //events
    const formInputs = { projectTitle, projectDesc };
    this.bindEventsProjectForm(
      deleteBtn,
      cancelBtn,
      confirmBtn,
      project,
      formInputs,
      formMode
    );

    deleteBtn.appendChild(deleteIcon);
    cancelBtn.appendChild(cancelIcon);
    confirmBtn.appendChild(confirmIcon);
    btnContainer.appendChild(deleteBtn);
    if (formMode !== ScreenController.FORM_CREATE_MODE) {
      btnContainer.appendChild(cancelBtn);
    }
    btnContainer.appendChild(confirmBtn);
    header.appendChild(title);
    header.appendChild(btnContainer);
    descContainer.appendChild(projectDesc);

    form.appendChild(header);
    form.appendChild(projectTitle);
    form.appendChild(descContainer);
    this.projectForm.appendChild(form);
    this.showProjectForm();
  }

  buildTaskForm(task, formMode) {
    this.taskForm.textContent = "";

    const form = this.doc.createElement("form");
    const header = this.doc.createElement("div");
    const title = this.createElement("h5", "Todo editor", "");
    const btnContainer = this.doc.createElement("div");
    const deleteBtn = this.doc.createElement("button");
    const cancelBtn = this.doc.createElement("button");
    const confirmBtn = this.doc.createElement("button");
    const deleteIcon = this.createElement("i", "", "fi fi-rr-trash icon");
    const cancelIcon = this.createElement(
      "i",
      "",
      "fi fi-rr-cross icon icon-cross"
    );
    const confirmIcon = this.createElement("i", "", "fi fi-rr-check icon");
    const statusDateGroup = this.doc.createElement("div");
    const statusDateGroupLeft = this.doc.createElement("div");
    const statusDateGroupRight = this.doc.createElement("div");
    const statusIcon = this.createElement(
      "i",
      "",
      "fi clickable-icon check-box"
    );
    const status = this.createInputElement("number", "status", "hidden");
    const dueDate = this.createInputElement("date", "dueDate");
    const projectSelect = this.doc.createElement("select");
    const titlePrioGroup = this.doc.createElement("div");
    const titlePrioGroupLeft = this.doc.createElement("div");
    const titlePrioGroupRight = this.doc.createElement("div");
    const taskTitle = this.createInputElement("text", "title", "h4");
    const prioLabel = this.doc.createElement("label");
    const priorityIcon = this.createElement(
      "i",
      "",
      "fi fi-sr-flag-alt icon priority-icon"
    );
    const prioritySelect = this.doc.createElement("select");
    const descContainer = this.doc.createElement("div");
    const taskDesc = this.doc.createElement("textarea");

    // adding priority options
    const options = [];
    for (let i = 0; i < Task.priority.length; i++) {
      const option = this.doc.createElement("option");
      option.textContent = Task.priority[i];
      option.setAttribute("value", i);
      prioritySelect.appendChild(option);
      options.push(option);
    }
    // adding project options
    for (const project of this.todoApp.getAllProjects()) {
      const option = this.doc.createElement("option");
      option.textContent = project.name;
      option.setAttribute("value", project.id);

      // select current project
      if (project.id === this.selectedProject.id) {
        option.setAttribute("selected", "");
      }

      projectSelect.appendChild(option);
    }
    // Todo content
    status.setAttribute("value", task.status);
    dueDate.setAttribute("value", task.dueDate);
    taskTitle.setAttribute("value", task.title);
    taskDesc.textContent = task.desc;
    options[task.priority].setAttribute("selected", "");

    this.elementAddClass(header, "dialog-header");
    this.elementAddClass(taskTitle, "h4");
    this.elementAddClass(btnContainer, "button-group");
    this.elementAddClass(statusDateGroup, "input-group");
    this.elementAddClass(
      statusDateGroupLeft,
      "input-group-left input-status-date"
    );
    this.elementAddClass(statusDateGroupRight, "input-group-right");
    this.elementAddClass(titlePrioGroup, "input-group");
    this.elementAddClass(titlePrioGroupLeft, "input-group-left");
    this.elementAddClass(titlePrioGroupRight, "input-group-right");
    this.elementAddClass(descContainer, "desc-area");
    this.assignStatusIconClasses(task, statusIcon);
    this.assignPriorityClasses(task, priorityIcon);

    deleteBtn.setAttribute("id", "delete");
    deleteBtn.setAttribute("type", "button");
    cancelBtn.setAttribute("id", "cancel");
    cancelBtn.setAttribute("type", "button");
    confirmBtn.setAttribute("type", "submit");
    confirmBtn.setAttribute("id", "confirm");
    taskTitle.setAttribute("placeholder", "Todo Title");
    taskTitle.setAttribute("for", "priority");
    prioritySelect.setAttribute("name", "priority");
    prioritySelect.setAttribute("id", "priority");
    taskDesc.setAttribute("id", "desc");
    taskDesc.setAttribute("name", "desc");
    taskDesc.setAttribute(
      "placeholder",
      "Write the description of your task here..."
    );
    taskDesc.setAttribute("rows", "15");
    taskDesc.setAttribute("cols", "32");
    confirmBtn.focus();

    // events
    const formInputs = {
      status,
      dueDate,
      taskTitle,
      taskDesc,
      prioritySelect,
      projectSelect,
    };
    this.bindEventsTaskForm(
      deleteBtn,
      cancelBtn,
      confirmBtn,
      statusIcon,
      priorityIcon,
      task,
      formInputs,
      formMode
    );

    deleteBtn.appendChild(deleteIcon);
    cancelBtn.appendChild(cancelIcon);
    confirmBtn.appendChild(confirmIcon);
    btnContainer.appendChild(deleteBtn);
    if (formMode !== ScreenController.FORM_CREATE_MODE) {
      btnContainer.appendChild(cancelBtn);
    }
    btnContainer.appendChild(confirmBtn);
    header.appendChild(title);
    header.appendChild(btnContainer);
    statusDateGroupLeft.appendChild(statusIcon);
    statusDateGroupLeft.appendChild(status);
    statusDateGroupLeft.appendChild(dueDate);
    statusDateGroupRight.appendChild(projectSelect);
    statusDateGroup.appendChild(statusDateGroupLeft);
    statusDateGroup.appendChild(statusDateGroupRight);
    titlePrioGroupLeft.appendChild(taskTitle);
    prioLabel.appendChild(priorityIcon);
    titlePrioGroupRight.appendChild(prioLabel);
    titlePrioGroupRight.appendChild(prioritySelect);
    titlePrioGroup.appendChild(titlePrioGroupLeft);
    titlePrioGroup.appendChild(titlePrioGroupRight);
    descContainer.appendChild(taskDesc);

    form.appendChild(header);
    form.appendChild(statusDateGroup);
    form.appendChild(titlePrioGroup);
    form.appendChild(descContainer);
    this.taskForm.appendChild(form);
    this.showtaskForm();
  }

  // General
  displayMessage(section, type) {
    section.textContent = "";
    const message = `Select a ${type}...`;
    const container = this.doc.createElement("div");
    const icon = this.createElement("i", "", "fi icon");
    const msg = this.doc.createElement("p");

    msg.textContent = message;
    if (type === "task") {
      this.elementAddClass(icon, "fi-tr-journal-alt");
    } else {
      this.elementAddClass(icon, "fi-tr-folder-open");
    }
    this.elementAddClass(container, "empty-message");

    container.appendChild(icon);
    container.appendChild(msg);

    section.appendChild(container);
  }

  // Task Events
  bindEventsTaskForm(
    deleteBtn,
    cancelBtn,
    confirmBtn,
    statusIcon,
    priorityIcon,
    task,
    inputs
  ) {
    deleteBtn.addEventListener("click", (event) =>
      this.deleteSelectedTask(event, task)
    );
    cancelBtn.addEventListener("click", (event) => this.closeTaskDialog(event));
    confirmBtn.addEventListener("click", (event) =>
      this.updateSelectedTask(event, task, this.parseTaskFormInputs(inputs))
    );
    statusIcon.addEventListener("click", (event) =>
      this.switchTaskStatusForm(event.target, inputs.status)
    );
    inputs.prioritySelect.addEventListener("change", (event) =>
      this.switchTaskPriorityForm(event.target, priorityIcon)
    );
  }

  deleteSelectedTask(event, task) {
    event.preventDefault();
    console.log("Deleting...");
    this.todoApp.deleteTask(task.taskId);
    this.renderProjectSection();
    this.selectTask(null);

    this.taskForm.close();
  }

  closeTaskDialog(event) {
    event.preventDefault();
    this.taskForm.close();
  }

  updateSelectedTask(event, task, values) {
    event.preventDefault();

    this.todoApp.updateTask(task, values);
    const choosenProject = this.todoApp.getProject(values.projectId);
    this.selectProject(choosenProject);
    this.selectTask(task);

    this.taskForm.close();
  }

  parseTaskFormInputs(inputs) {
    return {
      status: parseInt(inputs.status.value),
      dueDate: inputs.dueDate.value,
      title: inputs.taskTitle.value,
      desc: inputs.taskDesc.value,
      priority: parseInt(inputs.prioritySelect.value),
      projectId: parseInt(inputs.projectSelect.value),
    };
  }

  createTaskForm(event) {
    const newTask = this.todoApp.createTask();
    newTask.assignToProject(this.selectedProject.id);

    // this.selectMenuTask(newTask);
    this.buildTaskForm(newTask, ScreenController.FORM_CREATE_MODE);
  }

  switchTaskStatus(event, task) {
    event.stopPropagation();

    this.todoApp.switchTaskStatus(task);
    this.renderProjectSection();
    this.renderTaskSection();
  }

  switchTaskStatusForm(checkbox, statusInput) {
    const status = parseInt(statusInput.value) || 0;
    statusInput.value = status === 0 ? 1 : 0;
    this.assignStatusIconClassesForm(parseInt(statusInput.value), checkbox);
  }

  switchTaskPriorityForm(priorityInput, icon) {
    const priority = parseInt(priorityInput.value) || 0;
    this.elementDeleteClassSubstr(icon, "-priority");
    this.assignPriorityClasses({ priority }, icon);
  }

  assignStatusIconClassesForm(status, checkBox) {
    if (status === Task.STATUS_COMPLETE) {
      checkBox.classList.remove("fi-rr-square");
      checkBox.classList.add("fi-sr-checkbox");
    } else {
      checkBox.classList.remove("fi-sr-checkbox");
      checkBox.classList.add("fi-rr-square");
    }
  }

  assignStatusIconClasses(task, checkBox) {
    if (task.status === Task.STATUS_COMPLETE) {
      checkBox.classList.remove("fi-rr-square");
      checkBox.classList.add("fi-sr-checkbox");
    } else {
      checkBox.classList.remove("fi-sr-checkbox");
      checkBox.classList.add("fi-rr-square");
    }
  }

  assignTitleStatusClasses(task, title, date) {
    if (task.status === Task.STATUS_COMPLETE) {
      title.classList.add("item-task-complete");
      date.classList.add("item-task-complete");
    } else {
      title.classList.remove("item-task-complete");
      date.classList.remove("item-task-complete");
    }
  }

  assignPriorityClasses(task, icon, section) {
    if (
      section === "mainSection" &&
      (task.priority === Task.DEFAULT_PRIORITY ||
        task.status === Task.STATUS_COMPLETE)
    ) {
      this.elementAddClass(icon, "invisible");
    } else if (task.priority === Task.HIGH_PRIORITY) {
      this.elementAddClass(icon, "high-priority");
    } else if (task.priority === Task.MEDIUM_PRIORITY) {
      this.elementAddClass(icon, "medium-priority");
    } else if (task.priority === Task.LOW_PRIORITY) {
      this.elementAddClass(icon, "low-priority");
    } else {
      this.elementAddClass(icon, "default-priority");
    }
  }

  // Project Events
  bindEventsProjectForm(deleteBtn, cancelBtn, confirmBtn, project, inputs) {
    deleteBtn.addEventListener("click", (event) =>
      this.deleteSelectedProject(event, project)
    );
    cancelBtn.addEventListener("click", (event) =>
      this.closeProjectDialog(event)
    );
    confirmBtn.addEventListener("click", (event) =>
      this.updateSelectedProject(
        event,
        project,
        this.parseProjectFormInputs(inputs)
      )
    );
  }

  deleteSelectedProject(event, project) {
    event.preventDefault();

    this.todoApp.deleteProjectWithTasks(project.id);
    this.displaySideBarSection();
    this.selectProject(null);

    this.projectForm.close();
  }

  closeProjectDialog(event) {
    event.preventDefault();
    this.projectForm.close();
  }

  updateSelectedProject(event, project, values) {
    event.preventDefault();
    this.selectedProject = project;

    this.todoApp.updateProject(project, values);
    this.displaySideBarSection();
    this.renderProjectSection();

    this.projectForm.close();
  }

  parseProjectFormInputs(inputs) {
    return {
      name: inputs.projectTitle.value,
      desc: inputs.projectDesc.value,
    };
  }

  createProjectForm(event) {
    const newProject = this.todoApp.createProject();

    this.buildProjectForm(newProject, ScreenController.FORM_CREATE_MODE);
  }
  // DOM
  elementAddClass(elem, classes) {
    if (!classes) return;

    const classNames = classes.split(" ");
    for (const className of classNames) {
      if (className) elem.classList.add(className);
    }
  }

  elementDeleteClass(elem, classes) {
    if (!classes) return;

    const classNames = classes.split(" ");
    for (const className of classNames) {
      if (className) elem.classList.remove(className);
    }
  }

  elementDeleteClassSubstr(element, substr) {
    for (const className of element.classList) {
      if (className.includes(substr)) {
        this.elementDeleteClass(element, className);
      }
    }
  }

  createElement(tag, content, classes) {
    const elem = this.doc.createElement(tag);
    elem.textContent = content;
    this.elementAddClass(elem, classes);
    return elem;
  }

  createInputElement(type, name, classes) {
    const input = this.doc.createElement("input");
    input.setAttribute("type", type);
    input.setAttribute("id", name);
    input.setAttribute("name", name);
    this.elementAddClass(input, classes);
    return input;
  }
}
const screenCont = new ScreenController(document);
screenCont.updateWindow();
