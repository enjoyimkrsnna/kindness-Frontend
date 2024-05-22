async function createPost() {
  let jwttoken = localStorage.getItem("jwttoken");
  const userDetailsString = localStorage.getItem("userdetails");
  const userDetails = JSON.parse(userDetailsString);
  let userId = userDetails.userId;
  console.log(userId);
  console.log(jwttoken);


  function showError(message, type = "fail") {
    const errorCard = document.getElementById("errorCard");
    errorCard.textContent = message || "i am fail";
    errorCard.classList.add("error-card", type);
    errorCard.style.display = "block";

    setTimeout(() => {
      errorCard.style.display = "none";
      errorCard.classList.remove("error-card", type);
    }, 5000);
  }



  const postContainer = document.querySelector(".main-content");
  postContainer.innerHTML = "";

  const loader = document.querySelector(".loader");
  loader.style.display = "block";
  try {
    
 
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

  loader.style.display = "none";

  

  const gallaryHome = document.createElement("div");
  gallaryHome.className = "gallaryHomeCard";

  const filter = document.createElement("div");
  filter.className = "filterPost";

  const filterDropdown = document.createElement("select");
  filterDropdown.id = "filterDropdown";
  filterDropdown.innerHTML = `
    <option value="all">All</option>
    <option value="1">Veg</option>
    <option value="2">Non-veg</option>
  `;
  filter.appendChild(filterDropdown);
  gallaryHome.appendChild(filter);

  const gallery = document.createElement("div");
  gallery.className = "gallery";
  gallaryHome.appendChild(gallery);
  postContainer.appendChild(gallaryHome);

  let errorCard = document.createElement("div");
    errorCard.classList.add("error-card");
    errorCard.id = "errorCard";
    gallaryHome.appendChild(errorCard);

  function renderPosts(data) {
    gallery.innerHTML = "";

    data?.map(async (postRespone) => {
      let loginUserId = postRespone.donationPost.user.userId;

      const PosttimeAvailable = new Date(
        postRespone.donationPost.timeAvailable
      ).getTime();
      const now = new Date().getTime();

      if (PosttimeAvailable < now) {
        return;
      }

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

      if (postRespone.donationPost.user.userId === userId) {
        pickUpBtn.style.display = "none";
      }

      if (postRespone.donationPost.isPickupCompleted) {
        pickUpBtn.classList.add("disabled");
        pickUpBtn.innerHTML = '<i class="bx bx-donate-heart">Picked</i>';
        pickUpBtn.style.cursor = "not-allowed";
      }

      cardHeader.appendChild(userlogoName);
      // cardHeader.appendChild(timerBtn);
      cardHeader.appendChild(pickUpBtn);

      const postImage = document.createElement("div");
      postImage.className = "postImage";

      const postImg = document.createElement("img");
      postImg.src =
        `${postRespone?.donationPost?.foodImageUrl}` ||
        "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg";
      postImg.alt = "me";

      postImage.appendChild(postImg);

      const FoodExpiryTime = document.createElement("div");
      FoodExpiryTime.className = "expireTime";
      // FoodExpiryTime.innerHTML = `<p><strong>Expire-Time</strong> - ${postRespone.donationPost.foodType.foodType}</p>`;

      const foodType = document.createElement("div");
      foodType.className = "foodtype";
      foodType.innerHTML = `<p><strong>Food</strong> - ${postRespone.donationPost.foodType.foodType}</p>`;

      const postAddress = document.createElement("div");
      postAddress.className = "postAddress";
      postAddress.innerHTML = `<p><strong>Address-</strong>${postRespone.donationPost.address.addressLine} ${postRespone.donationPost.address.pincode}</p>`;

      const likeComment = document.createElement("div");
      likeComment.className = "likeComment";
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

      let isLiked = LikeData.some((user) => user.user.userId === userId);
     
      const likeIcon = document.createElement("i");
      likeIcon.className = isLiked ? "fa-solid fa-heart" : "far fa-heart";
      likeIcon.style.color = isLiked ? "red" : "";

      likeIcon.style.cursor = "pointer";
      likeComment.appendChild(likeIcon);

      // likeComment.innerHTML += "";

      const likeCommentTotal = document.createElement("div");
      likeCommentTotal.className = "likeCommentTotal";
      likeCommentTotal.innerHTML = `<p><strong>${TotalLike}</strong> Likes</p><p class="showComment">View all <strong></strong> Comments</p>`;

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

      const commentIds = [];

      inputBoxComment.innerHTML = `
        <div class="commenttext">
            ${commentResponse
              .map((comment) => {
                commentIds.push(comment.CommentID);
                return `
                    <div class="commentItem" data-comment-id="${
                      comment.CommentID
                    }">
                        <img src="https://i.pinimg.com/474x/17/01/29/170129210e99f5083afbffb6109f6b3d.jpg" alt="User" class="commentUserImg">
                        <p class="commentUserName">${comment.UserName}:</p>
                        <p>${comment.comment_content}</p>
                        ${
                          userId === comment.UserID
                            ? '<i class="bi bi-trash deleteCommentBtn"></i>'
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

      console.log("Loaded Comment IDs:", commentIds);

      // const overlayPostComment = document.createElement("div")
      // overlayPostComment.class = "post-comment";


      postCard.appendChild(cardHeader);
      postCard.appendChild(postImage);
      postCard.appendChild(FoodExpiryTime);
      postCard.appendChild(foodType);
      postCard.appendChild(postAddress);
      postCard.appendChild(likeComment);
      // postCard.appendChild(overlayPostComment);
      postCard.appendChild(likeCommentTotal);
      postCard.appendChild(inputBoxComment);
     

      gallery.appendChild(postCard);

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
        loader.style.display = "block";
        const apiEndpoint = isLiked ? "delete" : "add";
        const method = isLiked ? "DELETE" : "POST";

        try {
          const response = await fetch(
            `https://kindnesskettle.projects.bbdgrad.com/api/kindnessKettle/like/${apiEndpoint}?userId=${userId}&postId=${postRespone.donationPost.postId}`,
            {
              method: method,
              headers: {
                Authorization: `Bearer ${jwttoken}`,
              },
            }
          );

          if (response.ok) {

            isLiked = !isLiked;
            
            TotalLike += isLiked ? 1 : -1;
            likeIcon.className = isLiked ? "fa-solid fa-heart" : "far fa-heart";
            likeIcon.style.color = isLiked ? "red" : "";
            likeCommentTotal.innerHTML = `<p><strong>${TotalLike}</strong> Likes</p><p class="showComment">View all <strong></strong> Comments</p>`;
            if(apiEndpoint==='delete'){
              showError("Unliked!!!");
            }else{
              showError("Liked successfull","success");
            }
          } else {
            throw new Error("Failed to update like status");
          }
          loader.style.display = "none";
        } catch (error) {
          showError(error);
          console.error("Error updating like status:", error);
          loader.style.display = "none";
        }
      });

     
      const sendCommentBtn = postCard.querySelector("#sendCommentBtn");
      sendCommentBtn.addEventListener("click", async function () {
        loader.style.display = "block";
        const commentInput = postCard.querySelector("#commentId");
        const commentContent = commentInput.value.trim();
        if (commentContent) {
          try {
            const response = await fetch(
              "https://kindnesskettle.projects.bbdgrad.com/api/comments",
              {
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
              }
            );
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
                        <i class="bi bi-trash deleteCommentBtn"></i>'
                    `;
            commentText.appendChild(commentItem);
            commentInput.value = "";

            commentIds.push(newComment.comment_id);
            console.log("Added Comment ID:", newComment.comment_id);

            commentItem
              .querySelector(".deleteCommentBtn")
              .addEventListener("click", async function () {
                const commentId = newComment.comment_id;
                await deleteComment(commentId, commentItem);
              });
            loader.style.display = "none";
          } catch (error) {
            console.error("Error adding comment:", error);
            loader.style.display = "none";
          }
        }
      });

  
      async function deleteComment(commentId, commentElement) {
        loader.style.display = "block";
        try {
          await fetch(
            `https://kindnesskettle.projects.bbdgrad.com/api/delete_comments/${commentId}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${jwttoken}`,
              },
            }
          );
          commentElement.remove();
          const index = commentIds.indexOf(commentId);
          if (index > -1) {
            commentIds.splice(index, 1);
          }
          console.log("Deleted Comment ID:", commentId);
          loader.style.display = "none";
          showError("Comment Deleted Successfully","success");
        } catch (error) {
          console.error("Error deleting comment:", error);
          loader.style.display = "none";
          showError("Error deleting comment")
        }
      }

      const deleteCommentButtons =
        postCard.querySelectorAll(".deleteCommentBtn");
      deleteCommentButtons.forEach((button) => {
        button.addEventListener("click", async function () {
          const commentId = button.parentElement.dataset.commentId;
          await deleteComment(commentId, button.parentElement);
        });
      });

   
      const timeAvailable = new Date(
        postRespone.donationPost.timeAvailable
      ).getTime();

      function updateTimer() {
        const now = new Date().getTime();
        const distance = timeAvailable - now;

        if (distance < 0) {
          timerBtn.innerHTML = "Expired";
          FoodExpiryTime.innerHTML = "Expired";
          pickUpBtn.classList.add("disabled");
          pickUpBtn.innerHTML =
            '<i class="bx bx-donate-heart">PickUp (Expired)</i>';
          pickUpBtn.style.cursor = "not-allowed";
          pickUpBtn.style.display = "none";
          pickUpBtn.style.backgroundColor = "red";

          return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (days >= 6) {
          FoodExpiryTime.style.backgroundColor = "green";
        } else if (days < 6 && days >= 1) {
          FoodExpiryTime.style.backgroundColor = "pink";
        } else {
          FoodExpiryTime.style.backgroundColor = "red";
        }
        timerBtn.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        FoodExpiryTime.innerHTML = `<p><strong>Expire-Time</strong> - ${days}d ${hours}h ${minutes}m ${seconds}s</p>`;

        setTimeout(updateTimer, 1000);
      }

      updateTimer();

      pickUpBtn.addEventListener("click", async function () {
        if (pickUpBtn.classList.contains("disabled")) return;

        try {
          const updateStatusResponse = await fetch(
            `https://kindnesskettle.projects.bbdgrad.com/api/updateactive/${
              postRespone.donationPost.postId
            }/status?isPicked=${true}`,
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${jwttoken}`,
              },
            }
          );

          if (!updateStatusResponse.ok)
            throw new Error("Failed to update post status");

          const updatePostResponse = await fetch(
            `https://kindnesskettle.projects.bbdgrad.com/api/pickup`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${jwttoken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                pickedUpByUserId: userId,
                postId: postRespone.donationPost.postId,
              }),
            }
          );

          if (!updatePostResponse.ok)
            throw new Error("Failed to update post details");

          pickUpBtn.innerHTML = '<i class="bx bx-donate-heart">Picked Up</i>';
          pickUpBtn.classList.add("disabled");
          pickUpBtn.style.cursor = "not-allowed";
          showError("Pickup successfully","success");
        } catch (error) {
          showError("Error in updating the details");
          console.error("Error updating post status and details:", error);
        }
      });
    });
  }
 


  filterDropdown.addEventListener("change", function () {
    const selectedValue = filterDropdown.value;
    let filteredPosts;
    if (selectedValue === "all") {
      filteredPosts = data;
    } else {
      filteredPosts = data.filter(
        (post) => post.donationPost.foodType.foodId === parseInt(selectedValue)
      );
    }
    renderPosts(filteredPosts);
  });

  renderPosts(data);
} catch (error) {

  console.log("something went wrong");
  loader.style.display = "none";
}
}


