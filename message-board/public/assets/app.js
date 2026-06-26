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
  reviewTab: "pending",
  reviewData: null,
  reviewCounts: null,
  moderationLogs: null,
  showModerationLogs: false,
};

/* ---- DOM references ---- */
const pages = document.querySelectorAll("[data-page]");
const userbar = document.querySelector("#userbar");
const topnav = document.querySelector("#topnav");
const board = document.querySelector("#board");
const statsStrip = document.querySelector("#statsStrip");
const profileSummary = document.querySelector("#profileSummary");
const profileList = document.querySelector("#profileList");
const profilePendingBadge = document.querySelector("#profilePendingBadge");
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
const postForm = document.querySelector("#postForm");
const postLoginPrompt = document.querySelector("#postLoginPrompt");
const adminReview = document.querySelector("#adminReview");
const reviewList = document.querySelector("#reviewList");
const reviewLogs = document.querySelector("#reviewLogs");
const reviewPendingCount = document.querySelector("#reviewPendingCount");
const reviewApprovedCount = document.querySelector("#reviewApprovedCount");
const reviewRejectedCount = document.querySelector("#reviewRejectedCount");

/* ---- Network ---- */
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

/* ---- Utilities ---- */
const formatTime = (value) => {
  if (!value) return "";
  try {
    let dateValue;
    const str = String(value);
    if (typeof value === "number" || /^\d+$/.test(str)) {
      dateValue = new Date(Number(value));
    } else {
      const normalized = str.replace(" ", "T").replace(/[Zz]$/, "").replace(/[+\-]\d{2}:\d{2}$/, "");
      dateValue = new Date(normalized + "+08:00");
    }
    if (isNaN(dateValue.getTime())) return str;
    return new Intl.DateTimeFormat("zh-CN", {
      month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit",
      timeZone: "Asia/Shanghai",
    }).format(dateValue);
  } catch { return String(value); }
};

const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
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

const statusBadge = (status, text) => {
  const cls = { pending: "badge-pending", approved: "badge-approved", rejected: "badge-rejected" }[status] || "";
  const label = text || { pending: "待审核", approved: "已通过", rejected: "未通过" }[status] || status;
  return `<span class="status-badge ${cls}">${escapeHtml(label)}</span>`;
};

