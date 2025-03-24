"use strict";

import { EcoAction } from "./dataTypes.js";

export class UIManager {
  /**
   * Updates the HTML elements to reflect the logged-in state.
   * Fetches user data from localStorage.
   */
  static update() {
    // Retrieve user data from localStorage
    const userData = JSON.parse(localStorage.getItem("user"));

    if (userData) {
      // Update the greeting message
      this.updateElement("greeting", `<i>Hello, ${userData.name}</i>`);

      // Only runs in the profile page
      if (window.location.pathname.endsWith("profile.html")) {
        // Hide the login/signup forms
        this.hideElement("profile-auth-section");

        // Update the profile info section
        const profileInfo = document.getElementById("profile-info");
        profileInfo.style.display = "block";
        this.updateElement(
          "profile-info-start",
          `<p><strong>Created on:</strong> ${userData.createdDate}</p>`
        );
        this.updateElement(
          "profile-info-name",
          `<p><strong>Name:</strong> ${userData.name}</p>`
        );
        this.updateElement(
          "profile-info-email",
          `<p><strong>Email:</strong> ${userData.email}</p>`
        );
        this.updateElement(
          "profile-info-ecopoints",
          `<p><strong>Eco-Points:</strong> ${userData.ecopoints}</p>`
        );
      }

      // Update the EcoTracker table if on the ecotracker.html page
      if (window.location.pathname.endsWith("ecotracker.html")) {
        this.updateEcoTrackerTable(userData.data.ecoActions || []);
      }
    }
  }

  /**
   * Updates the EcoTracker table with the user's ecoActions.
   * @param {Array<Object>} ecoActions - The array of ecoActions to display.
   */
  static updateEcoTrackerTable(ecoActions) {
    const tableBody = document.getElementById("ecotracker-table-body");

    // Clear the table body
    tableBody.innerHTML = "";

    // Populate the table with ecoActions
    ecoActions.forEach((action, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${new Date(action.date).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}</td>
        <td>${action.action}</td>
        <td>${action.impact}</td>
        <td><button class="delete-button" data-index="${index}">Delete</button></td>
      `;

      // Add delete functionality to the button
      row.querySelector(".delete-button").addEventListener("click", () => {
        EcoAction.delete(index);
      });

      tableBody.appendChild(row);
    });
  }

  /**
   * Updates the innerHTML of an element by ID.
   * @param {string} elementId - The ID of the element to update.
   * @param {string} content - The content to set as innerHTML.
   */
  static updateElement(elementId, content) {
    const element = document.getElementById(elementId);
    if (element) {
      element.innerHTML = content;
    } else {
      console.warn(`Element with ID "${elementId}" not found.`);
    }
  }

  /**
   * Shows an element by ID.
   * @param {string} elementId - The ID of the element to show.
   */
  static showElement(elementId, displayValue = "block") {
    const element = document.getElementById(elementId);
    if (element) {
      element.style.display = displayValue;
    } else {
      console.warn(`Element with ID "${elementId}" not found.`);
    }
  }

  /**
   * Hides an element by ID.
   * @param {string} elementId - The ID of the element to hide.
   */
  static hideElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.style.display = "none";
    } else {
      console.warn(`Element with ID "${elementId}" not found.`);
    }
  }
}

window.UIManager = UIManager;
UIManager.update();
