import FormValidator from './form-validation.js';

window.addEventListener('load', () => {
  const loginBtn = document.getElementById('login-btn');

  loginBtn.addEventListener('click', function (event) {
    event.preventDefault();

    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value.trim();

    if (!username || !password) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Please enter both username and password',
      });
      return;
    }

    const usernameValidation = FormValidator.validateUsername(username);
    if (!usernameValidation.valid) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Username',
        text: usernameValidation.message,
      });
      return;
    }

    const passwordValidation = FormValidator.validatePassword(password);
    if (!passwordValidation.valid) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Password',
        text: passwordValidation.message,
      });
      return;
    }

    fetch('http://localhost:3000/users')
      .then(response => response.json())
      .then(users => {
        try {
          const user = users.find(user =>
            user.username.toLowerCase() === username.toLowerCase() &&
            user.password === password
          );

          if (user) {
            sessionStorage.setItem('currentUser', JSON.stringify(user));

            switch (user.role) {
              case 'admin':
                window.location.href = './admin-dashboard.html';
                break;
              case 'seller':
                window.location.href = './seller-dashboard.html';
                break;
              case 'customer':
                window.location.href = './home.html';
                break;
              default:
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Role not recognized',
                });
            }
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Invalid username or password',
            });
          }
        } catch (error) {
          console.error('Error processing data:', error);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'An error occurred while logging in. Please try again later.',
          });
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'An error occurred while logging in. Please try again later.',
        });
      });
  });
});
