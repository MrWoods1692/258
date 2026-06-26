const noteColorClasses = ["note-yellow", "note-orange", "note-green", "note-blue", "note-pink", "note-mint", "note-lavender"];
const state = {
  user: null,
  messages: [],
  activity: null,
  globalStats: null,
  globalLeaders: [],
  profileTab: "messages",
  expandedComments: new Set(),
  currentPage: "home",
};

const pages = document.querySelectorAll("[data-page]");
const userbar = document.querySelector("#userbar");
const topnav = document.querySelector("#topnav");
const loginPanel = document.querySelector("#loginPanel");
const composer = document.querySelector("#composer");
const board = document.querySelector("#board");
const statsStrip = document.querySelector("#statsStrip");
const profileSummary = document.querySelector("#profileSummary");
const profileList = document.querySelector("#profileList");
const statsDashboard = document.querySelector("#statsDashboard");
const statsLeaders = document.querySelector("#statsLeaders");
const messageCount = document.querySelector("#messageCount");
const commentCount = document.querySelector("#commentCount");
const likeCount = document.querySelector("#likeCount");
const messageInput = document.querySelector("#messageInput");
const anonymousInput = document.querySelector("#anonymousInput");
const postMessageButton = document.querySelector("#postMessageButton");
const charCounter = document.querySelector("#charCounter");
const formMessage = document.querySelector("#formMessage");

const request = async (url, options = {}) => {
  const response = await fetch(url, {
    headers: { "content-type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  if (response.status === 401) {
    state.user = null;
    renderAuth();
    throw new Error("UNAUTHORIZED");
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "请求失败");
  return data;
};

const formatTime = (value) => new Intl.DateTimeFormat("zh-CN", {
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
}).format(new Date(`${value.replace(" ", "T")}+08:00`));

const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (char) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  "'": "&#39;",
  '"': "&quot;",
}[char]));

const randomNoteColorClass = () => noteColorClasses[Math.floor(Math.random() * noteColorClasses.length)];
const renderAvatar = (url, name, className = "avatar") => url
  ? `<img class="${className}" src="${escapeHtml(url)}" alt="${escapeHtml(name)}的头像" referrerpolicy="no-referrer" />`
  : `<span class="${className} anonymous-avatar" aria-hidden="true">匿</span>`;
const setFormMessage = (message, type = "") => {
  formMessage.textContent = message;
  formMessage.dataset.type = type;
};
const compactTime = (value) => value ? formatTime(value) : "暂无";

/* ---- Navigation ---- */

