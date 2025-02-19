import { Task } from "./task.js";
import { Project } from "./project.js";

export class Storage {
  static #TASK_PREFIX = "T";
  static #PROJECT_PREFIX = "P";
  static #LIST_PREFIX = "L";

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

  setList(list) {
    this.storage.setItem(list.id, JSON.stringify(list));
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

  retrieveLists() {
    const lists = [];
    for (const [key, item] of Object.entries(this.storage)) {
      if (this.#itemIsList(key)) {
        lists.push(JSON.parse(item));
      }
    }
    return lists;
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

  #itemIsList(key) {
    return key[0] === Storage.#LIST_PREFIX;
  }
}
