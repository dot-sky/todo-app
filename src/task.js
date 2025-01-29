import { format } from "date-fns";
export class Task {
  static #id = 0;
  #projectId;
  constructor(title, desc, dueDate, priority, status, projectId, checklist) {
    this.title = title || "";
    this.desc = desc || "";
    this.dueDate = this.#formatDate(dueDate);
    this.priority = priority || 0;
    this.status = status || 0;
    this.#projectId = projectId || 0;
    this.checklist = checklist || [];

    this.taskId = Task.#assignId();
  }

  #formatDate(date) {
    return format(date || Date(Date.now()), "yyyy-MM-dd");
  }

  static #assignId() {
    return Task.#id++;
  }

  assignToProject(projectId) {
    this.#projectId = projectId;
  }

  getProjectId() {
    return this.#projectId;
  }

  log() {
    console.log(this);
  }
}
