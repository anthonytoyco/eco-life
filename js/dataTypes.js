/**
 * Base class for all data types.
 */
export class BaseData {
  /**
   * Formats a date into a readable string (e.g., "February 1, 2025").
   * @param {Date} date - The date to format.
   * @returns {string} - The formatted date.
   */
  getFormattedDate(date) {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
}

export class EcoAction extends BaseData {
  /**
   * Creates a new EcoAction instance.
   * @param {Date|string} date - The date the action was logged.
   * @param {string} action - The description of the action.
   * @param {string} impact - The impact of the action.
   */
  constructor(date, action, impact) {
    super(); // Call the parent class constructor
    this.date = date instanceof Date ? date : new Date(date);
    this.action = action;
    this.impact = impact;
  }

  /**
   * Gets the formatted date for the eco action.
   * @returns {string} - The formatted date.
   */
  getFormattedDate() {
    return super.getFormattedDate(this.date);
  }
}

export class Challenge extends BaseData {
  /**
   * Creates a new Challenge instance.
   * @param {string} name - The name of the challenge.
   * @param {string} status - The status of the challenge (e.g., "Completed", "In Progress").
   * @param {string} reward - The reward for completing the challenge.
   * @param {Date|string} dateAchieved - The date the challenge was achieved.
   */
  constructor(name, status, reward, dateAchieved) {
    super();
    this.name = name;
    this.status = status;
    this.reward = reward;
    this.dateAchieved =
      dateAchieved instanceof Date ? dateAchieved : new Date(dateAchieved);
  }

  /**
   * Gets the formatted date for the challenge.
   * @returns {string} - The formatted date.
   */
  getFormattedDate() {
    return super.getFormattedDate(this.dateAchieved);
  }
}

export class Achievement extends BaseData {
  /**
   * Creates a new Achievement instance.
   * @param {string} badge - The badge associated with the achievement.
   * @param {string} description - The description of the achievement.
   * @param {Date|string} dateAchieved - The date the achievement was earned.
   */
  constructor(badge, description, dateAchieved) {
    super();
    this.badge = badge;
    this.description = description;
    this.dateAchieved =
      dateAchieved instanceof Date ? dateAchieved : new Date(dateAchieved);
  }

  /**
   * Gets the formatted date for the achievement.
   * @returns {string} - The formatted date.
   */
  getFormattedDate() {
    return super.getFormattedDate(this.dateAchieved);
  }
}

export class Friend extends BaseData {
  /**
   * Creates a new Friend instance.
   * @param {string} name - The name of the friend.
   * @param {number} points - The total eco-points of the friend.
   * @param {number} rank - The rank of the friend on the leaderboard.
   */
  constructor(name, points, rank) {
    super();
    this.name = name;
    this.points = points;
    this.rank = rank;
  }
}
