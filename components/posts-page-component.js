import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage } from "../index.js";

export function renderPostsPageComponent({ appEl }) {
  // TODO: реализовать рендер постов из api

  /**
   * TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
   */
  const postHtml = posts.map((el) => {
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
        <img src=${el.isLiked ? "./assets/images/like-active.svg" : "./assets/images/like-not-active.svg" }>
      </button>
      <p class="post-likes-text">
        Нравится: <strong>${el.likes.length}</strong>
      </p>
    </div>
    <p class="post-text">
      <span class="user-name">${el.user.name}</span>
      ${el.description}
    </p>
    <p class="post-date">
      19 минут назад
    </p>
  </li>`
  }).join("")

  const appHtml = `
              <div class="page-container">
                <div class="header-container"></div>
                <ul class="posts">
                  ${postHtml}
                </ul>
              </div>`;

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }
}
