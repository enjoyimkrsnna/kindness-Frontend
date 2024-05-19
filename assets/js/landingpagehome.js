// Function to create main content
function createMainContent() {
    // Select the main content element
    const mainContent = document.getElementById('main-content');

    // Clear existing content
    mainContent.innerHTML = '';

    // Create a container div
    const contentContainer = document.createElement('div');
    contentContainer.id = 'content-container'; // Assign an ID for styling

    // Create heading
    const heading = document.createElement('h1');
    heading.textContent = "At KindnessKettle, we believe in spreading kindness through small acts of generosity.";
    contentContainer.appendChild(heading);

    const heading2 = document.createElement('h2');
    heading2.textContent = "Join us in making the world a better place!";
    contentContainer.appendChild(heading2);

    // Create image
    const image = document.createElement('img');
    image.src = "https://unique-kindnesskettle-image.s3.eu-west-1.amazonaws.com/donationImages/letsdonate.jpg"; 
    image.alt = "KindnessKettle Image";
    image.style.maxWidth = "100%";
    image.style.borderRadius = "10px";
    image.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.1)";
    contentContainer.appendChild(image);

    // Append content container to main content
    mainContent.appendChild(contentContainer);
}

// Call the function to create main content initially
createMainContent();
