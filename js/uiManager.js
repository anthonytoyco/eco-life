"use strict";

import { EcoAction } from "./dataTypes.js";
import { User } from "./userData.js";

export class UIManager {
  /**
   * Updates the HTML elements to reflect the logged-in state.
   * Fetches user data using the User class.
   */
  static update() {
    // Retrieve user data using the User class
    const userData = User.getUser();

    if (userData) {
      // Update the greeting message
      this.updateElement("greeting", `<i>Hello, ${userData.name}</i>`);

      // Animate the greeting
      this.animateGreeting();

      // Only runs in the profile page
      if (window.location.pathname.endsWith("profile.html")) {
        // Hide the auth forms
        this.hideElement("profile-auth-section");

        // Update the profile info section
        const profileInfo = document.getElementById("profile-info");
        profileInfo.style.display = "block";

        // Format the createdDate to include both date and time
        const createdDate = new Date(userData.createdDate).toLocaleString(
          "en-US",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true, // Use 12-hour format
          }
        );

        this.updateElement(
          "profile-info-start",
          `<p><strong>Created on:</strong> ${createdDate}</p>`
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
          `<p><strong>Eco-Points:</strong> ${userData.ecoPoints}</p>`
        );
      }

      // Update the EcoTracker table if on the ecotracker.html page
      if (window.location.pathname.endsWith("ecotracker.html")) {
        this.updateEcoTrackerTable(userData.ecoData.ecoActions || []);
      }
    }
  }

  /**
   * Animates the greeting text by scrolling it horizontally.
   */
  static animateGreeting() {
    const greetingElement = document.getElementById("greeting");
    if (!greetingElement) {
      console.warn("Greeting element not found.");
      return;
    }

    let position = 0;
    const text = greetingElement.innerText + "      ";
    const scrollSpeed = 150;

    setInterval(() => {
      position = (position + 1) % text.length;
      greetingElement.innerText =
        text.slice(position) + text.slice(0, position);
    }, scrollSpeed);
  }

  /**
   * Updates the EcoTracker table with the user's ecoActions.
   * @param {Array<Object>} ecoActions - The array of ecoActions to display.
   */
  static updateEcoTrackerTable(ecoActions) {
    const tableBody = document.getElementById("ecotracker-table-body");

    // Clear the table body
    tableBody.innerHTML = "";

    if (ecoActions.length === 0) {
      // Add a row that spans all columns if there are no ecoActions
      const emptyRow = document.createElement("tr");
      const columnCount = document
        .getElementById("ecotracker-table")
        .querySelectorAll("thead th").length;

      emptyRow.innerHTML = `
        <td colspan="${columnCount}" class="empty-row">
          Add some Eco-Actions!
        </td>
      `;
      tableBody.appendChild(emptyRow);
    } else {
      // Populate the table with ecoActions
      ecoActions.forEach((ecoAction, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${new Date(ecoAction.createdDate).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}</td>
          <td>${new Date(ecoAction.date).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}</td>
          <td>${ecoAction.action}</td>
          <td>${ecoAction.impact}</td>
          <td class="delete-button-td"><button class="delete-button" data-index="${index}">Delete</button></td>
        `;

        // Add delete functionality to the button
        row.querySelector(".delete-button").addEventListener("click", () => {
          EcoAction.delete(index);
        });

        tableBody.appendChild(row);
      });
    }
  }

  /**
   * Initializes event listeners for sort buttons in the EcoTracker table.
   */
  static initializeSortButtons() {
    const ecoActions = User.getUser()?.ecoData?.ecoActions || [];

    document.querySelectorAll(".sort-button").forEach((button) => {
      // Remove any existing event listeners to prevent duplication
      button.replaceWith(button.cloneNode(true));
      const newButton = document.querySelector(
        `[data-column="${button.getAttribute("data-column")}"]`
      );

      newButton.addEventListener("click", () => {
        const column = newButton.getAttribute("data-column");
        const currentOrder = newButton.getAttribute("data-order");
        const newOrder = currentOrder === "asc" ? "desc" : "asc";

        // Update the button's data-order attribute
        newButton.setAttribute("data-order", newOrder);

        // Sort the table
        UIManager.sortEcoTrackerTable(ecoActions, column, newOrder);
      });
    });
  }

  /**
   * Sorts the EcoTracker table based on the specified column and order.
   * Updates the sorting buttons dynamically.
   * @param {Array<Object>} ecoActions - The array of ecoActions to sort.
   * @param {string} column - The column to sort by (e.g., "createdDate", "date", "action", "impact").
   * @param {string} order - The sort order ("asc" for ascending, "desc" for descending).
   */
  static sortEcoTrackerTable(ecoActions, column, order) {
    const sortedActions = ecoActions.sort((a, b) => {
      if (column === "createdDate" || column === "date") {
        // Sort by date
        const dateA = new Date(a[column]);
        const dateB = new Date(b[column]);
        return order === "asc" ? dateA - dateB : dateB - dateA;
      } else {
        // Sort by string (action or impact)
        const valueA = a[column].toLowerCase();
        const valueB = b[column].toLowerCase();
        if (valueA < valueB) return order === "asc" ? -1 : 1;
        if (valueA > valueB) return order === "asc" ? 1 : -1;
        return 0;
      }
    });

    // Update the table with the sorted data
    this.updateEcoTrackerTable(sortedActions);

    // Update sorting buttons
    this.updateSortButtons(column, order);
  }

  /**
   * Updates the sorting buttons to reflect the current sorting state.
   * @param {string} activeColumn - The column currently being sorted.
   * @param {string} order - The sort order ("asc" or "desc").
   */
  static updateSortButtons(activeColumn, order) {
    document.querySelectorAll(".sort-button").forEach((button) => {
      const column = button.getAttribute("data-column");

      if (column === activeColumn) {
        button.textContent = order === "asc" ? "▲" : "▼";
        button.style.backgroundColor = "var(--color-accent)";
        button.style.color = "var(--color-background)";
      } else {
        button.textContent = "Sort";
        button.setAttribute("data-order", "asc");
        button.style.backgroundColor = "";
        button.style.color = "";
      }
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

// Call this method in the appropriate place
document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.endsWith("ecotracker.html")) {
    const ecoActions = User.getUser()?.ecoData?.ecoActions || [];

    // Default sorting by "Date Added" (createdDate) in ascending order
    UIManager.sortEcoTrackerTable(ecoActions, "createdDate", "asc");

    // Initialize sort button event listeners
    UIManager.initializeSortButtons();
  }
});

window.UIManager = UIManager;
UIManager.update();
