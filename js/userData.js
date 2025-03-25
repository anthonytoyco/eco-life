"use strict";

/**
 * Represents an Eco-Life user.
 * This class manages user data, including email, name, eco actions, challenges, achievements, and eco-points.
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
   * @type {Object<string, any[]>} - An object containing user-related data.
   * @property {Array<Object>} ecoActions - A list of eco-friendly actions performed by the user.
   * @property {Array<Object>} challenges - A list of challenges the user has participated in.
   * @property {Array<Object>} achievements - A list of achievements earned by the user.
   * @property {Array<Object>} friends - A list of the user's friends.
   */
  data;
  /**
   * @type {number} - The user's ecopoints.
   */
  ecopoints;

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
    this.createdDate = new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    this.data = {
      ecoActions: [],
      challenges: [],
      achievements: [],
      friends: [],
    };
    this.ecopoints = 0;
    this.saveToLocalStorage();
  }

  /**
   * Saves the user instance to localStorage as a JSON string.
   */
  saveToLocalStorage() {
    const userData = {
      createdDate: this.createdDate,
      email: this.email,
      name: this.name,
      data: this.data,
      ecopoints: this.ecopoints,
    };
    localStorage.setItem("user", JSON.stringify(userData));
  }

  /**
   * Exports the user's data as a JSON file from localStorage.
   */
  static exportUser() {
    // Retrieve user data from localStorage
    const userData = JSON.parse(localStorage.getItem("user"));

    // Convert the user data to a JSON string
    const jsonData = JSON.stringify(userData, null, 2);

    // Create a Blob and trigger a download
    const blob = new Blob([jsonData], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `Eco-Life_${userData.email}_data.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Alert user
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
   * The JSON file must contain valid user data, including email, name, and data fields.
   * @param {HTMLFormElement} form - The form element containing the file input.
   * @returns {Promise<User>} - A promise that resolves to a User instance.
   */
  static async importUser(form) {
    // Get the file input element and retrieve the selected file
    const fileInput = form.querySelector("input[name='json-input']");
    const file = fileInput.files[0];

    // Read the file content
    const fileContent = await file.text();
    const userData = JSON.parse(fileContent);

    // Validate the JSON structure
    if (!userData.email || !userData.name || !userData.data) {
      throw new Error("Invalid user data format.");
    }

    // Create a new User instance
    const user = new User({
      email: userData.email,
      name: userData.name,
    });
    user.createdDate = userData.createdDate;
    user.data = userData.data;
    user.ecopoints = userData.ecopoints;

    // Save the user to localStorage
    user.saveToLocalStorage();

    // Alert user
    console.log("User imported successfully:", user);
    alert("User imported successfully!");

    return user;
  }

  /**
   * Logs the user out by clearing the user data from localStorage.
   * Reloads the page to reset the UI to the logged-out state.
   */
  static logout() {
    const confirmation = confirm("Are you sure you want to log out?");
    if (confirmation) {
      // Remove the user data from localStorage
      localStorage.removeItem("user");

      // Alert user
      alert("You have been logged out.");

      // Reset the UI to the logged-out state
      location.reload();
    }
  }
}

window.User = User;
