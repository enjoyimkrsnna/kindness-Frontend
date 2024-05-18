// form.js

function createForm() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = ''; // Clear the existing content
    
    // Create the form container
    const formContainer = document.createElement('div');
    formContainer.classList.add('container');
    
    // Create the form card
    const formCard = document.createElement('div');
    formCard.classList.add('postDetailCard');
    
    // Create the form header
    const formHeader = document.createElement('div');
    formHeader.classList.add('postHeader');
    const formTitle = document.createElement('h2');
    formTitle.textContent = 'Donation Post Form';
    formHeader.appendChild(formTitle);
    
    // Create the form body
    const formBody = document.createElement('div');
    formBody.classList.add('postDetailForm');
    
    // Form elements
    const formElements = [
        { type: 'select', id: 'foodTypeId', labelText: 'Food Type:', options: ['Vegetarian', 'Non-Vegetarian'] },
        { type: 'input', inputType: 'text', id: 'addressLine', labelText: 'Address Line:' },
        { type: 'input', inputType: 'text', id: 'pincode', labelText: 'Pincode:' },
        { type: 'input', inputType: 'file', id: 'foodImageUrl', labelText: 'Food Image:' },
        { type: 'input', inputType: 'datetime-local', id: 'timeAvailable', labelText: 'Time Available:' }
    ];

    formElements.forEach(element => {
        const formGroup = document.createElement('div');
        formGroup.classList.add('form-group');
        
        const label = document.createElement('label');
        label.textContent = element.labelText;
        
        const inputElement = document.createElement(element.type);
        inputElement.type = element.inputType || 'text'; // Set input type if provided
        
        // For select element, create options
        if (element.type === 'select') {
            element.options.forEach(optionText => {
                const option = document.createElement('option');
                option.value = optionText.toLowerCase();
                option.textContent = optionText;
                inputElement.appendChild(option);
            });
        }
        
        formGroup.appendChild(label);
        formGroup.appendChild(inputElement);
        formBody.appendChild(formGroup);
    });

    // Create the save button
    const savePostBtn = document.createElement('button');
    savePostBtn.textContent = 'Save Post';
    savePostBtn.addEventListener('click', savePost);

    // Append form elements to form card
    formCard.appendChild(formHeader);
    formCard.appendChild(formBody);
    formCard.appendChild(savePostBtn);

    // Append form card to form container
    formContainer.appendChild(formCard);

    // Append form container to main content
    mainContent.appendChild(formContainer);
}

// Function to save post
function savePost() {
    // Implement save post functionality here
    // Retrieve form data and perform necessary actions
}
