"use strict";

import { User } from "./userData.js";
import { UIManager } from "./uiManager.js";
import { EcoAction } from "./dataTypes.js";

/**
 * Represents an HTML form element.
 */
export class Form {
  /**
   * @type {HTMLElement | null} - Form to target.
   */
  source;
  /**
   * @type {Object<string, HTMLElement[]>} - An object of input elements grouped by type.
   */
  inputs = {};

  /**
   * Creates a new Form instance.
   * @param {HTMLElement} source - The form element to target.
   */
  constructor(source) {
    this.source = source;
    const inputs = source.querySelectorAll("input, select, textarea, file");
    inputs.forEach((input) => {
      // Group inputs by their type
      if (!this.inputs[input.type]) {
        this.inputs[input.type] = [];
      }
      this.inputs[input.type].push(input);
    });

    // Attach event listener for button clicks
    const submitButton = this.source.querySelector("[type='button']");
    submitButton.addEventListener("click", (event) =>
      this.handleButtonClick(event)
    );
  }

  /**
   * Validates the form inputs.
   * @returns {boolean} - Whether the form is valid.
   */
  validate() {
    let isValid = true;

    // Clear previous error messages
    this.clearErrors();

    // Validate email inputs
    const emailInputs = this.inputs["email"] || [];
    emailInputs.forEach((emailInput) => {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
        isValid = false;
        this.displayError(emailInput, "Please enter a valid email address.");
      }
    });

    // Validate text inputs
    const textInputs = this.inputs["text"] || [];
    textInputs.forEach((textInput) => {
      if (textInput.value.trim().length < 2) {
        isValid = false;
        this.displayError(
          textInput,
          "Text must be at least 2 characters long."
        );
      }
    });

    // Validate textarea inputs
    const textareaInputs = this.inputs["textarea"] || [];
    textareaInputs.forEach((textareaInput) => {
      if (textareaInput.value.trim().length < 2) {
        isValid = false;
        this.displayError(
          textareaInput,
          "Text must be at least 2 characters long."
        );
      }
    });

    // Validate telephone inputs
    const telInputs = this.inputs["tel"] || [];
    telInputs.forEach((telInput) => {
      if (!/^\+?[0-9]{7,15}$/.test(telInput.value)) {
        isValid = false;
        this.displayError(
          telInput,
          "Please enter a valid phone number (7-15 digits, optional +)."
        );
      }
    });

    // Validate date inputs
    const dateInputs = this.inputs["date"] || [];
    dateInputs.forEach((dateInput) => {
      if (!dateInput.value) {
        isValid = false;
        this.displayError(dateInput, "Please select a valid date.");
      }
    });

    // Validate file inputs
    const fileInputs = this.inputs["file"] || [];
    fileInputs.forEach((fileInput) => {
      if (fileInput.files.length === 0) {
        isValid = false;
        this.displayError(fileInput, "Please upload a file.");
      }
    });

    // Validate select inputs
    const selectInputs = this.inputs["select-one"] || [];
    selectInputs.forEach((selectInput) => {
      if (selectInput.value === "default") {
        isValid = false;
        this.displayError(selectInput, "Please select a valid option.");
      }
    });

    return isValid;
  }

  /**
   * Displays an error message for a specific input.
   * @param {HTMLElement} inputElement - The input element to display the error for.
   * @param {string} message - The error message to display.
   */
  displayError(inputElement, message) {
    const error = document.createElement("div");
    error.className = "error-message";
    error.textContent = message;
    inputElement.insertAdjacentElement("afterend", error);
  }

  /**
   * Clears all error messages.
   */
  clearErrors() {
    const errorMessages = this.source.querySelectorAll(".error-message");
    errorMessages.forEach((msg) => msg.remove());
  }

  /**
   * Handles the button click event.
   * @param {Event} event - The button click event.
   */
  async handleButtonClick(event) {
    if (!this.validate()) {
      // Prevent submissions if user inputs are invalid
      event.preventDefault();
    } else {
      switch (this.source.id) {
        case "login-form":
          try {
            await User.importUser(this.source);
            this.resetForm();
            UIManager.update();
          } catch (error) {
            alert("Failed to load user account. Please check the file format.");
            console.error("Failed to load user account:", error.message);
          }
          break;
        case "signup-form":
          const email = this.source
            .querySelector("input[name='email-input']")
            .value.trim();
          const name = this.source
            .querySelector("input[name='name-input']")
            .value.trim();
          const confirmation = confirm(
            `Your email: ${email}\nYour name: ${name}\nIs this information correct?`
          );
          if (confirmation) {
            User.createUser(name, email);
            this.resetForm();
            UIManager.update();
          }
          break;
        case "ecotracker-form":
          EcoAction.add(this.source);
          this.resetForm();
          UIManager.update();
          break;
      }
    }
  }

  /**
   * Resets all inputs in the form.
   */
  resetForm() {
    const inputs = this.source.querySelectorAll("input, select, textarea");
    inputs.forEach((input) => {
      if (input.type === "checkbox" || input.type === "radio") {
        input.checked = false;
      } else {
        input.value = "";
      }
    });
  }
}

// Generates a Form instance for each form element
document.addEventListener("DOMContentLoaded", () => {
  const forms = [...document.getElementsByClassName("forms")];
  forms.forEach((formElement) => {
    const formInstance = new Form(formElement);
  });
});
