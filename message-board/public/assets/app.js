const noteColorClasses = ["note-yellow", "note-orange", "note-green", "note-blue", "note-pink", "note-mint", "note-lavender"];
const state = { user: null, messages: [], moderationItems: [], adminStats: null, adminLeaders: [], activity: null, profileTab: "messages", expandedComments: new Set() };

const userbar = document.querySelector("#userbar");
const loginPanel = document.querySelector("#loginPanel");
const composer = document.querySelector("#composer");
const board = document.querySelector("#board");
const statsStrip = document.querySelector("#statsStrip");
const profilePanel = document.querySelector("#profilePanel");
const profileSummary = document.querySelector("#profileSummary");
const profileList = document.querySelector("#profileList");
const adminPanel = document.querySelector("#adminPanel");
const adminDashboard = document.querySelector("#adminDashboard");
const adminLeaders = document.querySelector("#adminLeaders");
const adminList = document.querySelector("#adminList");
const refreshAdminButton = document.querySelector("#refreshAdminButton");
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

const formatTime = (value) => {
  if (!value) return "";
  let date;
  if (value.includes("Z")) {
    date = new Date(value);
  } else if (value.includes("T")) {
    date = new Date(`${value}+08:00`);
  } else {
    date = new Date(`${value.replace(" ", "T")}+08:00`);
  }
  if (isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

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

const renderAuth = () => {
  userbar.innerHTML = state.user
    ? `<span class="user-pill"><strong>${escapeHtml(state.user.display_name)}</strong><small>QQ ${escapeHtml(state.user.qq)}</small></span><button class="ghost-button" id="logoutButton">退出</button>`
    : `<a href="/auth/login" class="primary-button small">登录</a>`;

  loginPanel.classList.toggle("hidden", Boolean(state.user));
  composer.classList.toggle("hidden", !state.user);
  board.classList.toggle("hidden", false);
  statsStrip.classList.toggle("hidden", !state.user);
  profilePanel.classList.toggle("hidden", !state.user);
  adminPanel.classList.toggle("hidden", !state.user?.isAdmin);

  document.querySelector("#logoutButton")?.addEventListener("click", async () => {
    await request("/auth/logout", { method: "POST" });
    state.user = null;
    state.messages = [];
    state.moderationItems = [];
    state.activity = null;
    state.expandedComments.clear();
    renderAuth();
    renderMessages();
    renderProfile();
    renderAdmin();
  });


};

const renderStatusBadge = (statusText) => statusText ? `<em class="status-badge">${escapeHtml(statusText)}</em>` : "";
const compactTime = (value) => value ? formatTime(value) : "暂无";

const renderProfile = () => {
  if (!state.user || !state.activity) {
    profileSummary.innerHTML = "";
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
        <small>最近活跃：${compactTime(stats.recentActivity)}</small>
      </div>
    </div>
    <div class="profile-stats">
      <div><strong>${stats.messageCount}</strong><span>我的留言</span></div>
      <div><strong>${stats.commentCount}</strong><span>我的评论</span></div>
      <div><strong>${stats.receivedLikes}</strong><span>收到点赞</span></div>
      <div><strong>${stats.givenLikes}</strong><span>点出点赞</span></div>
      <div><strong>${stats.pendingCount}</strong><span>待审核</span></div>
      <div><strong>${stats.anonymousCount}</strong><span>匿名留言</span></div>
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
        <span class="status-badge">${escapeHtml(item.statusText)}</span>
        <time>${formatTime(item.createdAt)}</time>
      </div>
      <p>${escapeHtml(item.content)}</p>
      ${state.profileTab === "comments" ? `<small>回复：${escapeHtml(item.messagePreview)}</small>` : ""}
      <div class="profile-item-foot">
        <span>${item.likeCount} 次点赞${item.commentCount !== undefined ? ` · ${item.commentCount} 条评论` : ""}</span>
        <button class="danger-button" data-delete-${state.profileTab === "messages" ? "message" : "comment"}="${item.id}">删除</button>
      </div>
    </article>
  `).join("");

  profileList.querySelectorAll("[data-delete-message]").forEach((button) => {
    button.addEventListener("click", async () => {
      await request(`/api/messages/${button.dataset.deleteMessage}`, { method: "DELETE" });
      await refreshUserData();
    });
  });

  profileList.querySelectorAll("[data-delete-comment]").forEach((button) => {
    button.addEventListener("click", async () => {
      await request(`/api/comments/${button.dataset.deleteComment}`, { method: "DELETE" });
      await refreshUserData();
    });
  });
};

const renderAdmin = () => {
  if (!state.user?.isAdmin) {
    adminDashboard.innerHTML = "";
    adminLeaders.innerHTML = "";
    adminList.innerHTML = "";
    return;
  }

  const stats = state.adminStats;
  adminDashboard.innerHTML = stats ? `
    <div class="dashboard-grid">
      <div class="dashboard-card primary"><strong>${stats.pendingCount}</strong><span>待审核</span></div>
      <div class="dashboard-card"><strong>${stats.userCount}</strong><span>登录用户</span></div>
      <div class="dashboard-card"><strong>${stats.messageCount}</strong><span>留言总数</span></div>
      <div class="dashboard-card"><strong>${stats.commentCount}</strong><span>评论总数</span></div>
      <div class="dashboard-card"><strong>${stats.likeCount}</strong><span>点赞总数</span></div>
      <div class="dashboard-card"><strong>${stats.rejectedCount}</strong><span>已拒绝</span></div>
    </div>
    <div class="today-strip">
      <span>今日新增：${stats.todayMessages} 留言 · ${stats.todayComments} 评论 · ${stats.todayLikes} 点赞</span>
      <span>匿名留言 ${stats.anonymousCount} · 今日审核 ${stats.recentAuditCount}</span>
    </div>
  ` : "";

  adminLeaders.innerHTML = state.adminLeaders.length ? `
    <h3>热门留言</h3>
    <div class="leader-list">
      ${state.adminLeaders.map((item, index) => `
        <article class="leader-item">
          <strong>${index + 1}</strong>
          <p>${escapeHtml(item.content)}</p>
          <span>${escapeHtml(item.author)} · ${item.likeCount} 赞 · ${item.commentCount} 评论</span>
        </article>
      `).join("")}
    </div>
  ` : "";

  const pendingItems = state.moderationItems.filter((item) => item.status === "pending");
  if (!pendingItems.length) {
    adminList.innerHTML = `<div class="admin-empty">暂无需要审核的内容。</div>`;
    return;
  }
  const visibleItems = pendingItems;

  adminList.innerHTML = visibleItems.map((item) => `
    <article class="admin-item">
      <div>
        <span class="admin-type">${item.type === "message" ? "留言" : "评论"}</span>
        <strong>${escapeHtml(item.author)}</strong>
        <small>QQ ${escapeHtml(item.qq || "未知")} · ${formatTime(item.createdAt)}</small>
      </div>
      <p>${escapeHtml(item.content)}</p>
      <div class="admin-actions">
        <button class="primary-button small" data-admin-action="approve" data-admin-type="${item.type}" data-admin-id="${item.id}">通过</button>
        <button class="ghost-button" data-admin-action="reject" data-admin-type="${item.type}" data-admin-id="${item.id}">拒绝</button>
        <button class="danger-button" data-admin-action="delete" data-admin-type="${item.type}" data-admin-id="${item.id}">删除</button>
      </div>
    </article>
  `).join("");

  adminList.querySelectorAll("[data-admin-action]").forEach((button) => {
    button.addEventListener("click", async () => {
      await request(`/api/admin/moderation/${button.dataset.adminType}/${button.dataset.adminId}`, {
        method: "POST",
        body: JSON.stringify({ action: button.dataset.adminAction }),
      });
      await loadAdmin();
      await loadMessages();
      await loadActivity();
    });
  });
};

const renderMessages = () => {
  updateStats();

  if (!state.messages.length) {
    board.innerHTML = `<div class="empty-state"><strong>墙上还空着</strong><span>${state.user ? "写下第一张便签，让这里开始热闹起来。" : "登录后可以发布留言。"}</span></div>`;
    return;
  }

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
        ${renderStatusBadge(message.statusText)}
      </footer>
      ${state.user?.isAdmin && message.status === "pending" ? `
        <div class="moderation-actions">
          <button class="moderation-btn approve" data-moderate-action="approve" data-moderate-type="message" data-moderate-id="${message.id}">通过</button>
          <button class="moderation-btn reject" data-moderate-action="reject" data-moderate-type="message" data-moderate-id="${message.id}">拒绝</button>
          <button class="moderation-btn delete" data-moderate-action="delete" data-moderate-type="message" data-moderate-id="${message.id}">删除</button>
        </div>
      ` : ""}
      <div class="note-actions">
        ${state.user ? `<button class="icon-button ${message.likedByMe ? "active" : ""}" data-like-type="message" data-like-id="${message.id}" aria-label="点赞留言">♥ <span>${message.likeCount}</span></button>` : `<span class="icon-button disabled">♥ <span>${message.likeCount}</span></span>`}
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
              ${renderStatusBadge(comment.statusText)}
              ${state.user?.isAdmin && comment.status === "pending" ? `
                <div class="comment-moderation">
                  <button class="moderation-btn approve small" data-moderate-action="approve" data-moderate-type="comment" data-moderate-id="${comment.id}">通过</button>
                  <button class="moderation-btn reject small" data-moderate-action="reject" data-moderate-type="comment" data-moderate-id="${comment.id}">拒绝</button>
                  <button class="moderation-btn delete small" data-moderate-action="delete" data-moderate-type="comment" data-moderate-id="${comment.id}">删除</button>
                </div>
              ` : ""}
              ${state.user ? `<button class="icon-button compact ${comment.likedByMe ? "active" : ""}" data-like-type="comment" data-like-id="${comment.id}" aria-label="点赞评论">♥ ${comment.likeCount}</button>` : `<span class="icon-button compact disabled">♥ ${comment.likeCount}</span>`}
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
};

const loadAdmin = async () => {
  if (!state.user?.isAdmin) return;
  const data = await request("/api/admin/moderation");
  state.moderationItems = data.items;
  state.adminStats = data.stats;
  state.adminLeaders = data.leaders || [];
  renderAdmin();
};

const loadActivity = async () => {
  if (!state.user) return;
  const data = await request("/api/me/activity");
  state.activity = data;
  renderProfile();
};

const refreshUserData = async () => {
  await loadMessages();
  await loadActivity();
  if (state.user?.isAdmin) await loadAdmin();
};

const bindBoardEvents = () => {
  board.addEventListener("click", async (event) => {
    const toggleButton = event.target.closest("[data-toggle-comments]");
    if (toggleButton) {
      const messageId = Number(toggleButton.dataset.toggleComments);
      if (state.expandedComments.has(messageId)) {
        state.expandedComments.delete(messageId);
      } else {
        state.expandedComments.add(messageId);
      }
      toggleButton.setAttribute("aria-expanded", String(state.expandedComments.has(messageId)));
      document.querySelector(`#comments-${messageId}`)?.classList.toggle("hidden", !state.expandedComments.has(messageId));
      return;
    }

    const likeButton = event.target.closest("[data-like-type]");
    if (likeButton && state.user) {
      await request(`/api/likes/${likeButton.dataset.likeType}/${likeButton.dataset.likeId}`, { method: "POST" });
      await refreshUserData();
      return;
    }

    const moderateButton = event.target.closest("[data-moderate-action]");
    if (moderateButton) {
      try {
        await request(`/api/admin/moderation/${moderateButton.dataset.moderateType}/${moderateButton.dataset.moderateId}`, {
          method: "POST",
          body: JSON.stringify({ action: moderateButton.dataset.moderateAction }),
        });
        await refreshUserData();
      } catch (error) {
        console.error("Moderation action failed:", error);
      }
      return;
    }
  });

  board.addEventListener("submit", async (event) => {
    const form = event.target.closest(".comment-form");
    if (form && state.user) {
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
      await refreshUserData();
    }
  });
};

