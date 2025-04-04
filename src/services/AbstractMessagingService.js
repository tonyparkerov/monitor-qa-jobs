/**
 * Abstract base class for messaging services
 * This defines the interface that all messaging services must implement
 */
export default class AbstractMessagingService {
  /**
   * Send a message
   * @param {string} message Message to send
   * @returns {Promise<any>} Promise that resolves when message is sent
   * @abstract
   */
  async sendMessage(message) {
    throw new Error("Method sendMessage() must be implemented");
  }

  /**
   * Initialize the messaging service
   * @returns {Promise<void>} Promise that resolves when service is initialized
   * @abstract
   */
  async initialize() {
    throw new Error("Method initialize() must be implemented");
  }

  /**
   * Check if the service is properly configured
   * @returns {boolean} True if service is configured
   * @abstract
   */
  isConfigured() {
    throw new Error("Method isConfigured() must be implemented");
  }
}
