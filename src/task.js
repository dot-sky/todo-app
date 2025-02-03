import { format } from "date-fns";
export class Task {
  static #id = 0;
  #projectId;
  #taskId;
  constructor(title, desc, dueDate, priority, status, projectId, checklist) {
    this.title = title || "";
    this.desc = desc || "";
    this.dueDate = this.setDueDate(dueDate);
    this.priority = priority || 0;
    this.status = status || 0;
    this.#projectId = projectId || 0;
    this.checklist = checklist || [];

    this.#taskId = Task.#assignId();
  }

  static #assignId() {
    return Task.#id++;
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

  // settters
  setDueDate(date) {
    return format(date || Date(Date.now()), "yyyy-MM-dd");
  }

  // getters
  getId() {
    return this.#taskId;
  }

  getProjectId() {
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