const loadMessages = async () => {
  board.setAttribute("aria-busy", "true");
  try {
    const response = await fetch("/api/messages", { headers: { "content-type": "application/json" } });
    const data = await response.json().catch(() => ({ messages: [] }));
    state.messages = data.messages || [];
    renderMessages();
  } catch (error) {
    console.error("Failed to load messages:", error);
    state.messages = [];
    renderMessages();
  } finally {
    board.removeAttribute("aria-busy");
  }
};

postMessageButton.addEventListener("click", async () => {
  const content = messageInput.value.trim();
  if (!content) {
    setFormMessage("先写点内容再发布。", "error");
    return;
  }

  postMessageButton.disabled = true;
  setFormMessage("正在贴上墙...", "pending");
  try {
    await request("/api/messages", {
      method: "POST",
      body: JSON.stringify({ content, isAnonymous: anonymousInput.checked }),
    });
    messageInput.value = "";
    charCounter.textContent = "0/500";
    anonymousInput.checked = false;
    await refreshUserData();
    setFormMessage("已提交审核，通过后会显示给其他同学。", "success");
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

refreshAdminButton.addEventListener("click", loadAdmin);

document.querySelectorAll("[data-profile-tab]").forEach((button) => {
  button.addEventListener("click", () => {
    state.profileTab = button.dataset.profileTab;
    renderProfile();
  });
});

const boot = async () => {
  try {
    const response = await fetch("/api/me", { headers: { "content-type": "application/json" } });
    const data = await response.json().catch(() => ({ user: null }));
    state.user = data.user;
  } catch (error) {
    state.user = null;
  }
  renderAuth();
  await loadMessages();
  if (state.user) {
    await loadActivity();
    if (state.user.isAdmin) await loadAdmin();
  }
  bindBoardEvents();
};

boot().catch((error) => {
  console.error(error);
  renderAuth();
  loadMessages();
});