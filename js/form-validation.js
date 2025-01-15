export default class FormValidator {

    static validateUsername(username) {
      const usernameRegex = /^[a-zA-Z0-9]{3,15}$/;
      return usernameRegex.test(username)
        ? { valid: true, message: "Valid username." }
        : { valid: false, message: "Username must be 3-15 characters long and alphanumeric." };
    }
  

    static validatePassword(password) {
    const passwordRegex = /^[A-Za-z\d]{5,25}$/;
      return passwordRegex.test(password)
        ? { valid: true, message: "Valid password." }
        : { valid: false, message: "Password must be between 5-25 characters or digits." };
    }
  }
  