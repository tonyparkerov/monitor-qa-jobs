export default class Job {
  dateOfAdding: string;
  title: string;
  companyName: string;
  locations: string;
  jobLink: string;
  salary: string;

  constructor(
    dateOfAdding: string,
    title: string,
    companyName: string,
    locations: string,
    jobLink: string,
    salary: string
  ) {
    this.dateOfAdding = dateOfAdding || "";
    this.title = title || "";
    this.companyName = companyName || "";
    this.locations = locations || "";
    this.jobLink = jobLink || "";
    this.salary = salary || "";
  }
}
