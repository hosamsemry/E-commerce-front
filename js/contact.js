const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

contactForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (name && email && message) {
        formMessage.style.color = 'green';
        formMessage.textContent = 'Thank you for contacting us! We will get back to you soon.';
        
        contactForm.reset();
    } else {
        formMessage.style.color = 'red';
        formMessage.textContent = 'Please fill in all fields.';
    }
});
