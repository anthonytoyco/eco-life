"use strict";

/**
 * Represents the user's data.
 * - User is not logged in? UserData.active is false.
 * - User is logged in? UserData.active is true, object is filled with JSON data.
 */
class User {
  /**
   * @type {string}
   */
  isActive;
  /**
   * @type {Date}
   */
  createdDate;
  /**
   * @type {string}
   */
  email;
  /**
   * @type {string}
   * */
  name;

  /**
   * @type {EcoAction[]}
   */
  ecoActions;
  /**
   * @type {Challenge[]}
   */
  challenges;
  /**
   * @type {Achievements[]}
   */
  achievements;
  /**
   * @type {Friend[]}
   */
  friends;

  constructor() {
    this.isActive = false;
  }
}
