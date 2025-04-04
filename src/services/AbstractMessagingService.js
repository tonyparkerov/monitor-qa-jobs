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
}
