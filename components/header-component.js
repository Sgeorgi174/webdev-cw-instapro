import { goToPage, logout, user } from "../index.js";
import {
  ADD_POSTS_PAGE,
  AUTH_PAGE,
  POSTS_PAGE,
  MY_POST_PAGE,
} from "../routes.js";

export function renderHeaderComponent({ element }) {
  element.innerHTML = `
  <div class="page-header">
      <h1 class="logo">instapro</h1>
      <button class="header-button add-or-login-button">
      ${
        user
          ? `<div title="Добавить пост" class="add-post-sign"></div>`
          : `<div title="Добавить пост" class="add-post-sign hidden"></div>`
      }
      </button>
     <div class="header-right">
     <div title="Мой профиль" class="add-post-sign my-profile"></div>
    ${
      user
        ? `<button title="${user.name}" class="header-button logout-button">Выйти</button>`
        : ""
    }  
    </button>
     </div>
  </div>
  
`;

  element
    .querySelector(".add-or-login-button")
    .addEventListener("click", () => {
      if (user) {
        goToPage(ADD_POSTS_PAGE);
      } else {
        goToPage(AUTH_PAGE);
      }
    });

  element.querySelector(".logo").addEventListener("click", () => {
    goToPage(POSTS_PAGE);
  });

  element.querySelector(".my-profile").addEventListener("click", () => {
    if (user) {
      goToPage(MY_POST_PAGE);
    } else {
      goToPage(AUTH_PAGE);
    }
  });

  element.querySelector(".logout-button")?.addEventListener("click", logout);

  return element;
}