/* ---- Navigation ---- */
const navigate = (page) => {
  state.currentPage = page;
  pages?.forEach((el) => el.classList.toggle("hidden", el.dataset.page !== page));
  topnav?.querySelectorAll(".topnav-link")?.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${page}`);
  });
  if (page === "home") loadMessages();
  else if (page === "post") renderPost();
  else if (page === "profile") { renderProfile(); if (state.user) loadActivity(); }
  else if (page === "stats") { loadGlobalStats(); if (state.user?.isAdmin) loadReviewData(); }
};

topnav?.addEventListener("click", (event) => {
  const link = event.target.closest(".topnav-link");
  if (link) { event.preventDefault(); navigate(link.getAttribute("href").slice(1)); }
});

window.addEventListener("hashchange", () => {
  navigate(location.hash.slice(1) || "home");
});

/* ---- Auth ---- */
const renderAuth = () => {
  userbar.innerHTML = state.user
    ? `<span class="user-pill"><strong>${escapeHtml(state.user.display_name)}</strong><small>QQ ${escapeHtml(state.user.qq)}</small>${state.user.isAdmin ? '<span class="admin-tag">管理员</span>' : ""}</span><button class="ghost-button" id="logoutButton">退出</button>`
    : `<a class="primary-button small" href="/auth/login">登录</a>`;

  document.querySelector("#logoutButton")?.addEventListener("click", async () => {
    await request("/auth/logout", { method: "POST" });
    state.user = null; state.messages = []; state.activity = null;
    state.reviewData = null; state.expandedComments.clear();
    renderAuth();
    if (state.currentPage === "post") renderPost();
    if (state.currentPage === "profile") renderProfile();
    if (state.currentPage === "stats") { loadGlobalStats(); renderAdminReview(); }
  });
};

/* ---- Stats strip ---- */
const updateStats = () => {
  const comments = state.messages.reduce((total, m) => total + m.comments.length, 0);
  const likes = state.messages.reduce((total, m) => {
    const cl = m.comments.reduce((s, c) => s + c.likeCount, 0);
    return total + m.likeCount + cl;
  }, 0);
  messageCount.textContent = String(state.messages.length);
  commentCount.textContent = String(comments);
  likeCount.textContent = String(likes);
};

/* ---- Post page ---- */
const renderPost = () => {
  const loggedIn = Boolean(state.user);
  postForm?.classList.toggle("hidden", !loggedIn);
  postLoginPrompt?.classList.toggle("hidden", loggedIn);
  if (!loggedIn) setFormMessage("");
  if (messageInput?.value) charCounter.textContent = `${messageInput.value.length}/500`;
};

const updateCharCounter = () => {
  const len = messageInput?.value.length || 0;
  charCounter.textContent = `${len}/500`;
  charCounter.className = len > 480 ? "char-counter danger" : len > 400 ? "char-counter warning" : "char-counter";
  if (formMessage.dataset.type === "error") setFormMessage("");
};

postMessageButton?.addEventListener("click", async () => {
  const content = messageInput.value.trim();
  if (!content) { setFormMessage("先写点内容再发布。", "error"); return; }
  postMessageButton.disabled = true;
  setFormMessage("正在发布...", "pending");
  try {
    await request("/api/messages", {
      method: "POST",
      body: JSON.stringify({ content, isAnonymous: anonymousInput.checked }),
    });
    messageInput.value = "";
    charCounter.textContent = "0/500";
    charCounter.className = "char-counter";
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

messageInput?.addEventListener("input", updateCharCounter);

/* ---- Messages (board) ---- */
const renderMessages = () => {
  updateStats();
  if (!state.messages.length) {
    board.innerHTML = `<div class="empty-state"><strong>墙上还空着</strong><span>写下第一张便签，让这里开始热闹起来。</span></div>`;
    return;
  }

  board.innerHTML = state.messages.map((message) => `
    <article class="note ${randomNoteColorClass()}">
      <div class="note-pin"></div><div class="note-paper-lines"></div>
      <div class="note-author">
        ${renderAvatar(message.avatarUrl, message.author)}
        <span>${escapeHtml(message.author)}</span>
      </div>
      <p class="note-content">${escapeHtml(message.content)}</p>
      <footer class="note-meta">
        <time>${formatTime(message.createdAt)}</time>
        ${message.isAnonymous && message.isMine ? "<em>已匿名</em>" : ""}
        ${message.status && message.status !== "approved" && message.isMine ? statusBadge(message.status, message.statusText) : ""}
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
  document.querySelectorAll("[data-toggle-comments]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const mid = Number(btn.dataset.toggleComments);
      state.expandedComments.has(mid) ? state.expandedComments.delete(mid) : state.expandedComments.add(mid);
      btn.setAttribute("aria-expanded", String(state.expandedComments.has(mid)));
      document.querySelector(`#comments-${mid}`)?.classList.toggle("hidden", !state.expandedComments.has(mid));
    });
  });
  document.querySelectorAll("[data-like-type]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (!state.user) return;
      await request(`/api/likes/${btn.dataset.likeType}/${btn.dataset.likeId}`, { method: "POST" });
      await loadMessages();
    });
  });
  document.querySelectorAll(".comment-form").forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const input = form.querySelector("input");
      const content = input.value.trim();
      if (!content) return;
      await request(`/api/messages/${form.dataset.messageId}/comments`, { method: "POST", body: JSON.stringify({ content }) });
      input.value = "";
      state.expandedComments.add(Number(form.dataset.messageId));
      await loadMessages();
    });
  });
};

