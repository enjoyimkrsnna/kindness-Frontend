async function createPost() {
    let jwttoken = localStorage.getItem('jwttoken');
    console.log(jwttoken);
        const postContainer = document.querySelector('.main-content');
        postContainer.innerHTML = ''; 

        const response = await fetch('http://52.16.194.174:8085/fetchAllDonationPosts',{   
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${jwttoken}` 
                }
            });
            const data = await response.json();
            console.log(data);

            data?.map(async(postRespone)=>{

   

        const postCard = document.createElement('div');
        postCard.className = 'postCard';

        const cardHeader = document.createElement('div');
        cardHeader.className = 'cardHeader';

        const userlogoName = document.createElement('div');
        userlogoName.className = 'userlogoName';

        const userImg = document.createElement('img');
        userImg.src = `${postRespone.donationPost.user.imageUrl}`;
        userImg.alt = 'me';
        userImg.className = 'user-img';

        const userName = document.createElement('span');
        userName.textContent = postRespone.donationPost.user.firstName + " " + postRespone.donationPost.user.lastName ;

        userlogoName.appendChild(userImg);
        userlogoName.appendChild(userName);

        const pickUpBtn = document.createElement('div');
        pickUpBtn.className = 'pickUpbtn';
        pickUpBtn.innerHTML = '<i class="bx bx-donate-heart">PickUp</i>';

        cardHeader.appendChild(userlogoName);
        cardHeader.appendChild(pickUpBtn);

        const postImage = document.createElement('div');
        postImage.className = 'postImage';

        const postImg = document.createElement('img');
        postImg.src = `${postRespone?.donationPost?.foodImageUrl}` || "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg";
        postImg.alt = 'me';

        postImage.appendChild(postImg);

        const foodType = document.createElement('div');
        foodType.className = 'foodtype';
        foodType.innerHTML = `<p><strong>Foodtype</strong> - ${postRespone.donationPost.foodType.foodType}</p>`;

        const postAddress = document.createElement('div');
        postAddress.className = 'postAddress';
        postAddress.innerHTML = `<p><strong>Address-</strong>${postRespone.donationPost.address.addressLine} ${postRespone.donationPost.address.pincode}</p>`;

    
        
        const LiketResponse = await fetch(`http://52.16.194.174:8085/kindnessKettle/like/get?postId=${postRespone.donationPost.postId}`,
        {   
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${jwttoken}` // Use the received token
                }
            }
        );
        const LikeData = await LiketResponse.json();
        console.log(LikeData);

        let TotalLike =LikeData[0]?.totalLikes || 0;


        let isLiked = false;
        const likeComment = document.createElement('div');
        likeComment.className = 'likeComment';
        const likeIcon = document.createElement('i');
        likeIcon.className = 'bx bx-heart';
        LikeData?.map(user=>{
            console.log(user.user.userId);
             if(user.user.userId===postRespone.donationPost.user.userId){
                console.log("user liked");
                likeIcon.className = 'bx bxs-heart';
                isLiked = true;
             }
        })
        likeIcon.style.cursor = 'pointer';
        likeComment.appendChild(likeIcon);
        likeComment.innerHTML += " <i class='bx bx-message-rounded-dots'></i>";



        const likeCommentTotal = document.createElement('div');
        likeCommentTotal.className = 'likeCommentTotal';
        likeCommentTotal.innerHTML = `<p><strong>${TotalLike}</strong> Likes</p><p class="showComment">View all <strong>18</strong> Comments</p>`;

        const inputBoxComment = document.createElement('div');
        inputBoxComment.className = 'InputBoxComment';
        inputBoxComment.style.display = 'none';
      
    //   const commentResponse =  [
    //         {
    //             "comment_date_time": null,
    //             "UserImage": null,
    //             "comment_content": "hello ajay",
    //             "UserName": "john_doe",
    //             "UserID": 1,
    //             "PostId": 36,
    //             "CommentID": 20
    //         },
    //         {
    //             "comment_date_time": null,
    //             "UserImage": null,
    //             "UserName": "john_doe",
    //             "UserID": 1,
    //             "comment_content": "hi how nice very good",
    //             "CommentID": 37,
    //             "PostId": 36
    //         }
    //     ]
        const commentData = await fetch(`http://52.16.194.174:8085/getComment/${postRespone.donationPost.postId}`,
        {   
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${jwttoken}` 
                }
            }
        );
            const commentResponse = await commentData.json();

            console.log(commentResponse);


        inputBoxComment.innerHTML = `
        <div class="commenttext">
            ${commentResponse.map(comment => `
                <div class="commentItem">
                    <img src="https://i.pinimg.com/474x/17/01/29/170129210e99f5083afbffb6109f6b3d.jpg" alt="User" class="commentUserImg">
                    <p class="commentUserName">User1:</p>
                    <p>${comment.comment_content}</p>
                </div>
            `).join('')}
        </div>
        <div class="commentInput">
            <input type="text" name="comment" id="commentId">
            <div class="sendbtn" id="sendCommentBtn">
                <i class="bx bxs-send"></i>
                <p>Send</p>
            </div>
        </div>
    `;
        
        postCard.appendChild(cardHeader);
        postCard.appendChild(postImage);
        postCard.appendChild(foodType);
        postCard.appendChild(postAddress);
        postCard.appendChild(likeComment);
        postCard.appendChild(likeCommentTotal);
        postCard.appendChild(inputBoxComment);

        postContainer.appendChild(postCard);

        const showCommentButton = postCard.querySelector('.showComment');
        const commentText = postCard.querySelector('.commenttext');
        const commentInputBox = postCard.querySelector('.InputBoxComment');

        showCommentButton.addEventListener('click', function() {
            const isHidden = commentText.style.display === 'none' || commentText.style.display === '';
            commentText.style.display = isHidden ? 'block' : 'none';
            commentInputBox.style.display = isHidden ? 'block' : 'none';
            showCommentButton.textContent = isHidden ? 'Hide all Comments' : 'View all Comments';
        });

        const likeButton = postCard.querySelector('.likeComment');

        ////////////////////////likepost//////////////

       
        likeButton.addEventListener('click', async function() {
            console.log("hell liked")
            isLiked = !isLiked;
            TotalLike += isLiked ? 1 : -1;
            likeCommentTotal.innerHTML = `<p><strong>${TotalLike}</strong> Likes</p><p class="showComment">View all <strong>18</strong> Comments</p>`;
            likeIcon.className = isLiked ? 'bx bxs-heart' : 'bx bx-heart';
            await fetch(`http://52.16.194.174:8085/kindnessKettle/like/${isLiked ? 'add' : 'delete'}?userId=${user.user.userId}&postId=${postRespone.donationPost.postId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${jwttoken}`
                }
            });
        });
        
    });
    }