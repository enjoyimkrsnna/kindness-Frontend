function createRegistrationForm() {
    // Create card element
    const card = document.createElement('div');
    card.classList.add('card');

    // Create card body
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    // Create heading element
    const heading = document.createElement('h2');
    heading.textContent = 'Please register to share love!';
    cardBody.appendChild(heading);

    // Create form element
    const form = document.createElement('form');

    // Add form attributes
    form.setAttribute('id', 'registrationForm');
    form.setAttribute('method', 'post');
    form.setAttribute('action', '/register');

    // Create input fields
    const fields = [
        { name: 'firstName', type: 'text', placeholder: 'First Name' },
        { name: 'lastName', type: 'text', placeholder: 'Last Name' },
        { name: 'username', type: 'text', placeholder: 'Username' },
        { name: 'email', type: 'email', placeholder: 'Email' }
    ];

    fields.forEach(field => {
        const input = document.createElement('input');
        input.setAttribute('type', field.type);
        input.setAttribute('name', field.name);
        input.setAttribute('placeholder', field.placeholder);
        input.setAttribute('required', true); // Set input field as required
        form.appendChild(input);
    });

    // Create submit button
    const submitButton = document.createElement('button');
    submitButton.setAttribute('type', 'submit');
    submitButton.classList.add('btn', 'btn-primary');
    submitButton.textContent = 'Register';
    form.appendChild(submitButton);

    // Append form to the card body
    cardBody.appendChild(form);

    // Append card body to the card
    card.appendChild(cardBody);

    // Append card to the document body or any other container element
    document.body.appendChild(card);

    // Add event listener for form submission
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        // Submit the form
        this.submit();
    });
}