const loadMessages = async () => {
  board.setAttribute("aria-busy", "true");
  try { const data = await request("/api/messages"); state.messages = data.messages; renderMessages(); }
  finally { board.removeAttribute("aria-busy"); }
};

/* ---- Profile page ---- */
const renderProfile = () => {
  if (!state.user || !state.activity) {
    profileSummary.innerHTML = `<div class="profile-empty"><strong>登录后可查看个人仪表盘</strong><a class="primary-button" href="/auth/login" style="margin-top:12px">授权登录</a></div>`;
    profileList.innerHTML = "";
    profilePendingBadge?.classList.add("hidden");
    return;
  }

  const stats = state.activity.stats;
  profileSummary.innerHTML = `
    <div class="profile-id">
      ${renderAvatar(state.activity.avatarUrl, state.user.display_name, "profile-avatar")}
      <div>
        <strong>${escapeHtml(state.user.display_name)}</strong>
        <span>QQ ${escapeHtml(state.user.qq)}</span>
        ${state.user.isAdmin ? '<span class="admin-tag admin-tag-block">管理员</span>' : ""}
        ${stats.recentActivity ? `<small>最近活跃：${compactTime(stats.recentActivity)}</small>` : ""}
        <div class="profile-post-link"><a class="primary-button small" href="#post">✏ 写新留言</a></div>
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

  if (stats.pendingCount > 0) {
    profilePendingBadge.textContent = String(stats.pendingCount);
    profilePendingBadge.classList.remove("hidden");
  } else {
    profilePendingBadge.classList.add("hidden");
  }

  document.querySelectorAll("[data-profile-tab]").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.profileTab === state.profileTab);
  });

  let items;
  if (state.profileTab === "pending") {
    const pm = (state.activity.messages || []).filter((i) => i.status === "pending").map((i) => ({ ...i, _type: "message" }));
    const pc = (state.activity.comments || []).filter((i) => i.status === "pending").map((i) => ({ ...i, _type: "comment" }));
    items = [...pm, ...pc].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } else if (state.profileTab === "messages") {
    items = state.activity.messages || [];
  } else {
    items = state.activity.comments || [];
  }

  if (!items.length) {
    const labels = { messages: "留言", comments: "评论", pending: "待审核内容" };
    profileList.innerHTML = `<div class="profile-empty">这里还没有${labels[state.profileTab] || "内容"}。</div>`;
    return;
  }

  profileList.innerHTML = items.map((item) => `
    <article class="profile-item">
      <div class="profile-item-head">
        <time>${formatTime(item.createdAt)}</time>
        ${item.status && item.status !== "approved" ? statusBadge(item.status, item.statusText) : ""}
      </div>
      <p>${escapeHtml(item.content)}</p>
      ${item._type === "comment" || state.profileTab === "comments" ? `<small>回复：${escapeHtml(item.messagePreview || "原留言已删除")}</small>` : ""}
      <div class="profile-item-foot">
        <span>${item.likeCount || 0} 赞${item.commentCount !== undefined ? ` · ${item.commentCount} 评论` : ""}</span>
        <button class="danger-button" data-delete-${item._type === "comment" || state.profileTab === "comments" ? "comment" : "message"}="${item.id}">删除</button>
      </div>
    </article>
  `).join("");

  bindProfileEvents();
};

const bindProfileEvents = () => {
  profileList.querySelectorAll("[data-delete-message]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (!confirm("确定要删除这条留言吗？删除后无法恢复。")) return;
      await request(`/api/messages/${btn.dataset.deleteMessage}`, { method: "DELETE" });
      await loadActivity();
    });
  });
  profileList.querySelectorAll("[data-delete-comment]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (!confirm("确定要删除这条评论吗？删除后无法恢复。")) return;
      await request(`/api/comments/${btn.dataset.deleteComment}`, { method: "DELETE" });
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

document.querySelectorAll("[data-profile-tab]")?.forEach((btn) => {
  btn?.addEventListener("click", () => {
    state.profileTab = btn.dataset.profileTab;
    renderProfile();
  });
});

/* ---- Admin review panel ---- */
const loadReviewData = async (status = state.reviewTab) => {
  try {
    const data = await request(`/api/admin/review?status=${status}`);
    state.reviewData = data;
    state.reviewCounts = data.counts;
    renderAdminReview();
  } catch { /* not admin */ }
};

const renderAdminReview = () => {
  if (!state.user?.isAdmin) { adminReview?.classList.add("hidden"); return; }
  adminReview?.classList.remove("hidden");

  if (state.reviewCounts) {
    reviewPendingCount.textContent = String(state.reviewCounts.pending || 0);
    reviewApprovedCount.textContent = String(state.reviewCounts.approved || 0);
    reviewRejectedCount.textContent = String(state.reviewCounts.rejected || 0);
  }

  document.querySelectorAll("[data-review-tab]").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.reviewTab === state.reviewTab);
  });

  if (!state.reviewData) { reviewList.innerHTML = `<div class="profile-empty">加载中...</div>`; return; }

  const allItems = [
    ...(state.reviewData.messages || []).map((i) => ({ ...i, _type: "message" })),
    ...(state.reviewData.comments || []).map((i) => ({ ...i, _type: "comment" })),
  ].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  if (!allItems.length) {
    reviewList.innerHTML = `<div class="profile-empty">没有${state.reviewTab === "pending" ? "待审核" : state.reviewTab === "approved" ? "已通过" : "未通过"}的内容。</div>`;
    renderModerationLogsButton();
    return;
  }

  reviewList.innerHTML = allItems.map((item) => `
    <article class="review-item ${item.status === "pending" ? "review-pending" : item.status === "rejected" ? "review-rejected" : ""}">
      <div class="review-item-head">
        <span class="review-type-tag">${item._type === "message" ? "留言" : "评论"}</span>
        <strong>${escapeHtml(item.author)}</strong>
        <small>QQ ${escapeHtml(item.qq)}</small>
        <time>${formatTime(item.createdAt)}</time>
        ${statusBadge(item.status)}
      </div>
      <p>${escapeHtml(item.content)}</p>
      ${item._type === "comment" ? `<small>回复：${escapeHtml(item.messagePreview || "(原留言已删除)")}</small>` : ""}
      <div class="review-item-actions">
        ${item.status === "pending" ? `
          <button class="primary-button small" data-approve="${item._type}" data-approve-id="${item.id}">✓ 通过</button>
          <button class="danger-button small" data-reject="${item._type}" data-reject-id="${item.id}">✗ 拒绝</button>
        ` : (item.status === "approved" ? `<span class="approved-text">已审核通过</span>` : `<span class="rejected-text">已拒绝</span>`)}
      </div>
    </article>
  `).join("");

  bindReviewEvents();
  renderModerationLogsButton();
};

const renderModerationLogsButton = () => {
  const section = document.createElement("div");
  section.className = "moderation-logs-section";
  section.innerHTML = `
    <button class="ghost-button" id="toggleModerationLogs">${state.showModerationLogs ? "收起审核日志" : "查看审核日志"}</button>
    <div id="moderationLogsContent" class="${state.showModerationLogs ? "" : "hidden"}"></div>
  `;
  const existing = reviewLogs.querySelector(".moderation-logs-section");
  if (existing) existing.remove();
  reviewLogs.appendChild(section);

  document.querySelector("#toggleModerationLogs")?.addEventListener("click", async () => {
    state.showModerationLogs = !state.showModerationLogs;
    if (state.showModerationLogs) await loadModerationLogs();
    renderAdminReview();
  });

  if (state.showModerationLogs && state.moderationLogs) renderModerationLogsContent();
};

const loadModerationLogs = async () => {
  try { const data = await request("/api/admin/moderation-logs"); state.moderationLogs = data.logs || []; }
  catch { state.moderationLogs = []; }
};

const renderModerationLogsContent = () => {
  const container = document.querySelector("#moderationLogsContent");
  if (!container) return;
  if (!state.moderationLogs?.length) { container.innerHTML = `<div class="profile-empty">暂无审核记录。</div>`; return; }
  container.innerHTML = state.moderationLogs.map((log) => `
    <div class="log-item">
      <span class="log-action ${log.action === "approve" ? "log-approve" : "log-reject"}">${log.action === "approve" ? "✓ 通过" : "✗ 拒绝"}</span>
      <span>${escapeHtml(log.admin_name)}</span>
      <span>${log.target_type === "message" ? "留言" : "评论"}</span>
      <span class="log-preview">${escapeHtml(log.content_preview)}</span>
      <time>${formatTime(log.created_at)}</time>
    </div>
  `).join("");
};

const bindReviewEvents = () => {
  reviewList.querySelectorAll("[data-approve]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      btn.disabled = true;
      try {
        await request(`/api/admin/review/${btn.dataset.approve}/${btn.dataset.approveId}`, {
          method: "POST", body: JSON.stringify({ action: "approve" }),
        });
        await loadReviewData(); await loadMessages();
      } catch (e) { alert(e.message || "操作失败"); }
      finally { btn.disabled = false; }
    });
  });
  reviewList.querySelectorAll("[data-reject]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (!confirm("确定要拒绝这条内容吗？拒绝后将不会公开展示。")) return;
      btn.disabled = true;
      try {
        await request(`/api/admin/review/${btn.dataset.reject}/${btn.dataset.rejectId}`, {
          method: "POST", body: JSON.stringify({ action: "reject" }),
        });
        await loadReviewData();
      } catch (e) { alert(e.message || "操作失败"); }
      finally { btn.disabled = false; }
    });
  });
};

document.querySelectorAll("[data-review-tab]")?.forEach((btn) => {
  btn?.addEventListener("click", () => {
    state.reviewTab = btn.dataset.reviewTab;
    loadReviewData(state.reviewTab);
  });
});

/* ---- Stats page ---- */
const renderGlobalStats = () => {
  if (!state.globalStats) { statsDashboard.innerHTML = `<div class="profile-empty">加载中...</div>`; return; }
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
    <div class="today-strip"><span>今日新增：${s.todayMessages} 留言 · ${s.todayComments} 评论 · ${s.todayLikes} 点赞</span></div>
  `;

  statsLeaders.innerHTML = state.globalLeaders.length ? `
    <h3>热门留言</h3>
    <div class="leader-list">
      ${state.globalLeaders.map((item, i) => `
        <article class="leader-item">
          <strong>${i + 1}</strong>
          <div>
            <p>${escapeHtml(item.content)}</p>
            <span>${escapeHtml(item.author)} · ${item.likeCount} 赞 · ${item.commentCount} 评论</span>
          </div>
          ${state.user?.isAdmin ? `<button class="danger-button small" data-admin-delete-message="${item.id}">删除</button>` : ""}
        </article>
      `).join("")}
    </div>
  ` : "";

  statsLeaders?.querySelectorAll("[data-admin-delete-message]")?.forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (!confirm("确定要删除这条留言吗？删除后无法恢复。")) return;
      await request(`/api/admin/messages/${btn.dataset.adminDeleteMessage}`, { method: "DELETE" });
      await loadGlobalStats(); await loadMessages();
    });
  });
};

const loadGlobalStats = async () => {
  const data = await request("/api/stats");
  state.globalStats = data.stats;
  state.globalLeaders = data.leaders || [];
  renderGlobalStats();
  if (state.user?.isAdmin) renderAdminReview();
};

/* ---- Boot ---- */
const boot = async () => {
  const data = await request("/api/me");
  state.user = data.user;
  renderAuth();
  navigate(location.hash.slice(1) || "home");
};

boot().catch((error) => {
  console.error(error);
  renderAuth();
  navigate("home");
});
