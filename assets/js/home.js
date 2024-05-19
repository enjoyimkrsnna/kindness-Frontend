async function createPost() {
    let jwttoken = localStorage.getItem("jwttoken");
    const userDetailsString = localStorage.getItem("userdetails");
    const userDetails = JSON.parse(userDetailsString);
    let userId = userDetails.userId;
    console.log(userId);
    console.log(jwttoken);
  
    const postContainer = document.querySelector(".main-content");
    postContainer.innerHTML = "";
  
    const response = await fetch(
      "https://kindnesskettle.projects.bbdgrad.com/api/fetchAllDonationPosts",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwttoken}`,
        },
      }
    );
    const data = await response.json();
    console.log(data);
  
    data?.map(async (postRespone) => {
      let loginUserId = postRespone.donationPost.user.userId;
      console.log(loginUserId);
  
      const postCard = document.createElement("div");
      postCard.className = "postCard";
  
      const cardHeader = document.createElement("div");
      cardHeader.className = "cardHeader";
  
      const userlogoName = document.createElement("div");
      userlogoName.className = "userlogoName";
  
      const userImg = document.createElement("img");
      userImg.src = `${postRespone.donationPost.user.imageUrl}`;
      userImg.alt = "me";
      userImg.className = "user-img";
  
      const userName = document.createElement("span");
      userName.textContent =
        postRespone.donationPost.user.firstName +
        " " +
        postRespone.donationPost.user.lastName;
  
      userlogoName.appendChild(userImg);
      userlogoName.appendChild(userName);
  
      const timerBtn = document.createElement("div");
      timerBtn.className = "pickUpbtn";
  
      const pickUpBtn = document.createElement("div");
      pickUpBtn.className = "pickUpbtn";
      pickUpBtn.innerHTML = '<i class="bx bx-donate-heart">PickUp</i>';
  
      if (postRespone.donationPost.foodType.foodId === 1) {
        pickUpBtn.style.backgroundColor = "green";
      } else {
        pickUpBtn.style.backgroundColor = "red";
      }
  
      if(postRespone.donationPost.user.userId === userId){
          pickUpBtn.style.display = "none"
      }
  
      
      cardHeader.appendChild(userlogoName);
      cardHeader.appendChild(timerBtn);
      cardHeader.appendChild(pickUpBtn);
  
      const postImage = document.createElement("div");
      postImage.className = "postImage";
  
      const postImg = document.createElement("img");
      postImg.src =
        `${postRespone?.donationPost?.foodImageUrl}` ||
        "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg";
      postImg.alt = "me";
  
      postImage.appendChild(postImg);
  
      const foodType = document.createElement("div");
      foodType.className = "foodtype";
      foodType.innerHTML = `<p><strong>Foodtype</strong> - ${postRespone.donationPost.foodType.foodType}</p>`;
  
      const postAddress = document.createElement("div");
      postAddress.className = "postAddress";
      postAddress.innerHTML = `<p><strong>Address-</strong>${postRespone.donationPost.address.addressLine} ${postRespone.donationPost.address.pincode}</p>`;
  
      const LiketResponse = await fetch(
        `https://kindnesskettle.projects.bbdgrad.com/api/kindnessKettle/like/get?postId=${postRespone.donationPost.postId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwttoken}`,
          },
        }
      );
      const LikeData = await LiketResponse.json();
      console.log(LikeData);
  
      let TotalLike = LikeData[0]?.totalLikes || 0;
  
      let isLiked = false;
      const likeComment = document.createElement("div");
      likeComment.className = "likeComment";
      const likeIcon = document.createElement("i");
      likeIcon.className = "bx bx-heart";
      LikeData?.map((user) => {
        console.log(user);
        if (userId === user.user.userId) {
          console.log("user liked");
          likeIcon.className = "bx bxs-heart";
          isLiked = true;
        }
      });
      likeIcon.style.cursor = "pointer";
      likeComment.appendChild(likeIcon);
      likeComment.innerHTML += " <i class='bx bx-message-rounded-dots'></i>";
  
      const likeCommentTotal = document.createElement("div");
      likeCommentTotal.className = "likeCommentTotal";
      likeCommentTotal.innerHTML = `<p><strong>${TotalLike}</strong> Likes</p><p class="showComment">View all <strong>18</strong> Comments</p>`;
  
      const inputBoxComment = document.createElement("div");
      inputBoxComment.className = "InputBoxComment";
      inputBoxComment.style.display = "none";
  
      const commentData = await fetch(
        `https://kindnesskettle.projects.bbdgrad.com/api/getComment/${postRespone.donationPost.postId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwttoken}`,
          },
        }
      );
      const commentResponse = await commentData.json();
  
      console.log(commentResponse);
  
      const commentIds = []; // Array to store comment IDs
  
      inputBoxComment.innerHTML = `
          <div class="commenttext">
              ${commentResponse
                .map((comment) => {
                  commentIds.push(comment.CommentID); // Store comment ID
                  return `
                      <div class="commentItem" data-comment-id="${
                        comment.CommentID
                      }">
                          <img src="https://i.pinimg.com/474x/17/01/29/170129210e99f5083afbffb6109f6b3d.jpg" alt="User" class="commentUserImg">
                          <p class="commentUserName">${comment.UserName}:</p>
                          <p>${comment.comment_content}</p>
                          ${
                            userId === comment.UserID
                              ? '<button class="deleteCommentBtn">Delete</button>'
                              : ""
                          }
                      </div>
                  `;
                })
                .join("")}
          </div>
          <div class="commentInput">
              <input type="text" name="comment" id="commentId">
              <div class="sendbtn" id="sendCommentBtn">
                  <i class="bx bxs-send"></i>
                  <p>Send</p>
              </div>
          </div>
      `;
  
      console.log("Loaded Comment IDs:", commentIds); // Log loaded comment IDs
  
      postCard.appendChild(cardHeader);
      postCard.appendChild(postImage);
      postCard.appendChild(foodType);
      postCard.appendChild(postAddress);
      postCard.appendChild(likeComment);
      postCard.appendChild(likeCommentTotal);
      postCard.appendChild(inputBoxComment);
  
      postContainer.appendChild(postCard);
  
      const showCommentButton = postCard.querySelector(".showComment");
      const commentText = postCard.querySelector(".commenttext");
      const commentInputBox = postCard.querySelector(".InputBoxComment");
  
      showCommentButton.addEventListener("click", function () {
        const isHidden =
          commentText.style.display === "none" ||
          commentText.style.display === "";
        commentText.style.display = isHidden ? "block" : "none";
        commentInputBox.style.display = isHidden ? "block" : "none";
        showCommentButton.textContent = isHidden
          ? "Hide all Comments"
          : "View all Comments";
      });
  
      const likeButton = postCard.querySelector(".likeComment");
  
      ////////////////////////likepost//////////////
  
      likeButton.addEventListener("click", async function () {
        console.log("hell liked");
        isLiked = !isLiked;
        TotalLike += isLiked ? 1 : -1;
        likeCommentTotal.innerHTML = `<p><strong>${TotalLike}</strong> Likes</p><p class="showComment">View all <strong>18</strong> Comments</p>`;
        likeIcon.className = isLiked ? "bx bxs-heart" : "bx bx-heart";
  
        const apiEndpoint = isLiked ? "add" : "delete";
        const method = isLiked ? "POST" : "DELETE";
  
        try {
          await fetch(
            `https://kindnesskettle.projects.bbdgrad.com/api/kindnessKettle/like/${apiEndpoint}?userId=${userId}&postId=${postRespone.donationPost.postId}`,
            {
              method: method,
              headers: {
                Authorization: `Bearer ${jwttoken}`,
              },
            }
          );
        } catch (error) {
          console.error("Error updating like status:", error);
  
          isLiked = !isLiked;
          TotalLike += isLiked ? -1 : 1;
          likeCommentTotal.innerHTML = `<p><strong>${TotalLike}</strong> Likes</p><p class="showComment">View all <strong>18</strong> Comments</p>`;
          likeIcon.className = isLiked ? "bx bxs-heart" : "bx bx-heart";
        }
      });
  
      // Handle adding a new comment
      const sendCommentBtn = postCard.querySelector("#sendCommentBtn");
      sendCommentBtn.addEventListener("click", async function () {
        const commentInput = postCard.querySelector("#commentId");
        const commentContent = commentInput.value.trim();
        if (commentContent) {
          try {
            const response = await fetch("https://kindnesskettle.projects.bbdgrad.com/api/comments", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwttoken}`,
              },
              body: JSON.stringify({
                userId: userId,
                postId: postRespone.donationPost.postId,
                commentContent: commentContent,
              }),
            });
            const newComment = await response.json();
            console.log(newComment);
  
            const commentItem = document.createElement("div");
            commentItem.className = "commentItem";
            commentItem.dataset.commentId = newComment.comment_id;
            commentItem.innerHTML = `
                          <img src="https://i.pinimg.com/474x/17/01/29/170129210e99f5083afbffb6109f6b3d.jpg" alt="User" class="commentUserImg">
                          <p class="commentUserName">${
                            newComment.user_id.firstName +
                            " " +
                            newComment.user_id.lastName
                          }:</p>
                          <p>${newComment.comment_content}</p>
                          <button class="deleteCommentBtn">Delete</button>
                      `;
            commentText.appendChild(commentItem);
            commentInput.value = "";
  
            commentIds.push(newComment.comment_id); // Store new comment ID
            console.log("Added Comment ID:", newComment.comment_id); // Log new comment ID
  
            // Add delete event listener to the new comment
            commentItem
              .querySelector(".deleteCommentBtn")
              .addEventListener("click", async function () {
                const commentId = newComment.comment_id;
                await deleteComment(commentId, commentItem);
              });
          } catch (error) {
            console.error("Error adding comment:", error);
          }
        }
      });
  
      // Handle deleting a comment
      async function deleteComment(commentId, commentElement) {
        try {
          await fetch(`https://kindnesskettle.projects.bbdgrad.com/api/delete_comments/${commentId}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${jwttoken}`,
            },
          });
          commentElement.remove();
          const index = commentIds.indexOf(commentId);
          if (index > -1) {
            commentIds.splice(index, 1); // Remove comment ID from array
          }
          console.log("Deleted Comment ID:", commentId); // Log deleted comment ID
        } catch (error) {
          console.error("Error deleting comment:", error);
        }
      }
  
      // Add delete event listener to existing comments
      const deleteCommentButtons = postCard.querySelectorAll(".deleteCommentBtn");
      deleteCommentButtons.forEach((button) => {
        button.addEventListener("click", async function () {
          const commentId = button.parentElement.dataset.commentId;
          await deleteComment(commentId, button.parentElement);
        });
      });
  
      // Timer logic
      const timeAvailable = new Date(
        postRespone.donationPost.timeAvailable
      ).getTime();
  
      function updateTimer() {
        const now = new Date().getTime();
        const distance = timeAvailable - now;
  
        if (distance < 0) {
          timerBtn.innerHTML = "Expired";
          pickUpBtn.classList.add("disabled");
          pickUpBtn.innerHTML =
            '<i class="bx bx-donate-heart">PickUp (Expired)</i>';
          pickUpBtn.style.cursor = "not-allowed";
          return;
        }
  
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
  
        timerBtn.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
  
        setTimeout(updateTimer, 1000);
      }
  
      updateTimer();
  
      // Add event listener to the "PickUp" button
      pickUpBtn.addEventListener("click", async function () {
          alert("i am pickup ")
        if (pickUpBtn.classList.contains("disabled")) return; // Do nothing if the button is disabled
  
        try {
          // Update the post status
          const updateStatusResponse = await fetch(
            `https://kindnesskettle.projects.bbdgrad.com/api/updateactive/${postRespone.donationPost.postId}/status?isPicked=${true}`,
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${jwttoken}`,
              },
            }
          );
  
          if (!updateStatusResponse.ok)
            throw new Error("Failed to update post status");
  
          // Update user details and pickup details
          const updatePostResponse = await fetch(
            `https://kindnesskettle.projects.bbdgrad.com/api/pickup`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${jwttoken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                  pickedUpByUserId : userId,
                  postId:postRespone.donationPost.postId
  
                // Add other necessary details here
              }),
            }
          );
  
          if (!updatePostResponse.ok)
            throw new Error("Failed to update post details");
  
          // Optionally, update the UI to reflect the successful pickup
          pickUpBtn.innerHTML = '<i class="bx bx-donate-heart">Picked Up</i>';
          pickUpBtn.classList.add("disabled");
          pickUpBtn.style.cursor = "not-allowed";
        } catch (error) {
          console.error("Error updating post status and details:", error);
        }
      });

    });
  }
  