const navigate = (page) => {
  state.currentPage = page;
  pages.forEach((el) => el.classList.toggle("hidden", el.dataset.page !== page));
  topnav.querySelectorAll(".topnav-link").forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${page}`);
  });

  if (page === "home") {
    renderHome();
    loadMessages();
  } else if (page === "profile") {
    renderProfile();
    if (state.user) loadActivity();
  } else if (page === "stats") {
    loadGlobalStats();
  }
};

topnav.addEventListener("click", (event) => {
  const link = event.target.closest(".topnav-link");
  if (link) {
    event.preventDefault();
    navigate(link.getAttribute("href").slice(1));
  }
});

window.addEventListener("hashchange", () => {
  const page = location.hash.slice(1) || "home";
  navigate(page);
});

/* ---- Auth ---- */

const renderAuth = () => {
  userbar.innerHTML = state.user
    ? `<span class="user-pill"><strong>${escapeHtml(state.user.display_name)}</strong><small>QQ ${escapeHtml(state.user.qq)}</small></span><button class="ghost-button" id="logoutButton">退出登录</button>`
    : `<a class="primary-button small" href="/auth/login">登录</a>`;

  document.querySelector("#logoutButton")?.addEventListener("click", async () => {
    await request("/auth/logout", { method: "POST" });
    state.user = null;
    state.messages = [];
    state.activity = null;
    state.expandedComments.clear();
    renderAuth();
    if (state.currentPage === "home") renderHome();
    if (state.currentPage === "profile") renderProfile();
  });
};

/* ---- Stats strip (home page) ---- */

const updateStats = () => {
  const comments = state.messages.reduce((total, message) => total + message.comments.length, 0);
  const likes = state.messages.reduce((total, message) => {
    const commentLikes = message.comments.reduce((sum, comment) => sum + comment.likeCount, 0);
    return total + message.likeCount + commentLikes;
  }, 0);
  messageCount.textContent = String(state.messages.length);
  commentCount.textContent = String(comments);
  likeCount.textContent = String(likes);
};

/* ---- Home page ---- */

const renderHome = () => {
  loginPanel.classList.toggle("hidden", Boolean(state.user));
  composer.classList.toggle("hidden", !state.user);
  statsStrip.classList.remove("hidden");
};

/* ---- Messages ---- */

const renderMessages = () => {
  updateStats();

  if (!state.messages.length) {
    board.innerHTML = `<div class="empty-state"><strong>墙上还空着</strong><span>写下第一张便签，让这里开始热闹起来。</span></div>`;
    return;
  }

  const currentUserId = state.user?.id;

  board.innerHTML = state.messages.map((message) => `
    <article class="note ${randomNoteColorClass()}">
      <div class="note-pin"></div>
      <div class="note-paper-lines"></div>
      <div class="note-author">
        ${renderAvatar(message.avatarUrl, message.author)}
        <span>${escapeHtml(message.author)}</span>
      </div>
      <p class="note-content">${escapeHtml(message.content)}</p>
      <footer class="note-meta">
        <time>${formatTime(message.createdAt)}</time>
        ${message.isAnonymous && message.isMine ? "<em>已匿名</em>" : ""}
      </footer>
      <div class="note-actions">
        <button class="icon-button ${message.likedByMe ? "active" : ""}" data-like-type="message" data-like-id="${message.id}" aria-label="点赞留言">♥ <span>${message.likeCount}</span></button>
        <button class="icon-button" data-toggle-comments="${message.id}" aria-expanded="${state.expandedComments.has(message.id)}">评论 <span>${message.commentCount}</span></button>
      </div>
      <section class="comments ${state.expandedComments.has(message.id) ? "" : "hidden"}" id="comments-${message.id}">
        <div class="comment-list">
          ${message.comments.length ? message.comments.map((comment) => `
            <div class="comment">
              <div>
                <span class="comment-author">${renderAvatar(comment.avatarUrl, comment.author, "comment-avatar")}<strong>${escapeHtml(comment.author)}</strong></span>
                <span>${formatTime(comment.createdAt)}</span>
              </div>
              <p>${escapeHtml(comment.content)}</p>
              <button class="icon-button compact ${comment.likedByMe ? "active" : ""}" data-like-type="comment" data-like-id="${comment.id}" aria-label="点赞评论">♥ ${comment.likeCount}</button>
            </div>
          `).join("") : `<p class="comment-empty">还没有评论。</p>`}
        </div>
        ${state.user ? `<form class="comment-form" data-message-id="${message.id}">
          <input maxlength="280" placeholder="写一条评论" />
          <button type="submit">发送</button>
        </form>` : ""}
      </section>
    </article>
  `).join("");

  bindBoardEvents();
};

const bindBoardEvents = () => {
  document.querySelectorAll("[data-toggle-comments]").forEach((button) => {
    button.addEventListener("click", () => {
      const messageId = Number(button.dataset.toggleComments);
      if (state.expandedComments.has(messageId)) {
        state.expandedComments.delete(messageId);
      } else {
        state.expandedComments.add(messageId);
      }
      button.setAttribute("aria-expanded", String(state.expandedComments.has(messageId)));
      document.querySelector(`#comments-${messageId}`)?.classList.toggle("hidden", !state.expandedComments.has(messageId));
    });
  });

  document.querySelectorAll("[data-like-type]").forEach((button) => {
    button.addEventListener("click", async () => {
      if (!state.user) return;
      await request(`/api/likes/${button.dataset.likeType}/${button.dataset.likeId}`, { method: "POST" });
      await loadMessages();
    });
  });

  document.querySelectorAll(".comment-form").forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const input = form.querySelector("input");
      const content = input.value.trim();
      if (!content) return;
      await request(`/api/messages/${form.dataset.messageId}/comments`, {
        method: "POST",
        body: JSON.stringify({ content }),
      });
      input.value = "";
      state.expandedComments.add(Number(form.dataset.messageId));
      await loadMessages();
    });
  });
};

