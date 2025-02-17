import { Task } from "./task.js";
import { Project } from "./project.js";
import { parseISO } from "date-fns";

export class Storage {
  static #TASK_PREFIX = "T";
  static #PROJECT_PREFIX = "P";

  constructor() {
    this.storage = localStorage;
  }

  get length() {
    return this.storage.length;
  }

  clear() {
    this.storage.clear();
  }

  setTask(task) {
    this.storage.setItem(Storage.#TASK_PREFIX + task.taskId, task.stringify());
    this.setNextTaskId();
  }

  setProject(project) {
    this.storage.setItem(
      Storage.#PROJECT_PREFIX + project.id,
      project.stringify()
    );
    this.setNextProjectId();
  }

  removeTask(id) {
    this.storage.removeItem(Storage.#TASK_PREFIX + id);
  }

  removeProject(id) {
    this.storage.removeItem(Storage.#PROJECT_PREFIX + id);
  }

  retrieveTasks() {
    const tasks = [];
    for (const [key, item] of Object.entries(this.storage)) {
      if (this.#itemIsTask(key)) {
        const storedValues = JSON.parse(item);
        const task = new Task();
        task.restoreObject(storedValues);
        tasks.push(task);
      }
    }
    return tasks;
  }

  retrieveProjects() {
    const projects = [];
    for (const [key, item] of Object.entries(this.storage)) {
      if (this.#itemIsProject(key)) {
        const storedValues = JSON.parse(item);
        const project = new Project();
        project.restoreObject(storedValues);
        projects.push(project);
      }
    }
    return projects;
  }

  setNextTaskId() {
    this.storage.setItem("ID-" + Storage.#TASK_PREFIX, Task.nextId());
  }

  getNextTaskId() {
    const nextId = JSON.parse(
      this.storage.getItem("ID-" + Storage.#TASK_PREFIX)
    );
    return nextId;
  }

  setNextProjectId() {
    this.storage.setItem("ID-" + Storage.#PROJECT_PREFIX, Project.nextId());
  }

  getNextProjectId() {
    const nextId = JSON.parse(
      this.storage.getItem("ID-" + Storage.#PROJECT_PREFIX)
    );
    return nextId;
  }

  #itemIsTask(key) {
    return key[0] === Storage.#TASK_PREFIX;
  }

  #itemIsProject(key) {
    return key[0] === Storage.#PROJECT_PREFIX;
  }
}
