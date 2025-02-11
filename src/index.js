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
    this.todoApp = new TodoApp("Derek");

    this.todoApp.loadData();
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
    this.selectProject(this.todoApp.getProject(1));
    this.selectTask(this.todoApp.getTask(4));
    // this.projectForm.showModal();
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
    this.renderTaskSection();
  }

  renderTaskSection() {
    if (this.selectedTask) {
      this.displayTaskDetails(this.selectedTask);
    } else {
      this.displayMessage(this.taskSection, "Select a task ... ");
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
      "fi fi-rr-edit clickable-icon edit-icon"
    );
    const priorityIcon = this.createElement(
      "i",
      "",
      "fi fi-rr-flag-alt icon priority-icon"
    );

    //task content
    date.textContent = task.dueDate;
    title.textContent = task.title;
    desc.textContent = task.desc;
    priorityIcon.textContent = task.priority;

    this.elementAddClass(header, "task-header");
    this.elementAddClass(controls, "task-controls");
    this.elementAddClass(checkDate, "task-check-date");
    this.elementAddClass(dateWrapper, "task-date");
    this.elementAddClass(titleWrapper, "task-title");
    this.elementAddClass(desc, "task-desc");

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

    editIcon.addEventListener("click", () => this.buildTaskForm(task));

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
    this.renderProjectSection();
    this.renderTaskSection();
  }

  renderProjectSection() {
    if (this.selectedProject) {
      this.displayMainSection(this.selectedProject);
    } else {
      this.displayMessage(this.mainSection, "Select a project ... ");
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
      "fi fi-rr-edit clickable-icon edit-icon"
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
        "fi fi-rr-square clickable-icon check-box"
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

      // event
      editIcon.addEventListener("click", () => this.buildProjectForm(list));

      checkBoxLink.appendChild(checkBoxIcon);
      taskPriority.appendChild(priorityIcon);

      desc.appendChild(checkBoxLink);
      desc.appendChild(taskTitle);
      desc.appendChild(taskPriority);
      dateContainer.appendChild(date);

      itemContainer.appendChild(desc);
      itemContainer.appendChild(dateContainer);

      itemContainer.addEventListener("click", () => this.selectTask(task));
      mainList.appendChild(itemContainer);
    }

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

    this.elementAddClass(addTaskIcon, "fi-rr-add clickable-icon icon");
    taskHeading.classList.add("menu-segment-heading");
    taskMenuList.classList.add("menu-elements");

    // Event
    addTaskIcon.addEventListener("click", () => this.createTaskForm());

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
      listItem.addEventListener("click", () => this.selectProject(project));

      projectMenuList.appendChild(listItem);
    }

    this.elementAddClass(addProjectIcon, "fi-rr-add icon");
    projectHeading.classList.add("menu-segment-heading");
    projectMenuList.classList.add("menu-elements");

    // Event
    addProjectIcon.addEventListener("click", () => this.createProjectForm());

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
      "fi fi-rr-square clickable-icon check-box"
    );
    const dueDate = this.createInputElement("date", "dueDate");
    const projectSelect = this.doc.createElement("select");
    const titlePrioGroup = this.doc.createElement("div");
    const titlePrioGroupLeft = this.doc.createElement("div");
    const titlePrioGroupRight = this.doc.createElement("div");
    const taskTitle = this.createInputElement("text", "title", "h4");
    const prioLabel = this.doc.createElement("label");
    const prioIcon = this.createElement(
      "i",
      "",
      "fi fi-rr-flag-alt icon priority-icon'"
    );
    const select = this.doc.createElement("select");
    const descContainer = this.doc.createElement("div");
    const taskDesc = this.doc.createElement("textarea");

    // adding priority options
    const options = [];
    for (let i = 0; i < Task.priority.length; i++) {
      const option = this.doc.createElement("option");
      option.textContent = Task.priority[i];
      option.setAttribute("value", i);
      select.appendChild(option);
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
    // status
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

    deleteBtn.setAttribute("id", "delete");
    cancelBtn.setAttribute("id", "cancel");
    confirmBtn.setAttribute("type", "submit");
    confirmBtn.setAttribute("id", "confirm");
    taskTitle.setAttribute("placeholder", "Todo Title");
    taskTitle.setAttribute("for", "priority");
    select.setAttribute("name", "priority");
    select.setAttribute("id", "priority");
    taskDesc.setAttribute("id", "desc");
    taskDesc.setAttribute("name", "desc");
    taskDesc.setAttribute(
      "placeholder",
      "Write the description of your task here..."
    );
    taskDesc.setAttribute("rows", "15");
    taskDesc.setAttribute("cols", "32");

    // events
    const formInputs = {
      dueDate,
      taskTitle,
      taskDesc,
      select,
      projectSelect,
    };
    this.bindEventsTaskForm(
      deleteBtn,
      cancelBtn,
      confirmBtn,
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
    statusDateGroupLeft.appendChild(dueDate);
    statusDateGroupRight.appendChild(projectSelect);
    statusDateGroup.appendChild(statusDateGroupLeft);
    statusDateGroup.appendChild(statusDateGroupRight);
    titlePrioGroupLeft.appendChild(taskTitle);
    prioLabel.appendChild(prioIcon);
    titlePrioGroupRight.appendChild(prioLabel);
    titlePrioGroupRight.appendChild(select);
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
  displayMessage(section, message) {
    section.textContent = "";
    const msg = this.doc.createElement("p");
    msg.textContent = message;
    section.appendChild(msg);
  }

  // Task Events
  bindEventsTaskForm(deleteBtn, cancelBtn, confirmBtn, task, inputs) {
    deleteBtn.addEventListener("click", (event) =>
      this.deleteSelectedTask(event, task)
    );
    cancelBtn.addEventListener("click", (event) => this.closeTaskDialog(event));
    confirmBtn.addEventListener("click", (event) =>
      this.updateSelectedTask(event, task, this.parseTaskFormInputs(inputs))
    );
  }

  deleteSelectedTask(event, task) {
    event.preventDefault();

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

    task.updateTask(values);
    const choosenProject = this.todoApp.getProject(values.projectId);
    this.selectProject(choosenProject);
    this.selectTask(task);

    this.taskForm.close();
  }

  parseTaskFormInputs(inputs) {
    return {
      dueDate: inputs.dueDate.value,
      title: inputs.taskTitle.value,
      desc: inputs.taskDesc.value,
      priority: parseInt(inputs.select.value),
      projectId: parseInt(inputs.projectSelect.value),
    };
  }

  createTaskForm(event) {
    const newTask = this.todoApp.createTodo();
    newTask.assignToProject(this.selectedProject.id);

    // this.selectTask(newTask);
    this.buildTaskForm(newTask, ScreenController.FORM_CREATE_MODE);
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

    project.update(values);
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