const loadMessages = async () => {
  board.setAttribute("aria-busy", "true");
  try {
    const data = await request("/api/messages");
    state.messages = data.messages;
    renderMessages();
  } finally {
    board.removeAttribute("aria-busy");
  }
};

/* ---- Post message ---- */

postMessageButton.addEventListener("click", async () => {
  const content = messageInput.value.trim();
  if (!content) {
    setFormMessage("先写点内容再发布。", "error");
    return;
  }

  postMessageButton.disabled = true;
  setFormMessage("正在发布...", "pending");
  try {
    await request("/api/messages", {
      method: "POST",
      body: JSON.stringify({ content, isAnonymous: anonymousInput.checked }),
    });
    messageInput.value = "";
    charCounter.textContent = "0/500";
    anonymousInput.checked = false;
    await loadMessages();
    setFormMessage("发布成功！", "success");
    setTimeout(() => setFormMessage(""), 1800);
  } catch (error) {
    setFormMessage(error.message || "发布失败，请稍后再试。", "error");
  } finally {
    postMessageButton.disabled = false;
  }
});

messageInput.addEventListener("input", () => {
  charCounter.textContent = `${messageInput.value.length}/500`;
  if (formMessage.dataset.type === "error") setFormMessage("");
});

/* ---- Profile page ---- */

const renderProfile = () => {
  if (!state.user || !state.activity) {
    profileSummary.innerHTML = `<div class="profile-empty">登录后可查看个人仪表盘。</div>`;
    profileList.innerHTML = "";
    return;
  }

  const stats = state.activity.stats;
  profileSummary.innerHTML = `
    <div class="profile-id">
      ${renderAvatar(state.activity.avatarUrl, state.user.display_name, "profile-avatar")}
      <div>
        <strong>${escapeHtml(state.user.display_name)}</strong>
        <span>QQ ${escapeHtml(state.user.qq)}</span>
        ${stats.recentActivity ? `<small>最近活跃：${compactTime(stats.recentActivity)}</small>` : ""}
      </div>
    </div>
    <div class="profile-stats">
      <div><strong>${stats.messageCount}</strong><span>留言</span></div>
      <div><strong>${stats.commentCount}</strong><span>评论</span></div>
      <div><strong>${stats.receivedLikes}</strong><span>收到赞</span></div>
      <div><strong>${stats.givenLikes}</strong><span>点出赞</span></div>
      <div><strong>${stats.anonymousCount}</strong><span>匿名</span></div>
    </div>
  `;

  document.querySelectorAll("[data-profile-tab]").forEach((button) => {
    button.classList.toggle("active", button.dataset.profileTab === state.profileTab);
  });

  const items = state.profileTab === "messages" ? state.activity.messages : state.activity.comments;
  if (!items.length) {
    profileList.innerHTML = `<div class="profile-empty">这里还没有${state.profileTab === "messages" ? "留言" : "评论"}。</div>`;
    return;
  }

  profileList.innerHTML = items.map((item) => `
    <article class="profile-item">
      <div class="profile-item-head">
        <time>${formatTime(item.createdAt)}</time>
      </div>
      <p>${escapeHtml(item.content)}</p>
      ${state.profileTab === "comments" ? `<small>回复：${escapeHtml(item.messagePreview)}</small>` : ""}
      <div class="profile-item-foot">
        <span>${item.likeCount} 赞${item.commentCount !== undefined ? ` · ${item.commentCount} 评论` : ""}</span>
        <button class="danger-button" data-delete-${state.profileTab === "messages" ? "message" : "comment"}="${item.id}">删除</button>
      </div>
    </article>
  `).join("");

  profileList.querySelectorAll("[data-delete-message]").forEach((button) => {
    button.addEventListener("click", async () => {
      if (!confirm("确定要删除这条留言吗？删除后无法恢复。")) return;
      await request(`/api/messages/${button.dataset.deleteMessage}`, { method: "DELETE" });
      await loadActivity();
    });
  });

  profileList.querySelectorAll("[data-delete-comment]").forEach((button) => {
    button.addEventListener("click", async () => {
      if (!confirm("确定要删除这条评论吗？删除后无法恢复。")) return;
      await request(`/api/comments/${button.dataset.deleteComment}`, { method: "DELETE" });
      await loadActivity();
    });
  });
};

