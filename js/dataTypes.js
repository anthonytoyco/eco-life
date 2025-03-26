"use strict";

import { UIManager } from "./uiManager.js";
import { User } from "./userData.js";

export class EcoAction {
  /**
   * Creates a new EcoAction instance.
   * @param {Date|string} createdDate - The date the action was created.
   * @param {Date|string} date - The date the action was logged.
   * @param {string} action - The description of the action.
   * @param {string} impact - The impact of the action.
   */
  constructor(createdDate = new Date(), date, action, impact) {
    this.createdDate =
      createdDate instanceof Date ? createdDate : new Date(createdDate);
    this.date = date instanceof Date ? date : new Date(date);
    this.action = action;
    this.impact = impact;
  }

  /**
   * Updates the user's ecoPoints based on the modification of ecoActions.
   * @param {number} change - The change in the number of ecoActions (positive for addition, negative for deletion).
   */
  static updateEcoPoints(change) {
    const userData = User.getUser();

    // Update the user's ecoPoints
    userData.ecoPoints = (userData.ecoPoints || 0) + change * 5;

    // Ensure ecoPoints do not go below zero
    if (userData.ecoPoints < 0) {
      userData.ecoPoints = 0;
    }

    // Save the updated user data back to localStorage
    User.updateUser(userData);

    console.log(`User's ecoPoints updated to: ${userData.ecoPoints}`);
  }

  /**
   * Adds an eco action to the user's data.
   * @param {HTMLElement} form - The form element containing eco action input.
   */
  static add(form) {
    const date = form.querySelector("input[name='log-date-input']").value;
    const action = form
      .querySelector("input[name='log-action-input']")
      .value.trim();
    const impact = form
      .querySelector("input[name='log-impact-input']")
      .value.trim();

    const userData = User.getUser();

    // Create a new EcoAction instance with the current date as createdDate
    const ecoAction = new EcoAction(new Date(), new Date(date), action, impact);

    // Add the eco action to the user's data
    userData.ecoData.ecoActions = userData.ecoData.ecoActions || [];
    userData.ecoData.ecoActions.push(ecoAction);

    // Save the updated user data back to localStorage
    User.updateUser(userData);

    // Update ecoPoints
    EcoAction.updateEcoPoints(1);

    // Refresh the UI
    UIManager.update();

    alert("Eco action added successfully!");
  }

  /**
   * Deletes an EcoAction from the user's data and updates the table.
   * @param {number} index - The index of the EcoAction to delete.
   */
  static delete(index) {
    const userData = User.getUser();

    if (!userData || !userData.ecoData.ecoActions) {
      console.warn("No EcoActions found for the user.");
      return;
    }

    // Remove the EcoAction at the specified index
    userData.ecoData.ecoActions.splice(index, 1);

    // Save the updated user data back to localStorage
    User.updateUser(userData);

    // Update ecoPoints
    EcoAction.updateEcoPoints(-1);

    // Refresh the UI
    UIManager.update();

    alert("Eco action deleted successfully!");
  }
}

export class Challenge {
  /**
   * Creates a new Challenge instance.
   * @param {string} name - The name of the challenge.
   * @param {string} status - The status of the challenge (e.g., "Completed", "In Progress").
   * @param {string} reward - The reward for completing the challenge.
   * @param {Date|string} dateAchieved - The date the challenge was achieved.
   */
  constructor(name, status, reward, dateAchieved) {
    this.name = name;
    this.status = status;
    this.reward = reward;
    this.dateAchieved =
      dateAchieved instanceof Date ? dateAchieved : new Date(dateAchieved);
  }
}

export class Achievement {
  /**
   * Creates a new Achievement instance.
   * @param {string} badge - The badge associated with the achievement.
   * @param {string} description - The description of the achievement.
   * @param {Date|string} dateAchieved - The date the achievement was earned.
   */
  constructor(badge, description, dateAchieved) {
    this.badge = badge;
    this.description = description;
    this.dateAchieved =
      dateAchieved instanceof Date ? dateAchieved : new Date(dateAchieved);
  }
}

export class Friend {
  /**
   * Creates a new Friend instance.
   * @param {string} name - The name of the friend.
   * @param {number} points - The total ecoPoints of the friend.
   * @param {number} rank - The rank of the friend on the leaderboard.
   */
  constructor(name, points, rank) {
    this.name = name;
    this.points = points;
    this.rank = rank;
  }
}
