export class Project {
  static #id = 0;
  #projectId;
  constructor(name, desc) {
    this.name = name || "";
    this.desc = desc || "";
    this.#projectId = Project.#assignId();
  }

  static #assignId() {
    return Project.#id++;
  }

  getId() {
    return this.#projectId;
  }

  log() {
    console.log(this);
  }
}