const loadActivity = async () => {
  if (!state.user) return;
  const data = await request("/api/me/activity");
  state.activity = data;
  renderProfile();
};

document.querySelectorAll("[data-profile-tab]").forEach((button) => {
  button.addEventListener("click", () => {
    state.profileTab = button.dataset.profileTab;
    renderProfile();
  });
});

/* ---- Stats page ---- */

const renderGlobalStats = () => {
  if (!state.globalStats) {
    statsDashboard.innerHTML = `<div class="profile-empty">加载中...</div>`;
    return;
  }

  const s = state.globalStats;
  statsDashboard.innerHTML = `
    <div class="dashboard-grid">
      <div class="dashboard-card"><strong>${s.userCount}</strong><span>登录用户</span></div>
      <div class="dashboard-card"><strong>${s.messageCount}</strong><span>留言总数</span></div>
      <div class="dashboard-card"><strong>${s.commentCount}</strong><span>评论总数</span></div>
      <div class="dashboard-card"><strong>${s.likeCount}</strong><span>点赞总数</span></div>
      <div class="dashboard-card"><strong>${s.anonymousCount}</strong><span>匿名留言</span></div>
      <div class="dashboard-card"><strong>${s.todayMessages}</strong><span>今日留言</span></div>
    </div>
    <div class="today-strip">
      <span>今日新增：${s.todayMessages} 留言 · ${s.todayComments} 评论 · ${s.todayLikes} 点赞</span>
    </div>
  `;

  statsLeaders.innerHTML = state.globalLeaders.length ? `
    <h3>热门留言</h3>
    <div class="leader-list">
      ${state.globalLeaders.map((item, index) => `
        <article class="leader-item">
          <strong>${index + 1}</strong>
          <div>
            <p>${escapeHtml(item.content)}</p>
            <span>${escapeHtml(item.author)} · ${item.likeCount} 赞 · ${item.commentCount} 评论</span>
          </div>
          ${state.user?.isAdmin ? `<button class="danger-button small" data-admin-delete-message="${item.id}">删除</button>` : ""}
        </article>
      `).join("")}
    </div>
  ` : "";

  statsLeaders.querySelectorAll("[data-admin-delete-message]").forEach((button) => {
    button.addEventListener("click", async () => {
      if (!confirm("确定要删除这条留言吗？删除后无法恢复，所有相关评论也会被删除。")) return;
      await request(`/api/admin/messages/${button.dataset.adminDeleteMessage}`, { method: "DELETE" });
      await loadGlobalStats();
      await loadMessages();
    });
  });
};

const loadGlobalStats = async () => {
  const data = await request("/api/stats");
  state.globalStats = data.stats;
  state.globalLeaders = data.leaders || [];
  renderGlobalStats();
};

/* ---- Boot ---- */

const boot = async () => {
  const data = await request("/api/me");
  state.user = data.user;
  renderAuth();

  const page = location.hash.slice(1) || "home";
  navigate(page);
};

boot().catch((error) => {
  console.error(error);
  renderAuth();
  navigate("home");
});