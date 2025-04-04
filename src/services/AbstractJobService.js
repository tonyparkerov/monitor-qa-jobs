/**
 * Abstract base class for job services
 * This defines the interface that all job services must implement
 */
export default class AbstractJobService {
  /**
   * Get jobs from the source
   * @returns {Promise<Array>} List of job objects
   * @abstract
   */
  async getJobs() {
    throw new Error("Method getJobs() must be implemented");
  }
}
