

const loadLogin = () => {
    const clientId = '703310288937-m5t1ki80ogdfl3i0seuu168bnbk5h8qa.apps.googleusercontent.com';
    const redirectUri = 'http://localhost:5501/home.html';
    const scope = 'email profile openid';


    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=id_token&scope=${scope}&nonce=123`;


    window.location.href = authUrl;
}

const parseTokenFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.hash.substring(1));
    return urlParams.get('id_token');

}
    const fetchUserInfo = (idToken) => {
    const decodedToken = parseJwt(idToken);
    const email = decodedToken.email;
    const name = decodedToken.name;
    console.log(idToken);
    console.log(email);
    console.log(name);
    localStorage.setItem('jwttoken',idToken);
    sessionStorage.setItem('email', email);
    sessionStorage.setItem('name', name);

    const url = `http://52.16.194.174:8085/login/auth?email=${encodeURIComponent(email)}`;

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({ email: email })
    };

    fetch(url, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
        
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return response.json(); // Parse JSON response
            } else {
                return response.text(); // Return plain text response
            }
        })
        .then(result => {
            console.log(result);
            if (!result) {
                console.log('user is not valid')
            } else {
                const userAccount = result.userAccount;
                localStorage.setItem('userdetails', JSON.stringify(userAccount)); // Store user details as string
                console.log("user is valid ", userAccount);
                homepage();
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

const parseJwt = (token) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

const logout = () => {
    sessionStorage.clear();
    loadLogin();
}



function fetchUserData() {
    // Assuming you have the user ID stored in localStorage
    const userDetailsString = localStorage.getItem('userdetails');

    // Parse the user details JSON string into an object
    const userDetails = JSON.parse(userDetailsString);
    //console.log(userDetails);

    let jwttoken = localStorage.getItem('jwttoken');
    let userId = userDetails.userId;

    // console.log(jwttoken)
    // Fetch user data from the provided API
    fetch(`http://52.16.194.174:8085/kindnesskettle/useranalytics/${userId}`, {
        headers: {
            'Authorization': `Bearer ${jwttoken}`
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log("user data:",data)
    
    })
    .catch(error => console.error("Error fetching user data:", error));
}


async function SavePost() {


    let jwttoken = localStorage.getItem('jwttoken');


    fetch('http://52.16.194.174:8085/donationPosts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwttoken}`
        },
        body: JSON.stringify({
            "userId": 6,
            "foodTypeId": 2,
            "addressLine": "hello mini",
            "pincode": "7678673",
            "longitude": 45.678,
            "latitude": 78.901,
            "foodImageUrl": "http://example.com/kutta.com",
            "timeAvailable": "2024-03-25T12:00:00"
        }),
    })
    .then(response => {
        if (response.ok) {
            console.log('Post saved successfully:');
        
        }
    
    })
    .then(data => {
        console.log('Post saved successfully:', data);
    
    })
    .catch(error => {
        console.error('There was a problem saving the post:', error);
    
    });

}