"use strict";

/**
 * Represents an Eco-Life user.
 * This class manages user data, including email, name, eco actions, challenges, achievements, and ecoPoints.
 * It also provides methods for saving, exporting, and importing user data.
 */
export class User {
  /**
   * @type {string} - The date the account was created, formatted as "Month Day, Year" (e.g., "March 24, 2025").
   */
  createdDate;
  /**
   * @type {string} - The user's email.
   */
  email;
  /**
   * @type {string} - The user's name.
   */
  name;
  /**
   * @type {Object<string, any[]>} - An object containing user-related eco data.
   * @property {Array<Object>} ecoActions - A list of eco-friendly actions performed by the user.
   * @property {Array<Object>} challenges - A list of challenges the user has participated in.
   * @property {Array<Object>} achievements - A list of achievements earned by the user.
   * @property {Array<Object>} friends - A list of the user's friends.
   */
  ecoData;
  /**
   * @type {number} - The user's ecoPoints.
   */
  ecoPoints;

  /**
   * Creates a new User instance.
   * @param {Object} config - The configuration object.
   * @param {string} config.email - The user's email.
   * @param {string} config.name - The user's name.
   */
  constructor({ email, name }) {
    if (!email || !name) {
      throw new Error("Invalid input: email and name are required.");
    }
    this.email = email;
    this.name = name;
    // Save as a Date object
    this.createdDate = new Date();
    this.ecoData = {
      ecoActions: [],
      challenges: [],
      achievements: [],
      friends: [],
    };
    this.ecoPoints = 0;
    this.saveToLocalStorage();
  }

  /**
   * Saves the user instance to localStorage as a JSON string.
   */
  saveToLocalStorage() {
    const userData = {
      // Save as an ISO string
      createdDate: this.createdDate.toISOString(),
      email: this.email,
      name: this.name,
      ecoData: this.ecoData,
      ecoPoints: this.ecoPoints,
    };
    localStorage.setItem("user", JSON.stringify(userData));
  }

  /**
   * Exports the user's data as a JSON file from localStorage.
   * The file name includes the user's email and the date and time of export.
   */
  static exportUser() {
    // Use getUser to retrieve user data
    const userData = this.getUser();

    // Convert the user data to a JSON string
    const jsonData = JSON.stringify(userData, null, 2);

    // Generate a readable date and time string for the file name
    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const formattedTime = now
      .toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
      // Replace colons with dashes for file name compatibility
      .replace(/:/g, "-");

    // Create the file name
    const fileName = `Eco-Life_${userData.email}_${formattedDate}_${formattedTime}.json`;

    // Create a Blob and trigger a download
    const blob = new Blob([jsonData], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    console.log("User exported successfully:", userData);
    alert("User exported successfully!");
  }

  /**
   * Creates a new User instance and saves it to localStorage.
   * @param {string} email - The user's email address.
   * @param {string} name - The user's full name.
   * @returns {User} - A new User instance.
   */
  static createUser(email, name) {
    const user = new User({ email, name });
    console.log("User created successfully:", user);
    alert("User created successfully!");
    return user;
  }

  /**
   * Creates a User instance from a JSON file uploaded via a form.
   * The JSON file must contain valid user data, including email, name, and ecoData fields.
   * @param {HTMLFormElement} form - The form element containing the file input.
   * @returns {Promise<User>} - A promise that resolves to a User instance.
   */
  static async importUser(form) {
    const fileInput = form.querySelector("input[name='json-input']");
    const file = fileInput.files[0];

    const fileContent = await file.text();
    const userData = JSON.parse(fileContent);

    if (!userData.email || !userData.name || !userData.ecoData) {
      throw new Error("Invalid user data format.");
    }

    const user = new User({
      email: userData.email,
      name: userData.name,
    });
    user.createdDate = new Date(userData.createdDate);
    user.ecoData = userData.ecoData;
    user.ecoPoints = userData.ecoPoints;

    // Use updateUser to save the imported user
    this.setUser(user);

    console.log("User imported successfully:", user);
    alert("User imported successfully!");

    return user;
  }

  /**
   * Logs the user out by clearing the user data from localStorage.
   * Reloads the page to reset the UI to the logged-out state.
   */
  static logout() {
    if (confirm("Are you sure you want to log out?")) {
      // Clear user data from localStorage
      localStorage.removeItem("user");
      alert("You have been logged out.");
      // Reload the page to reset the UI
      location.reload();
    }
  }

  /**
   * Retrieves the user data from localStorage.
   * @returns {Object} - The user data object.
   */
  static getUser() {
    const user = JSON.parse(localStorage.getItem("user"));
    return user;
  }

  /**
   * Updates the user in localStorage.
   * @param {Object} updated - The updated user object.
   */
  static setUser(updated) {
    localStorage.setItem("user", JSON.stringify(updated));
    console.log("User data updated successfully:", updated);
  }
}

window.User = User;
