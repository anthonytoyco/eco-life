"use strict";

import { EcoAction, Challenge, Achievement } from "./dataTypes.js";
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
   * Updates the Challenges table with the user's challenges.
   */
  static updateChallengesTable() {
    const userData = JSON.parse(localStorage.getItem("user"));

    // Ensure challenges exist in user data
    if (
      !userData.ecoData.challenges ||
      userData.ecoData.challenges.length === 0
    ) {
      userData.ecoData.challenges = [
        new Challenge("Use a reusable water bottle", 50),
        new Challenge("Cycle instead of driving", 30),
        new Challenge("Plant a tree", 100),
        new Challenge("Switch to LED bulbs", 20),
        new Challenge("Take a shorter shower", 10),
        new Challenge("Compost food waste", 40),
        new Challenge("Use public transport for a week", 70),
        new Challenge("Avoid single-use plastics for a day", 25),
        new Challenge("Donate old clothes", 50),
        new Challenge("Participate in a community cleanup", 80),
        new Challenge("Unplug unused electronics", 15),
        new Challenge("Carpool with friends", 35),
        new Challenge("Start a home garden", 90),
        new Challenge("Switch to paperless billing", 20),
        new Challenge("Use a clothesline instead of a dryer", 30),
      ];

      // Save initial challenges to localStorage
      localStorage.setItem("user", JSON.stringify(userData));
    }

    const challenges = userData.ecoData.challenges;

    // Populate the table
    const tableBody = document.getElementById("challenges-table-body");
    tableBody.innerHTML = challenges
      .map(
        (challenge, index) => `
        <tr>
          <td>${challenge.name}</td>
          <td>+${challenge.reward} Points</td>
          <td class="challenge-status-td">
            <select class="challenge-status" data-index="${index}">
              <option value="Not Started" ${
                challenge.status === "Not Started" ? "selected" : ""
              }>❌❌❌</option>
              <option value="In Progress" ${
                challenge.status === "In Progress" ? "selected" : ""
              }>🕒🕒🕒</option>
              <option value="Completed" ${
                challenge.status === "Completed" ? "selected" : ""
              }>✅✅✅</option>
            </select>
          </td>
          <td>${
            challenge.dateCompleted
              ? new Date(challenge.dateCompleted).toLocaleDateString("en-US")
              : "---"
          }</td>
        </tr>`
      )
      .join("");

    // Add event listeners for status changes
    document.querySelectorAll(".challenge-status").forEach((select) => {
      select.addEventListener("change", (event) => {
        const index = event.target.getAttribute("data-index");
        const newStatus = event.target.value;

        // Update the challenge status in localStorage
        Challenge.updateStatus(newStatus, index);

        // Refresh the table
        UIManager.updateChallengesTable();
      });
    });
  }

  /**
   * Updates the Achievements table with the user's achievements.
   */
  static updateAchievementsTable() {
    const userData = JSON.parse(localStorage.getItem("user"));

    // Ensure achievements exist in user data
    if (
      !userData.ecoData.achievements ||
      userData.ecoData.achievements.length === 0
    ) {
      userData.ecoData.achievements = [
        new Achievement(
          "🥉 Challenge Beginner",
          "Complete 5 challenges to earn this badge."
        ),
        new Achievement(
          "🥈 Challenge Enthusiast",
          "Complete 10 challenges to earn this badge."
        ),
        new Achievement(
          "🥇 Challenge Master",
          "Complete 20 challenges to earn this badge."
        ),
        new Achievement(
          "🪴 Eco-Action Rookie",
          "Log 5 eco-actions to earn this badge."
        ),
        new Achievement(
          "🌿 Eco-Action Explorer",
          "Log 10 eco-actions to earn this badge."
        ),
        new Achievement(
          "🌱 Eco-Action Pro",
          "Log 20 eco-actions to earn this badge."
        ),
        new Achievement(
          "💯 EcoPoints Collector",
          "Earn 100 ecoPoints to earn this badge."
        ),
        new Achievement(
          "💰 EcoPoints Saver",
          "Earn 500 ecoPoints to earn this badge."
        ),
        new Achievement(
          "🏆 EcoPoints Champion",
          "Earn 1000 ecoPoints to earn this badge."
        ),
        new Achievement(
          "🚰 Hydration Hero",
          "Use a reusable water bottle for 30 days."
        ),
        new Achievement("🌳 Tree Planter", "Plant 5 trees to earn this badge."),
        new Achievement(
          "🚫 Plastic-Free Week",
          "Avoid single-use plastics for 7 days."
        ),
        new Achievement(
          "🚌 Transit Tracker",
          "Take public transport for 30 days."
        ),
        new Achievement(
          "🍃 Meatless Mission",
          "Eat plant-based meals for 7 days."
        ),
        new Achievement(
          "♻️ Recycling Regular",
          "Log recycling actions 10 times."
        ),
      ];

      // Save initial achievements to localStorage
      localStorage.setItem("user", JSON.stringify(userData));
    }

    const achievements = userData.ecoData.achievements;

    // Populate the table
    const tableBody = document.getElementById("achievements-table-body");
    tableBody.innerHTML = achievements
      .map(
        (achievement, index) => `
        <tr class="${achievement.completed ? "completed-row" : ""}">
          <td class="achievement-badge">${achievement.badge}</td>
          <td>${achievement.description}</td>
          <td class="achievement-checkbox-td">
            <input type="checkbox" class="achievement-checkbox" data-index="${index}" ${
          achievement.completed ? "checked disabled" : ""
        }>
          </td>
        </tr>`
      )
      .join("");

    // Add event listeners for checkboxes
    document.querySelectorAll(".achievement-checkbox").forEach((checkbox) => {
      checkbox.addEventListener("change", (event) => {
        const index = event.target.getAttribute("data-index");

        // Show confirmation dialog
        const confirmCompletion = confirm(
          "Are you sure you want to mark this achievement as completed? You will gain +100 ecoPoints."
        );

        if (confirmCompletion) {
          // Mark the achievement as completed
          achievements[index].completed = true;

          // Add 100 ecoPoints
          userData.ecoPoints = (userData.ecoPoints || 0) + 100;

          // Save updated user data
          localStorage.setItem("user", JSON.stringify(userData));

          // Refresh the table
          UIManager.updateAchievementsTable();
        } else {
          // If the user cancels, uncheck the checkbox
          event.target.checked = false;
        }
      });
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

// Eco-Tracker table handler
document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.endsWith("ecotracker.html" && User.getUser())) {
    UIManager.updateEcoTrackerTable(User.getUser()?.ecoData?.ecoActions || []);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.endsWith("challenges.html") && User.getUser()) {
    UIManager.updateChallengesTable();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  if (
    window.location.pathname.endsWith("achievements.html") &&
    User.getUser()
  ) {
    UIManager.updateAchievementsTable();
  }
});

window.UIManager = UIManager;
UIManager.update();
