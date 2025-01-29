import "./style.css";
import { Task } from "./task.js";
import { Project } from "./project.js";
function ConsoleController() {
  let user;
  const tasks = [];
  const projects = [];

  const initController = (name) => {
    user = name;
    projects.push(new Project("Personal"));
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
      task.log();
    }
  };

  const getTask = (index) => tasks[index];

  // Projects
  const createProject = (name) => {
    const project = new Project(name);
    projects.push(project);
  };

  const showProjects = () => {
    console.log("Showing projects:");
    for (const project of projects) {
      project.log();
    }
  };

  const showProjectsDetail = () => {
    console.log("Showing projects w/ details:");
    for (const project of projects) {
      project.log();
      showTasksOfProject(project.getId());
    }
  };

  const showTasksOfProject = (projectId) => {
    for (const task of tasks) {
      if (task.getProjectId() === projectId) {
        task.log();
      }
    }
  };

  return {
    initController,
    createTodo,
    showTasks,
    getTask,
    createProject,
    showProjectsDetail,
  };
}

const app = ConsoleController();
app.initController("user");
app.createTodo("read1");
app.createTodo("read2");
app.createTodo("read3");
app.createProject("Pr2");
app.createTodo("go out", "", "", 0, 0, 1, []);

app.getTask(1).assignToProject(1);
app.getTask(2).assignToProject(1);
app.showProjectsDetail();
