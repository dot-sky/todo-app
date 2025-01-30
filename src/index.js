import "./style.css";
import { Task } from "./task.js";
import { Project } from "./project.js";
function TodoApp() {
  let user;
  let tasks = [];
  let projects = [];
  let DEFAULT_PROJECT_ID;
  const initApp = (name) => {
    user = name;
    // add default project
    const defaultProject = new Project("Personal");
    projects.push(defaultProject);
    DEFAULT_PROJECT_ID = defaultProject.getId();
  };
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
    console.log("Showing tasks:");
    for (const task of tasks) {
      task.logSummary();
    }
  };

  const getTask = (index) => tasks[index];

  const getTaskById = (id) => {
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
  const createProject = (name) => {
    const project = new Project(name);
    projects.push(project);
  };

  const getProject = (index) => projects[index];

  const getProjectById = (id) => {
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

  return {
    initApp,
    createTodo,
    showTasks,
    getTask,
    getTaskById,
    deleteTask,
    getProject,
    deleteProject,
    deleteProjectWithTasks,
    createProject,
    showProjectsDetail,
    addTaskToProject,
  };
}

const app = TodoApp();
app.initApp("user");
app.createTodo("read1");
app.createTodo("read2");
app.createTodo("read3");
app.createTodo("read4");
app.createTodo("read5");
app.createTodo("read6");
app.createTodo("read7");
app.createProject("Pr2");
app.createProject("Project3");
app.getTaskById(4).assignToProject(2);
app.getTaskById(5).assignToProject(2);
app.getTaskById(6).assignToProject(2);
app.createTodo("go out", "", "", 0, 0, 1, []);

app.getTask(1).assignToProject(1);
app.getTask(2).assignToProject(1);
app.showProjectsDetail();

app.addTaskToProject(app.getTask(3), app.getProject(0));
app.addTaskToProject(app.getTaskById(8), app.getProject(0));

app.showProjectsDetail();
app.deleteProjectWithTasks(2);
app.showProjectsDetail();
