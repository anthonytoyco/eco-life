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
    User.setUser(userData);

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
    if (userData) {
      // Create a new EcoAction instance with the current date as createdDate
      const ecoAction = new EcoAction(
        new Date(),
        new Date(date),
        action,
        impact
      );

      // Add the eco action to the user's data
      userData.ecoData.ecoActions = userData.ecoData.ecoActions || [];
      userData.ecoData.ecoActions.push(ecoAction);

      // Save the updated user data back to localStorage
      User.setUser(userData);

      // Update ecoPoints
      EcoAction.updateEcoPoints(1);

      // Refresh the UI
      UIManager.update();

      alert("Eco action added successfully!");
    } else {
      alert("You must be logged in to add an Eco-Action!");
    }
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
    User.setUser(userData);

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
   * @param {number} reward - The reward points for completing the challenge.
   * @param {string} status - The status of the challenge (default: "Not Started").
   * @param {Date|string|null} dateCompleted - The date the challenge was completed (default: null).
   */
  constructor(name, reward, status = "Not Started", dateCompleted = null) {
    this.name = name;
    this.reward = reward;
    this.status = status;
    this.dateCompleted =
      dateCompleted instanceof Date
        ? dateCompleted
        : dateCompleted
        ? new Date(dateCompleted)
        : null;
  }

  /**
   * Updates the status of the challenge.
   * If the status is set to "Completed," sets the dateCompleted to the current date.
   * Updates the user's ecoData and ecoPoints in localStorage.
   * @param {string} newStatus - The new status of the challenge.
   * @param {number} index - The index of the challenge in the user's ecoData.
   */
  static updateStatus(newStatus, index) {
    // Retrieve user data from localStorage
    const userData = JSON.parse(localStorage.getItem("user"));

    if (!userData || !userData.ecoData || !userData.ecoData.challenges) {
      console.error("User data or challenges not found in localStorage.");
      return;
    }

    const challenge = userData.ecoData.challenges[index];

    // Update the challenge status
    challenge.status = newStatus;

    if (newStatus === "Completed" && !challenge.dateCompleted) {
      challenge.dateCompleted = new Date();

      // Update ecoPoints
      userData.ecoPoints = (userData.ecoPoints || 0) + challenge.reward;
    } else if (newStatus !== "Completed") {
      challenge.dateCompleted = null;
    }

    // Save the updated user data back to localStorage
    localStorage.setItem("user", JSON.stringify(userData));

    console.log(
      `Challenge updated: ${challenge.name}. Status: ${challenge.status}. EcoPoints: ${userData.ecoPoints}`
    );
  }
}

export class Achievement {
  /**
   * Creates a new Achievement instance.
   * @param {string} badge - The badge associated with the achievement.
   * @param {string} description - The description of the achievement.
   * @param {boolean} completed - Whether the achievement is completed (default: false).
   */
  constructor(badge, description, completed = false) {
    this.badge = badge;
    this.description = description;
    this.completed = completed;
  }
}
