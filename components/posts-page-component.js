import { USER_POSTS_PAGE, AUTH_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, user } from "../index.js";
import { getUserFromLocalStorage } from "../helpers.js";
import { addDislike, addLike, deleteYourPost } from "../api.js";
import { likes } from "./likes-names-components.js";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

export function renderPostsPageComponent({ appEl }) {
  function renderPosts() {
    let postHtml = posts
      .map((el) => {
        return `<li class="post">
    <div class="post-header" data-user-id=${el.user.id}>
        <img src=${el.user.imageUrl} class="post-header__user-image">
        <p class="post-header__user-name">${el.user.name}</p>
    </div>
    <div class="post-image-container">
      <img class="post-image" src=${el.imageUrl}>
    </div>
    <div class="post-likes">
      <button data-post-id=${el.id} class="like-button">
        <img class="like-button-img" src=${
          el.isLiked
            ? "./assets/images/like-active.svg"
            : "./assets/images/like-not-active.svg"
        }>
      </button>
      <p class="post-likes-text">
        Нравится: <strong class="like-counter">${likes(el.likes)}</strong>
      </p>
    </div>
    <p class="post-text">
      <span class="user-name">${el.user.name}</span>
      ${el.description}
    </p>
    <p class="post-date">
      ${formatDistanceToNow(new Date(el.createdAt), {
        locale: ru,
        addSuffix: true,
      })}
    </p>
    ${
      !user
        ? ""
        : el.user.id === user._id
        ? `<button data-post-id=${el.id} class="delete-post">Удалить пост</button>`
        : ""
    }    
  </li>`;
      })
      .join("");

    const appHtml = `
              <div class="page-container">
                <div class="header-container"></div>
                <ul class="posts">
                  ${postHtml}
                </ul>
              </div>`;

    appEl.innerHTML = appHtml;

    for (let userEl of document.querySelectorAll(".post-header")) {
      userEl.addEventListener("click", () => {
        goToPage(USER_POSTS_PAGE, {
          userId: userEl.dataset.userId,
        });
      });
    }
    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });
    initLikeListeners();
    initDeleteButtonListeners();
  }

  const initDeleteButtonListeners = () => {
    if (user) {
      const deleteButtons = document.querySelectorAll(".delete-post");
      deleteButtons.forEach((deleteButton) => {
        deleteButton.addEventListener("click", () => {
          if (user) {
            let postId = deleteButton.dataset.postId;
            let index = posts.findIndex((el) => el.id === postId);
            deleteYourPost({
              id: postId,
              token: `Bearer ${user.token}`,
            })
              .then(() => {
                posts.splice(index, 1);
                renderPosts();
              })
              .catch((error) => {
                console.error(error.message);
              });
          }
        });
      });
    }
  };

  const initLikeListeners = () => {
    const likeButtons = document.querySelectorAll(".like-button");
    likeButtons.forEach((likeButton) => {
      likeButton.addEventListener("click", () => {
        let postId = likeButton.dataset.postId;
        let index = posts.findIndex((el) => el.id === postId);
        if (user) {
          if (posts[index].isLiked) {
            addDislike({
              token: `Bearer ${user.token}`,
              id: postId,
            })
              .then(() => {
                posts[index].isLiked = false;
                posts[index].likes.splice(
                  posts[index].likes.findIndex((el) => el.id === user._id),
                  1
                );
                renderPosts();
              })
              .catch((error) => {
                console.error(error.message);
              });
          } else {
            addLike({
              token: `Bearer ${user.token}`,
              id: postId,
            })
              .then(() => {
                posts[index].isLiked = true;
                posts[index].likes.push({
                  id: user._id,
                  name: user.name,
                });
                renderPosts();
              })
              .catch((error) => {
                console.error(error.message);
              });
          }
        } else {
          alert("Только авторизованные пользователи могут ставить лайки");
          goToPage(AUTH_PAGE);
        }
      });
    });
  };

  renderPosts();
}
