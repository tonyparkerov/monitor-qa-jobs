/**
 * Job model representing a job vacancy
 */
export default class Job {
  constructor(dateOfAdding, title, companyName, locations, jobLink) {
    this.dateOfAdding = dateOfAdding;
    this.title = title;
    this.companyName = companyName;
    this.locations = locations;
    this.jobLink = jobLink;
  }
}