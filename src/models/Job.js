/**
 * Job model representing a job vacancy
 */
export default class Job {
  #dateOfAdding;
  #title;
  #companyName;
  #locations;
  #jobLink;
  #salary;

  /**
   * Create a new Job instance
   * @param {string} dateOfAdding Date when job was added
   * @param {string} title Job title
   * @param {string} companyName Company name
   * @param {string} locations Job locations
   * @param {string} jobLink Link to the job posting
   * @param {string} salary Job salary
   */
  constructor(dateOfAdding, title, companyName, locations, jobLink, salary) {
    this.#dateOfAdding = dateOfAdding || "";
    this.#title = title || "";
    this.#companyName = companyName || "";
    this.#locations = locations || "";
    this.#jobLink = jobLink || "";
    this.#salary = salary || "";
  }

  // Getters
  get dateOfAdding() {
    return this.#dateOfAdding;
  }
  get title() {
    return this.#title;
  }
  get companyName() {
    return this.#companyName;
  }
  get locations() {
    return this.#locations;
  }
  get jobLink() {
    return this.#jobLink;
  }
  get salary() {
    return this.#salary;
  }

  /**
   * Convert job to plain object
   * @returns {Object} Plain object representation of the job
   */
  toObject() {
    return {
      dateOfAdding: this.#dateOfAdding,
      title: this.#title,
      companyName: this.#companyName,
      locations: this.#locations,
      jobLink: this.#jobLink,
      salary: this.#salary,
    };
  }

  /**
   * Create a Job instance from a plain object
   * @param {Object} obj Plain object with job data
   * @returns {Job} New Job instance
   */
  static fromObject(obj) {
    return new Job(
      obj.dateOfAdding,
      obj.title,
      obj.companyName,
      obj.locations,
      obj.jobLink,
      obj.salary
    );
  }
}
