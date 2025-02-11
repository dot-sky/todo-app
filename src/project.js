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
}
