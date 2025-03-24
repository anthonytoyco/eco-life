"use strict";

/**
 * Represents the user's data.
 * - User is not logged in? User.isActive is false.
 * - User is logged in? User.isActive is true, object is filled with JSON data.
 */
export class User {
  /**
   * @type {Date} - Date that the account was created.
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
   * @type {Date} - The user's birthday.
   */
  birthday;
  /**
   * @type {Object<string, any[]>} - An object containing arrays for ecoActions, challenges, achievements, and friends.
   */
  data;
  /**
   * @type {number} - The user's ecopoints.
   */
  ecopoints;

  /**
   * Creates a new User instance. Called when user creates an account.
   * @param {string} email - The user's email.
   * @param {string} name - The user's name.
   * @param {Date} birthday - The user's birthday.
   */
  constructor(email, name, birthday) {
    this.createdDate = new Date();
    this.email = email;
    this.name = name;
    this.birthday = birthday;
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
   * Saves the user instance to localStorage.
   */
  saveToLocalStorage() {
    const userData = {
      isActive: this.isActive,
      createdDate: this.createdDate,
      email: this.email,
      name: this.name,
      birthday: this.birthday,
      data: this.data,
      ecopoints: this.ecopoints,
    };

    localStorage.setItem("user", JSON.stringify(userData));
  }

  /**
   * Exports the user's data as a JSON file.
   */
  exportData() {
    const userData = {
      isActive: this.isActive,
      createdDate: this.createdDate,
      email: this.email,
      name: this.name,
      birthday: this.birthday,
      data: this.data,
      ecopoints: this.ecopoints,
    };

    const jsonData = JSON.stringify(userData, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `Eco-Life_${this.email}_data.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  /**
   * Creates a User instance from an uploaded JSON file.
   * @param {File} file - The uploaded JSON file.
   * @returns {Promise<User>} - A promise that resolves to a User instance.
   */
  static async importData(file) {
    // Read the file content
    const fileContent = await file.text();
    const userData = JSON.parse(fileContent);

    // Validate the JSON structure
    if (
      !userData.email ||
      !userData.name ||
      !userData.birthday ||
      !userData.data
    ) {
      throw new Error("Invalid user data format.");
    }

    // Create a new User instance
    const user = new User(
      userData.email,
      userData.name,
      new Date(userData.birthday)
    );

    // Overwrite the default data with the imported data
    user.data = userData.data;
    user.createdDate = new Date(userData.createdDate);
    user.isActive = true;

    // Save the user to localStorage
    user.saveToLocalStorage();

    console.log("User imported successfully:", user);
    return user;
  }
}
