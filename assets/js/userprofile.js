function createProfileHeaderAndGallery(profileData = {
    username: "imkrsnna",
    realName: "krishna singh",
    bio: "Young and hungry",
    donations: 164,
    likes: 188,
    profileImage: "https://images.unsplash.com/photo-1513721032312-6a18a42c8763?w=152&h=152&fit=crop&crop=faces",
    galleryImages: [
        "https://images.unsplash.com/photo-1513721032312-6a18a42c8763?w=152&h=152&fit=crop&crop=faces",
        "https://images.unsplash.com/photo-1513721032312-6a18a42c8763?w=152&h=152&fit=crop&crop=faces",
        "https://images.unsplash.com/photo-1513721032312-6a18a42c8763?w=152&h=152&fit=crop&crop=faces"
    ]
}) {
    const mainContent = document.getElementById('main-content');

    // Create profile content
    const profile = document.createElement('div');
    profile.className = 'profile';

    const profileImageDiv = document.createElement('div');
    profileImageDiv.className = 'profile-image';
    const profileImage = document.createElement('img');
    profileImage.src = profileData.profileImage;
    profileImage.alt = profileData.username;
    profileImageDiv.appendChild(profileImage);

    const profileUserSettings = document.createElement('div');
    profileUserSettings.className = 'profile-user-settings';
    const profileUserName = document.createElement('h1');
    profileUserName.className = 'profile-user-name';
    profileUserName.textContent = profileData.username;
    const editButton = document.createElement('button'); 
    editButton.className = 'btn profile-edit-btn'; 
    editButton.textContent = 'Edit Profile'; 
    // Assuming toggleEditForm is defined elsewhere
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
    donations.innerHTML = `<span class="profile-stat-count">${profileData.donations}</span> Donation`;
    const likes = document.createElement('li');
    likes.innerHTML = `<span class="profile-stat-count">${profileData.likes}</span> Likes`;
    statsList.appendChild(donations);
    statsList.appendChild(likes);
    profileStats.appendChild(statsList);

    const profileBio = document.createElement('div');
    profileBio.className = 'profile-bio';
    profileBio.innerHTML = `<p><span class="profile-real-name">${profileData.realName}</span> ${profileData.bio}</p>`;

    profile.appendChild(profileImageDiv);
    profile.appendChild(profileUserSettings);
    profile.appendChild(profileStats);
    profile.appendChild(profileBio);

    // Create gallery content
    const galleryContainer = document.createElement('div');
    galleryContainer.className = 'container';
    const gallery = document.createElement('div');
    gallery.className = 'gallery';
    profileData.galleryImages.forEach(src => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        const galleryImage = document.createElement('img');
        galleryImage.className = 'gallery-image';
        galleryImage.src = src;
        galleryImage.alt = '';
        galleryItem.appendChild(galleryImage);
        gallery.appendChild(galleryItem);
    });
    galleryContainer.appendChild(gallery);

    // Append profile and gallery content to main content container
    mainContent.innerHTML = '';
    mainContent.appendChild(profile);
    mainContent.appendChild(galleryContainer);
}


function toggleEditForm() {
    // Your implementation for toggling the edit form visibility
    const editFormOverlay = document.querySelector('.edit-form-overlay');
    editFormOverlay.classList.toggle('show');
}
