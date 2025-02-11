import { format, parseISO } from "date-fns";
export class Task {
  static #id = 0;
  static priority = ["None", "Low", "Medium", "High"];
  static DEFAULT_PROJECT = 0;
  static DEFAULT_PRIO = 0;
  #projectId;
  #taskId;
  #dueDate;
  #priority;

  constructor(title, desc, dueDate, priority, status, projectId, checklist) {
    this.title = title || "";
    this.desc = desc || "";
    this.dueDate = dueDate;
    this.priority = priority;
    this.status = status || 0;
    this.projectId = projectId;
    this.checklist = checklist || [];

    Task.#assignTaskId(this);
  }

  static #assignTaskId(task) {
    task.#taskId = Task.#id;
    Task.#id++;
  }

  assignToProject(projectId) {
    this.#projectId = projectId;
  }

  markComplete() {
    this.status = 1;
  }

  changePriority(priority) {
    this.priority = priority;
  }

  updateTask(values) {
    this.title = values.title || "Task";
    this.desc = values.desc;
    this.dueDate = values.dueDate;
    this.priority = values.priority;
    this.assignToProject(values.projectId);
  }

  // settters
  set dueDate(date) {
    const isoDate = parseISO(date || new Date(Date.now()).toISOString());
    this.#dueDate = format(isoDate, "yyyy-MM-dd");
  }

  set priority(value) {
    if (value && value >= 0 && value < Task.priority.length) {
      this.#priority = value;
    } else {
      this.#priority = Task.DEFAULT_PRIO;
    }
  }

  set projectId(id) {
    this.#projectId = id || Task.DEFAULT_PROJECT;
  }

  // getters
  get dueDate() {
    return this.#dueDate;
  }

  get priority() {
    return this.#priority;
  }

  get taskId() {
    return this.#taskId;
  }

  get projectId() {
    return this.#projectId;
  }

  // console
  log() {
    console.log(this);
  }

  logSummary() {
    console.log(` - ${this.#taskId} ${this.title} - ${this.dueDate}`);
  }
}
