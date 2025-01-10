window.addEventListener('load', () => {
  
  const loginBtn = document.getElementById('login-btn');

  loginBtn.addEventListener('click', function () {
      
      // Get form data
      const username = document.getElementById('login-username').value;
      const password = document.getElementById('login-password').value;

      // Fetch data from db.json
      fetch('../db.json')
        .then(response => response.json())
        .then(data => {
          // Validate username and password
          const user = data.users.find(user => user.username === username && user.password === password);
          
          if (user) {
            alert('Login successful!');

            localStorage.setItem('currentUser', JSON.stringify(user));
            
            switch (user.role) {
                case 'admin':
                  window.location.href = '../html/admin-dashboard.html';
                  break;
                case 'seller':
                  window.location.href = '../html/seller-dashboard.html';
                  break;
                case 'customer':
                  window.location.href = '../html/home.html';
                  break;
                default:
                  alert('Role not recognized');
              }

            // Redirect or perform other actions on successful login
          } else {
            alert('Invalid username or password');
          }
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
  });
});
