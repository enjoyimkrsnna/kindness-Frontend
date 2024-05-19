function createProfileHeaderAndGallery() {
    let userdetails = localStorage.getItem('userdetails');
    userdetails = JSON.parse(userdetails);

    const userId = userdetails.userId;
    console.log(userId);

    let jwttoken = localStorage.getItem('jwttoken');
    console.log(jwttoken);

    fetch(`https://52.16.194.174:8085/kindnesskettle/useranalytics/${userId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${jwttoken}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);

        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = '';

        // Create profile content
        const profile = document.createElement('div');
        profile.className = 'profile';

        const profileImageDiv = document.createElement('div');
        profileImageDiv.className = 'profile-image';
        const profileImage = document.createElement('img');
        profileImage.src = data.userAccount.imageUrl; // Use imageUrl from API response
        profileImage.alt = data.userAccount.username;
        profileImageDiv.appendChild(profileImage);

        const profileUserSettings = document.createElement('div');
        profileUserSettings.className = 'profile-user-settings';
        const profileUserName = document.createElement('h1');
        profileUserName.className = 'profile-user-name';
        profileUserName.textContent = data.userAccount.username; // Use username from API response
        const editButton = document.createElement('button'); 
        editButton.className = 'btn profile-edit-btn'; 
        editButton.textContent = 'Edit Profile'; 
        editButton.onclick = toggleEditForm; 
        const settingsButton = document.createElement('button');
        settingsButton.className = 'btn profile-settings-btn';
        settingsButton.setAttribute('aria-label', 'profile settings');
        settingsButton.innerHTML = '<i class="fas fa-cog" aria-hidden="true"></i>';
        profileUserSettings.appendChild(profileUserName);
        profileUserSettings.appendChild(editButton); 
        profileUserSettings.appendChild(settingsButton);

        const profileStats = document.createElement('div');
        profileStats.className = 'profile-stats';
        const statsList = document.createElement('ul');
        const donations = document.createElement('li');
        donations.innerHTML = `<span class="profile-stat-count">${data.totalPosts}</span> Donation`;
        const likes = document.createElement('li');
        likes.innerHTML = `<span class="profile-stat-count">${data.totalLikes}</span> Likes`;
        statsList.appendChild(donations);
        statsList.appendChild(likes);
        profileStats.appendChild(statsList);

        const profileBio = document.createElement('div');
        profileBio.className = 'profile-bio';
        profileBio.innerHTML = `<p><span class="profile-real-name">${data.userAccount.firstName} ${data.userAccount.lastName}</span><br> ${data.userAccount.profileDescription}</p>`;

        profile.appendChild(profileImageDiv);
        profile.appendChild(profileUserSettings);
        profile.appendChild(profileStats);
        profile.appendChild(profileBio);

        // Append profile content to main content container
        mainContent.innerHTML = '';
        mainContent.appendChild(profile);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function toggleEditForm() {
    const editFormOverlay = document.querySelector('.edit-form-overlay');
    if (!editFormOverlay) {
        createEditForm();
    } else {
        editFormOverlay.classList.toggle('show');
    }
}

function createEditForm() {

    let userdetails = localStorage.getItem('userdetails');
    if(userdetails){
        userdetails = JSON.parse(userdetails);
    }
    const editFormOverlay = document.createElement('div');
    editFormOverlay.className = 'edit-form-overlay';
    editFormOverlay.addEventListener('click', function(event) {
        if (event.target === editFormOverlay) {
            toggleEditForm();
        }
    });

    const editForm = document.createElement('div');
    editForm.className = 'edit-form';
    editForm.innerHTML = `
        <span class="close-btn" onclick="toggleEditForm()">&times;</span>
        <div class="form-group">
            <label for="firstnameInput">First Name:</label>
            <input type="text" id="firstnameInput" placeholder="${userdetails.firstName}" required>
        </div>
        <div class="form-group">
            <label for="lastnameInput">Last Name:</label>
            <input type="text" id="lastnameInput" placeholder="${userdetails.lastName}" required>
        </div>
        <div class="form-group">
            <label for="profilePicInput">Profile Picture URL:</label>
            <input type="file" id="profilePicInput" placeholder="Upload profile">
        </div>
        <div class="form-group">
            <label for="bioTextarea">Bio:</label>
            <textarea id="bioTextarea" placeholder="${userdetails.profileDescription}"></textarea>
        </div>
        <button onclick="saveProfileChanges()">Save</button>
    `;

    editFormOverlay.appendChild(editForm);
    document.body.appendChild(editFormOverlay);

    editForm.classList.add('show');
}


function saveProfileChanges() {

    let userdetails = localStorage.getItem('userdetails');
    userdetails = JSON.parse(userdetails);

    const emailAddress = userdetails.emailAddress; // Assuming you have the user's email address
    const firstName = document.getElementById('firstnameInput').value;
    const lastName = document.getElementById('lastnameInput').value;
    const profilePicInput = document.getElementById('profilePicInput');
    const profilePic = profilePicInput.files[0]; // Get the selected profile picture file
    const bio = document.getElementById('bioTextarea').value;

    // Create a FormData object to send the data as multipart/form-data
    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('profileDescription', bio);
    if (profilePic) {
        formData.append('profileImage', profilePic);
    }

   // Make an HTTP request to the backend API
        fetch(`https://52.16.194.174:8085/api/users/update/${emailAddress}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${jwttoken}` // Include the token in the Authorization header
            },
            body: formData
        })
        .then(response => {
            if (response.ok) {
                console.log('Profile updated successfully');
                toggleEditForm(); // Toggle the edit form after successful update'
                createProfileHeaderAndGallery();
            } else {
                console.error('Failed to update profile');
            }
        })
        .catch(error => {
            console.error('Error updating profile:', error);
        });

}


