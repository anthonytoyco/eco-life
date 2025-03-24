import { User } from "./userData.js";

("use strict");

export class AuthedUI {
  /**
   * Updates the HTML elements to reflect the logged-in state.
   * Fetches user data from localStorage.
   */
  static update() {
    // Retrieve user data from localStorage
    const userData = JSON.parse(localStorage.getItem("user"));

    if (userData) {
      // Format the birthday into "Month Day, Year"
      const formattedBirthday = new Date(userData.birthday).toLocaleDateString(
        "en-US",
        {
          month: "long",
          day: "numeric",
          year: "numeric",
        }
      );

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
          "profile-info-name",
          `<p><strong>Name:</strong> ${userData.name}</p>`
        );
        this.updateElement(
          "profile-info-email",
          `<p><strong>Email:</strong> ${userData.email}</p>`
        );
        this.updateElement(
          "profile-info-birthday",
          `<p><strong>Birthday:</strong> ${formattedBirthday}</p>`
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
   * @param {Array} ecoActions - The array of ecoActions to display.
   */
  static updateEcoTrackerTable(ecoActions) {
    const tableBody = document.getElementById("eco-summary-body");

    // Clear the table body
    tableBody.innerHTML = "";

    // Populate the table with ecoActions
    ecoActions.forEach((action, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${new Date(action.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}</td>
        <td>${action.action}</td>
        <td>${action.impact}</td>
        <td><button class="delete-button" data-index="${index}">Delete</button></td>
      `;

      // Add delete functionality to the button
      row.querySelector(".delete-button").addEventListener("click", () => {
        this.deleteEcoAction(index);
      });

      tableBody.appendChild(row);
    });
  }

  /**
   * Deletes an ecoAction from the user's data in localStorage and updates the table.
   * @param {number} index - The index of the ecoAction to delete.
   */
  static deleteEcoAction(index) {
    const userData = JSON.parse(localStorage.getItem("user"));

    if (!userData || !userData.data.ecoActions) {
      console.warn("No ecoActions found for the user.");
      return;
    }

    // Remove the ecoAction at the specified index
    userData.data.ecoActions.splice(index, 1);

    // Save the updated user data back to localStorage
    localStorage.setItem("user", JSON.stringify(userData));

    // Update the table
    this.updateEcoTrackerTable(userData.data.ecoActions);

    // Notify the user
    alert("Eco action deleted successfully!");
  }

  /**
   * Logs the user out by clearing the user data from localStorage
   * and updating the UI to reflect the logged-out state.
   */
  static logout() {
    // Remove the user data from localStorage
    localStorage.removeItem("user");

    // Notify the user
    alert("You have been logged out.");

    // Reset the UI to the logged-out state
    this.updateElement("greeting", "<i>Welcome to Eco-Life</i>");
    this.showElement("profile-auth-section");
    this.hideElement("profile-info");
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

  /**
   * Exports the logged-in user's data as a JSON file.
   */
  static exportUserData() {
    // Retrieve user data from localStorage
    const userData = JSON.parse(localStorage.getItem("user"));

    // Create a User instance from the user data
    const user = new User(
      userData.email,
      userData.name,
      new Date(userData.birthday)
    );
    user.data = userData.data;
    user.createdDate = new Date(userData.createdDate);
    user.ecopoints = userData.ecopoints;

    // Call the exportData method
    user.exportData();
  }
}

window.AuthedUI = AuthedUI;
AuthedUI.update();
