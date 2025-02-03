import { Task } from "./task.js";
import { Project } from "./project.js";
export function TodoApp() {
  let user;
  let tasks = [];
  let projects = [];
  let DEFAULT_PROJECT_ID;
  const taskMenu = { title: "Tasks", items: ["All", "Today", "Next 7 days"] };
  const projectMenu = { title: "Projects" };

  const initApp = (name) => {
    user = name;
    // add default project
    const defaultProject = new Project(
      "Personal",
      "Add your personal projects here."
    );
    projects.push(defaultProject);
    DEFAULT_PROJECT_ID = defaultProject.getId();
  };

  const getTaskMenu = () => taskMenu;
  const getProjectMenu = () => projectMenu;

  //   Tasks
  const createTodo = (
    name,
    desc,
    dueDate,
    priority,
    status,
    projectId,
    checklist
  ) => {
    const task = new Task(
      name,
      desc,
      dueDate,
      priority,
      status,
      projectId,
      checklist
    );
    tasks.push(task);
  };

  const showTasks = () => {
    console.log("Tasks:");
    for (const task of tasks) {
      task.logSummary();
    }
  };

  const getTaskByIndex = (index) => tasks[index];

  const getProjectTasks = (projectId) =>
    tasks.filter((task) => task.getProjectId() === projectId);

  const getTask = (id) => {
    const task = tasks.filter((task) => task.getId() === id)[0];
    if (!task) {
      console.log("Task id not found");
    }
    return task;
  };

  const addTaskToProject = (task, project) => {
    if (task && project) {
      task.assignToProject(project.getId());
    } else {
      console.log("Task or project is null");
    }
  };

  const deleteTask = (taskId) => {
    const index = tasks.findIndex((task) => task.getId() === taskId);
    if (index >= 0) {
      tasks.splice(index, 1);
    } else {
      console.log(" ! Task id not found!");
    }
  };

  // Projects
  const getAllProjects = () => projects;
  const createProject = (name) => {
    const project = new Project(name);
    projects.push(project);
  };

  const getProjectByIndex = (index) => projects[index];

  const getProject = (id) => {
    const project = projects.filter((project) => project.getId() === id)[0];
    if (!project) {
      console.log("no project id found");
    }
    return project || {};
  };

  const removeProject = (projectId) => {
    const index = projects.findIndex(
      (project) => project.getId() === projectId
    );
    if (index >= 0) {
      projects.splice(index, 1);
      return true;
    } else {
      console.log(" ! Project id not found!");
      return false;
    }
  };

  const deleteProject = (projectId) => {
    // reassigning tasks to default project
    if (removeProject(projectId)) {
      tasks.forEach((task) => {
        if (task.getProjectId() === projectId) {
          task.assignToProject(DEFAULT_PROJECT_ID);
        }
      });
    }
  };

  const deleteProjectWithTasks = (projectId) => {
    if (removeProject(projectId)) {
      const filteredTasks = tasks.filter(
        (task) => task.getProjectId() !== projectId
      );
      tasks = filteredTasks;
    }
  };

  const showProjects = () => {
    console.log("Showing projects:");
    for (const project of projects) {
      project.log();
    }
  };

  const showProjectsDetail = () => {
    console.log("----------------------------");
    console.log("Showing projects w/ details:");
    for (const project of projects) {
      project.logFormatted();
      showProjectTasks(project.getId());
    }
  };

  const showProjectTasks = (projectId) => {
    for (const task of tasks) {
      if (task.getProjectId() === projectId) {
        task.logSummary();
      }
    }
  };

  const loadData = () => {
    initApp("user");
    createTodo("read1");
    createTodo("read2");
    createTodo("read3");
    createTodo("read4");
    createTodo("read5");
    createTodo("read6");
    createTodo("read7");
    createProject("Pr2");
    createProject("Project3");
    getTask(4).assignToProject(2);
    getTask(5).assignToProject(2);
    getTask(6).assignToProject(2);
    createTodo("go out", "", "", 0, 0, 1, []);

    getTaskByIndex(1).assignToProject(1);
    getTaskByIndex(2).assignToProject(1);
    showProjectsDetail();

    addTaskToProject(getTaskByIndex(3), getProject(0));
    addTaskToProject(getTask(8), getProject(0));

    showProjectsDetail();
    // deleteProjectWithTasks(2);
    showProjectsDetail();
  };
  return {
    loadData,
    initApp,
    createTodo,
    showTasks,
    getTaskByIndex,
    getTask,
    getTaskMenu,
    getProjectMenu,
    getProjectTasks,
    deleteTask,
    getProject,
    getAllProjects,
    deleteProject,
    deleteProjectWithTasks,
    createProject,
    showProjects,
    showProjectsDetail,
    addTaskToProject,
  };
}

const app = TodoApp();
