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

  // getters
  getId() {
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
