export class Project {
  static #id = 0;
  #projectId;
  constructor(name, desc) {
    this.name = name || "";
    this.desc = desc || "";

    Project.#assignId(this);
  }

  static #assignId(project) {
    project.#projectId = Project.#id;
    Project.#id++;
  }
  update(values) {
    this.name = values.name || "Project";
    this.desc = values.desc;
  }
  // getters
  get id() {
    return this.#projectId;
  }

  // console
  log() {
    console.log(this);
  }

  logFormatted() {
    console.log(`PId:${this.#projectId} ${this.name}: ${this.desc}`);
  }

  // Storage
  restoreObject(values) {
    Project.#decreaseId(); // original project id can be reused
    this.#projectId = values.projectId;

    this.name = values.name || "Project";
    this.desc = values.desc;
  }

  static #decreaseId() {
    Project.#id--;
  }

  static nextId(id) {
    return Project.#id;
  }

  static setNextId(id) {
    Project.#id = id;
  }

  stringify() {
    const values = {
      projectId: this.id,
      name: this.name,
      desc: this.desc,
    };
    return JSON.stringify(values);
  }
}
