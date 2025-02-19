import { Task } from "./task.js";
import { Project } from "./project.js";
import { Storage } from "./storage.js";
import { parseISO, compareDesc, isToday } from "date-fns";

export { Task, Project };

export function TodoApp(doc) {
  let user;
  let tasks = [];
  let projects = [];
  let lists = [];
  let DEFAULT_PROJECT_ID = 0;
  const taskMenu = {
    title: "Tasks",
    items: ["Add task", "All", "Today", "Next 7 days"],
    icons: [
      "fi fi-sr-square-plus",
      "fi fi-rr-folder",
      "fi fi-rr-challenge",
      "fi fi-rr-calendar",
    ],
  };
  const projectMenu = { title: "Projects", icons: ["fi fi-rr-folder"] };
  const storage = new Storage();

  const init = () => {
    // storage.clear();
    if (storage.length === 0) {
      createDefaultLists();
      loadListData();
      loadDefaultData();
    } else {
      loadStorageData();
    }
    sortTasks();
    sortProjects();
    sortLists();
  };

  const getUser = () => user;
  const getTaskMenu = () => taskMenu;
  const getProjectMenu = () => projectMenu;

  // Create and store task
  const createTask = (
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
    sortTasks();
    storage.setTask(task);
    return task;
  };

  const updateTask = (task, values) => {
    task.updateTask(values);
    updateSorting(task, values);
    storage.setTask(task);
  };

  const switchTaskStatus = (task) => {
    task.switchStatus();
    storage.setTask(task);
  };

  const updateSorting = (task, newValue) => {
    if (parseISO(task.dueDate) !== parseISO(newValue.dueDate)) {
      sortTasks();
    }
  };

  const showTasks = () => {
    console.log("Tasks:");
    for (const task of tasks) {
      task.logSummary();
    }
  };

  const sortTasks = () => {
    // sort desc by date and then by id
    tasks.sort((a, b) => {
      const compare = compareDesc(parseISO(a.dueDate), parseISO(b.dueDate));
      if (compare !== 0) {
        return compare;
      }
      return b.taskId - a.taskId;
    });
  };

  const getTask = (id) => {
    const task = tasks.filter((task) => task.taskId === id)[0];
    if (!task) {
      return null;
    }
    return task;
  };

  const getTaskByIndex = (index) => tasks[index];

  const addTaskToProject = (task, project) => {
    if (task && project) {
      task.assignToProject(project.id);
    }
  };

  const deleteTask = (taskId) => {
    const index = tasks.findIndex((task) => task.taskId === taskId);
    if (index >= 0) {
      tasks.splice(index, 1);
      storage.removeTask(taskId);
    }
  };

  const getProjectTasks = (projectId) =>
    tasks.filter((task) => task.projectId === projectId);

  const getTodayTasks = () =>
    tasks.filter((task) => isToday(parseISO(task.dueDate)));

  const getTasksDueKDays = (k) => tasks.filter((task) => task.isDueKDays(k));
  // Projects
  const createProject = (name, desc) => {
    const project = new Project(name, desc);
    projects.push(project);
    storage.setProject(project);
    return project;
  };

  const updateProject = (project, values) => {
    project.update(values);
    storage.setProject(project);
  };
  const isProject = (value) => value instanceof Project;

  const getAllProjects = () => projects;

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

  const sortProjects = () => {
    projects.sort((a, b) => a.id - b.id);
  };

  const getProject = (id) => {
    const project = projects.filter((project) => project.id === id)[0];
    return project || null;
  };

  const getProjectByIndex = (index) => projects[index];

  const getDefaultProject = () => getProject(DEFAULT_PROJECT_ID);

  const removeProject = (projectId) => {
    const index = projects.findIndex((project) => project.id === projectId);
    if (index >= 0) {
      projects.splice(index, 1);
      storage.removeProject(projectId);
      return true;
    } else {
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
      const taskIdsToRemove = tasks.filter(
        (task) => task.projectId === projectId
      );
      taskIdsToRemove.forEach((task) => storage.removeTask(task.taskId));
      tasks = filteredTasks;
    }
  };

  const getList = (index) => {
    if (index >= 0 && index < lists.length) {
      return lists[index];
    }
    return null;
  };
  const getListTasks = (listId) => {
    let listTasks = [];

    if (listId === "L-0") {
      listTasks = tasks;
    } else if (listId === "L-1") {
      listTasks = getTodayTasks();
    } else if (listId === "L-2") {
      listTasks = getTasksDueKDays(7);
    }
    return listTasks;
  };

  const createList = (id, name, desc) => {
    const list = { id, name, desc };
    lists.push(list);
    storage.setList(list);
  };

  const createDefaultLists = () => {
    createList("L-0", "All", "All your tasks in one place");
    createList("L-1", "Today", "Make the most of this day");
    createList("L-2", "Next 7 days", "A look into your week");
  };

  const sortLists = () => {
    lists.sort((a, b) => a.id.substr(2) - b.id.substr(2));
  };

  // Storage
  const loadStorageData = () => {
    tasks = storage.retrieveTasks();
    projects = storage.retrieveProjects();
    lists = storage.retrieveLists();
    Task.setNextId(storage.getNextTaskId());
    Project.setNextId(storage.getNextProjectId());
  };

  const loadDefaultData = () => {
    createTask(
      "Grocery Shopping",
      "Buy vegetables, fruits, milk, and other household essentials.",
      "2025-02-05",
      1,
      0,
      0,
      []
    );
    createTask(
      "Finish Project Report",
      "Complete and submit the quarterly project report for review.",
      "2025-02-06",
      2,
      1,
      0,
      []
    );
    createTask(
      "Doctor's Appointment",
      "Visit the doctor for a routine health check-up.",
      "2025-02-07",
      1,
      0,
      1,
      []
    );
    createTask(
      "Workout Session",
      "Attend the scheduled gym session for strength training.",
      "2025-02-08",
      0,
      2,
      1,
      []
    );
    createTask(
      "Prepare Presentation",
      "Create slides for the upcoming team meeting.",
      "2025-02-09",
      2,
      1,
      1,
      []
    );
    createTask(
      "Car Maintenance",
      "Take the car for an oil change and tire rotation.",
      "2025-02-10",
      1,
      0,
      2,
      []
    );
    createTask(
      "Pay Utility Bills",
      "Clear electricity, water, and internet bills before the deadline.",
      "2025-02-11",
      3,
      1,
      2,
      []
    );
    createTask(
      "Read a Book",
      "Finish reading the current novel and start a new one.",
      "2025-02-12",
      0,
      2,
      3,
      []
    );
    createTask(
      "Weekend Trip Planning",
      "Plan the itinerary and book accommodations for the weekend trip.",
      "2025-02-13",
      3,
      0,
      3,
      []
    );

    createProject("Personal", "Add your personal projects here.");
    createProject("Work", "All things related to work");
    createProject("University", "For my classses");
    createProject("Fun", "Anything related to fun activities!");

    showTasks();
    showProjectsDetail();
  };

  return {
    init,
    createTask,
    showTasks,
    getUser,
    getTaskByIndex,
    getTask,
    getTaskMenu,
    getProjectMenu,
    getProjectTasks,
    getTodayTasks,
    deleteTask,
    updateTask,
    switchTaskStatus,
    getProject,
    isProject,
    getDefaultProject,
    getAllProjects,
    deleteProject,
    deleteProjectWithTasks,
    createProject,
    updateProject,
    showProjects,
    showProjectsDetail,
    addTaskToProject,
    getList,
    getListTasks,
  };
}

const app = TodoApp();
