import { User } from "./userData.js";
import { EcoAction } from "./dataTypes.js";

("use strict");

export class FormUtils {
  /**
   * Creates a new user account from form data.
   * @param {HTMLElement} form - The form element containing user input.
   */
  static createAccount(form) {
    console.log(form);
    // Extract form data
    const email = form.querySelector("input[name='email-input']").value.trim();
    const name = form.querySelector("input[name='name-input']").value.trim();
    const birthday = form.querySelector("input[name='birthday-input']").value;

    // Create a new User instance
    const newUser = new User(email, name, new Date(birthday));

    // Save the user to localStorage
    newUser.saveToLocalStorage();

    // Notify the user
    alert("Account created successfully!");
    console.log("New user created:", newUser);
    newUser.exportData();
  }

  /**
   * Loads a user account from an uploaded JSON file.
   * @param {HTMLElement} form - The form element containing the file input.
   */
  static async loadAccount(form) {
    // Get the file input element
    const fileInput = form.querySelector("input[name='json-input']");

    // Get the uploaded file
    const file = fileInput.files[0];

    // Use the User.importData method to create a User instance
    const user = await User.importData(file);

    // Notify the user
    alert("User account loaded successfully!");
    console.log("Loaded user:", user);
  }

  /**
   * Adds an eco action to the user's data in localStorage.
   * @param {HTMLElement} form - The form element containing eco action input.
   */
  static addEcoAction(form) {
    // Extract form data
    const date = form.querySelector("input[name='log-date-input']").value;
    const action = form
      .querySelector("input[name='log-action-input']")
      .value.trim();
    const impact = form
      .querySelector("input[name='log-impact-input']")
      .value.trim();

    // Retrieve the user data from localStorage
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData) {
      alert("No user is logged in. Please log in to add an eco action.");
      return;
    }

    // Create a new EcoAction instance
    const ecoAction = new EcoAction(new Date(date), action, impact);

    // Add the eco action to the user's data
    userData.data.ecoActions = userData.data.ecoActions || [];
    userData.data.ecoActions.push(ecoAction);

    // Save the updated user data back to localStorage
    localStorage.setItem("user", JSON.stringify(userData));

    // Notify the user
    alert("Eco action added successfully!");
    console.log("Updated user data:", userData);
  }
}
