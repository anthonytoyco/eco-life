import { User } from "./userData.js";

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
}
