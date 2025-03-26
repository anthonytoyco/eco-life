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
      ecoActions.forEach((ecoaction, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${new Date(ecoaction.date).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}</td>
          <td>${ecoaction.action}</td>
          <td>${ecoaction.impact}</td>
          <td><button class="delete-button" data-index="${index}">Delete</button></td>
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
