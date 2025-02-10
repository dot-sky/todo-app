import { Task } from "./task.js";
import { Project } from "./project.js";
export { Task, Project };
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
    DEFAULT_PROJECT_ID = defaultProject.id;
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
    return task;
  };

  const showTasks = () => {
    console.log("Tasks:");
    for (const task of tasks) {
      task.logSummary();
    }
  };

  const getTaskByIndex = (index) => tasks[index];

  const getProjectTasks = (projectId) =>
    tasks.filter((task) => task.projectId === projectId);

  const getTask = (id) => {
    const task = tasks.filter((task) => task.taskId === id)[0];
    if (!task) {
      console.log("Task id not found");
    }
    return task;
  };

  const addTaskToProject = (task, project) => {
    if (task && project) {
      task.assignToProject(project.id);
    } else {
      console.log("Task or project is null");
    }
  };

  const deleteTask = (taskId) => {
    const index = tasks.findIndex((task) => task.taskId === taskId);
    if (index >= 0) {
      tasks.splice(index, 1);
    } else {
      console.log(" ! Task id not found!");
    }
  };

  // Projects
  const getAllProjects = () => projects;
  const createProject = (name, desc) => {
    const project = new Project(name, desc);
    projects.push(project);
    return project;
  };

  const getProjectByIndex = (index) => projects[index];

  const getProject = (id) => {
    const project = projects.filter((project) => project.id === id)[0];
    if (!project) {
      console.log("no project id found");
    }
    return project || {};
  };

  const getDefaultProject = () => getProject(DEFAULT_PROJECT_ID);

  const removeProject = (projectId) => {
    const index = projects.findIndex((project) => project.id === projectId);
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
        if (task.projectId === projectId) {
          task.assignToProject(DEFAULT_PROJECT_ID);
        }
      });
    }
  };

  const deleteProjectWithTasks = (projectId) => {
    if (removeProject(projectId)) {
      const filteredTasks = tasks.filter(
        (task) => task.projectId !== projectId
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
      showProjectTasks(project.id);
    }
  };

  const showProjectTasks = (projectId) => {
    for (const task of tasks) {
      if (task.projectId === projectId) {
        task.logSummary();
      }
    }
  };

  const loadData = () => {
    initApp("user");
    createTodo(
      "Grocery Shopping",
      "Buy vegetables, fruits, milk, and other household essentials.",
      "2025-02-05",
      1,
      0,
      0,
      []
    );
    createTodo(
      "Finish Project Report",
      "Complete and submit the quarterly project report for review.",
      "2025-02-06",
      2,
      1,
      0,
      []
    );
    createTodo(
      "Doctor's Appointment",
      "Visit the doctor for a routine health check-up.",
      "2025-02-07",
      1,
      0,
      0,
      []
    );
    createTodo(
      "Workout Session",
      "Attend the scheduled gym session for strength training.",
      "2025-02-08",
      0,
      2,
      0,
      []
    );
    createTodo(
      "Prepare Presentation",
      "Create slides for the upcoming team meeting.",
      "2025-02-09",
      2,
      1,
      0,
      []
    );
    createTodo(
      "Car Maintenance",
      "Take the car for an oil change and tire rotation.",
      "2025-02-10",
      1,
      0,
      0,
      []
    );
    createTodo(
      "Pay Utility Bills",
      "Clear electricity, water, and internet bills before the deadline.",
      "2025-02-11",
      3,
      1,
      0,
      []
    );
    createTodo(
      "Read a Book",
      "Finish reading the current novel and start a new one.",
      "2025-02-12",
      0,
      2,
      0,
      []
    );
    createTodo(
      "Weekend Trip Planning",
      "Plan the itinerary and book accommodations for the weekend trip.",
      "2025-02-13",
      2,
      0,
      0,
      []
    );
    createProject("Work", "All things related to work");
    createProject("University", "For my classses");
    createProject("Fun", "Anything related to fun activities!");
    showTasks();
    getTask(3).assignToProject(1);
    getTask(4).assignToProject(1);
    getTask(5).assignToProject(1);
    getTask(6).assignToProject(2);
    getTask(7).assignToProject(2);
    getTask(8).assignToProject(3);
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
    getDefaultProject,
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
