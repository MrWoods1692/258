import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { config } from "dotenv";
import { Hono } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { createHash, createHmac, randomBytes, timingSafeEqual as safeEqual } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

config();

const requiredEnv = [
  "PUBLIC_BASE_URL",
  "OAUTH_AUTHORIZATION_URL",
  "OAUTH_TOKEN_URL",
  "OAUTH_USERINFO_URL",
  "OAUTH_CLIENT_ID",
  "OAUTH_CLIENT_SECRET",
  "OAUTH_REDIRECT_URI",
  "OAUTH_SCOPE",
  "SESSION_SECRET",
];

const missingKeys = requiredEnv.filter((key) => !process.env[key]);
if (missingKeys.length > 0) {
  console.error(`[message-board] FATAL: Missing required env vars:\n  ${missingKeys.join("\n  ")}`);
  console.error(`[message-board] Copy .env.example to .env and fill in the values.`);
  process.exit(1);
}

const app = new Hono();
const port = Number(process.env.PORT || 6666);
const publicBaseUrl = process.env.PUBLIC_BASE_URL || `http://localhost:${port}`;
const cookieSecure = process.env.COOKIE_SECURE ? process.env.COOKIE_SECURE === "true" : publicBaseUrl.startsWith("https://");
const sessionSecret = process.env.SESSION_SECRET;
const adminQqs = new Set((process.env.ADMIN_QQS || "").split(",").map((qq) => qq.trim()).filter(Boolean));
const bannedWords = (process.env.BANNED_WORDS || "赌博,诈骗,代考,外挂,色情,辱骂,暴力").split(",").map((word) => word.trim()).filter(Boolean);
const aiModerationEnabled = process.env.AI_MODERATION_ENABLED === "true";
const aiApiEndpoint = process.env.AI_API_ENDPOINT || "https://api.openai.com/v1/chat/completions";
const aiApiKey = process.env.AI_API_KEY || "";
const aiModel = process.env.AI_MODEL || "gpt-4o-mini";
const dataDir = join(process.cwd(), "data");
const dataFile = join(dataDir, "message-board.json");

if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

const emptyStore = () => ({ users: [], messages: [], comments: [], likes: [], moderationLogs: [] });
const readStore = () => {
  if (!existsSync(dataFile)) return emptyStore();
  return { ...emptyStore(), ...JSON.parse(readFileSync(dataFile, "utf8")) };
};
const writeStore = (store) => writeFileSync(dataFile, JSON.stringify(store, null, 2));
const nextId = (items) => items.reduce((maxId, item) => Math.max(maxId, item.id), 0) + 1;

const randomToken = () => randomBytes(32).toString("base64url");
const sha256 = (value) => createHash("sha256").update(value).digest("base64url");
const hmac = (value) => createHmac("sha256", sessionSecret).update(value).digest("base64url");
const sign = (value) => `${value}.${hmac(value)}`;
const timingSafeEqual = (left, right) => {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && safeEqual(leftBuffer, rightBuffer);
};
const verifySignedValue = (signedValue) => {
  if (!signedValue) return null;
  const separatorIndex = signedValue.lastIndexOf(".");
  if (separatorIndex < 1) return null;
  const value = signedValue.slice(0, separatorIndex);
  const signature = signedValue.slice(separatorIndex + 1);
  return timingSafeEqual(signature, hmac(value)) ? value : null;
};

const setSignedCookie = (c, name, value, maxAge = 60 * 60 * 24 * 7) => {
  setCookie(c, name, sign(value), {
    httpOnly: true,
    sameSite: "Lax",
    secure: cookieSecure,
    path: "/",
    maxAge,
  });
};
const getSignedCookie = (c, name) => verifySignedValue(getCookie(c, name));

const getCurrentUser = (c) => {
  const userId = Number(getSignedCookie(c, "mb_session"));
  if (!userId) return null;
  const user = readStore().users.find((item) => item.id === userId);
  if (!user) return null;
  return {
    id: user.id,
    oauth_sub: user.oauth_sub,
    qq: user.qq,
    display_name: user.display_name,
    tenant_id: user.tenant_id,
    tenant_name: user.tenant_name,
    tenant_slug: user.tenant_slug,
    isAdmin: isAdmin(user),
  };
};

const requireUser = (c) => {
  const user = getCurrentUser(c);
  if (!user) return c.json({ error: "UNAUTHORIZED" }, 401);
  return user;
};

const now = () => new Date().toISOString();
const normalizeContent = (content, maxLength) => {
  // 移除控制字符、HTML标签和危险字符，防止XSS注入
  return String(content || "")
    .replace(/[\u0000-\u001f\u007f]/g, " ")  // 移除控制字符
    .replace(/<script[^>]*>.*?<\/script>/gi, "")  // 移除script标签
    .replace(/<[^>]+>/g, "")  // 移除所有HTML标签
    .replace(/javascript:/gi, "")  // 移除javascript:协议
    .replace(/on\w+\s*=/gi, "")  // 移除事件处理器 (onclick=, onerror=等)
    .replace(/\s+/g, " ")  // 合并空白字符
    .trim()
    .slice(0, maxLength);
};
const findViolation = (content) => bannedWords.find((word) => word && content.toLowerCase().includes(word.toLowerCase()));

const moderateWithAI = async (content) => {
  if (!aiModerationEnabled || !aiApiKey) {
    return { approved: true, reason: "" };
  }

  try {
    const response = await fetch(aiApiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${aiApiKey}`,
      },
      body: JSON.stringify({
        model: aiModel,
        messages: [
          {
            role: "system",
            content: "你是一个内容审核助手。请分析用户提交的留言内容，判断是否包含不适当内容。不适当内容包括但不限于：赌博、诈骗、代考作弊、外挂、色情、辱骂、暴力、广告推广、人身攻击等。\n\n请返回严格的JSON格式：{\"approved\": true/false, \"reason\": \"审核理由\"}\n\n如果内容健康正常，返回：{\"approved\": true, \"reason\": \"\"}\n如果内容不适当，返回：{\"approved\": false, \"reason\": \"具体原因\"}"
          },
          {
            role: "user",
            content: `请审核以下内容：\n\n${content}`
          }
        ],
        temperature: 0.3,
        max_tokens: 200,
        response_format: { type: "json_object" }
      }),
      signal: AbortSignal.timeout(5000), // 5秒超时
    });

    if (!response.ok) {
      console.error(`[AI Moderation] API error: ${response.status} ${response.statusText}`);
      return { approved: true, reason: "" };
    }

    const data = await response.json();
    const content_text = data.choices?.[0]?.message?.content || "{}";
    const result = JSON.parse(content_text);
    
    return {
      approved: result.approved !== false,
      reason: result.reason || ""
    };
  } catch (error) {
    console.error("[AI Moderation] Error:", error.message);
    return { approved: true, reason: "" };
  }
};

const validateContent = async (content, maxLength) => {
  const normalized = normalizeContent(content, maxLength);
  if (!normalized) return { ok: false, error: "内容不能为空" };
  
  // 先检查关键词黑名单
  const matchedWord = findViolation(normalized);
  if (matchedWord) return { ok: false, error: "内容包含不适合发布的词语，请修改后再提交。", matchedWord };
  
  // 使用AI审核
  const aiResult = await moderateWithAI(normalized);
  if (!aiResult.approved) {
    return { ok: false, error: aiResult.reason || "内容审核未通过，请修改后再提交。" };
  }
  
  return { ok: true, content: normalized };
};
const likeCount = (store, targetType, targetId) => store.likes.filter((like) => like.target_type === targetType && like.target_id === targetId).length;
const likedBy = (store, userId, targetType, targetId) => store.likes.some((like) => like.user_id === userId && like.target_type === targetType && like.target_id === targetId);
const isAdmin = (user) => Boolean(user && adminQqs.has(String(user.qq)));
const avatarUrl = (qq) => `https://q1.qlogo.cn/g?b=qq&nk=${encodeURIComponent(String(qq || "0"))}&s=100`;
const canSeeItem = (item, user) => item.status === "approved" || item.user_id === user.id || isAdmin(user);
const pendingNotice = (status) => status === "pending" ? "待审核" : "";
const statusLabel = (status) => ({ pending: "待审核", approved: "已通过", rejected: "未通过" }[status] || "已通过");
const countByStatus = (items, status) => items.filter((item) => (item.status || "approved") === status).length;
const isToday = (value) => value && value.slice(0, 10) === now().slice(0, 10);
const auditItem = (store, type, item) => {
  const author = store.users.find((user) => user.id === item.user_id);
  return {
    type,
    id: item.id,
    content: item.content,
    author: author?.display_name || "同学",
    qq: author?.qq || "",
    createdAt: item.created_at,
    status: item.status || "approved",
  };
};
const displayAuthor = (message, author, currentUserId) => {
  if (!message.is_anonymous || message.user_id === currentUserId) return author?.display_name || "同学";
  return "匿名同学";
};
const displayAvatar = (message, author, currentUserId) => {
  if (!message.is_anonymous) return avatarUrl(author?.qq);
  return null;
};
const removeMessage = (store, messageId) => {
  const commentIds = store.comments.filter((comment) => comment.message_id === messageId).map((comment) => comment.id);
  store.messages = store.messages.filter((message) => message.id !== messageId);
  store.comments = store.comments.filter((comment) => comment.message_id !== messageId);
  store.likes = store.likes.filter((like) => !(like.target_type === "message" && like.target_id === messageId) && !(like.target_type === "comment" && commentIds.includes(like.target_id)));
};
const removeComment = (store, commentId) => {
  store.comments = store.comments.filter((comment) => comment.id !== commentId);
  store.likes = store.likes.filter((like) => !(like.target_type === "comment" && like.target_id === commentId));
};

const requireAdmin = (c) => {
  const user = requireUser(c);
  if (user instanceof Response) return user;
  if (!isAdmin(user)) return c.json({ error: "FORBIDDEN" }, 403);
  return user;
};

app.use("*", async (c, next) => {
  c.header("Content-Security-Policy", "default-src 'self'; script-src 'self' https://static.cloudflareinsights.com; style-src 'self'; img-src 'self' data: https://q1.qlogo.cn; connect-src 'self' https://static.cloudflareinsights.com; base-uri 'self'; form-action 'self'; frame-ancestors 'none'");
  c.header("X-Content-Type-Options", "nosniff");
  c.header("X-Frame-Options", "DENY");
  c.header("Referrer-Policy", "same-origin");
  c.header("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  if (!["GET", "HEAD", "OPTIONS"].includes(c.req.method)) {
    const origin = c.req.header("origin");
    if (origin && origin !== publicBaseUrl) return c.json({ error: "INVALID_ORIGIN" }, 403);
  }
  await next();
});

app.use("/assets/*", serveStatic({ root: "./public" }));
app.use("/favicon.ico", serveStatic({ root: "./public" }));
app.get("/", serveStatic({ path: "./public/index.html" }));

app.get("/auth/login", (c) => {
  const state = randomToken();
  const verifier = randomToken();
  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.OAUTH_CLIENT_ID || "",
    redirect_uri: process.env.OAUTH_REDIRECT_URI,
    scope: process.env.OAUTH_SCOPE || "profile",
    state,
    code_challenge: sha256(verifier),
    code_challenge_method: "S256",
  });

  setSignedCookie(c, "mb_oauth_state", state, 600);
  setSignedCookie(c, "mb_pkce_verifier", verifier, 600);
  return c.redirect(`${process.env.OAUTH_AUTHORIZATION_URL}?${params.toString()}`);
});

app.get("/auth/callback", async (c) => {
  const code = c.req.query("code");
  const state = c.req.query("state");
  const storedState = getSignedCookie(c, "mb_oauth_state");
  const verifier = getSignedCookie(c, "mb_pkce_verifier");

  if (!code || !state || !storedState || state !== storedState || !verifier) {
    deleteCookie(c, "mb_oauth_state", { path: "/" });
    deleteCookie(c, "mb_pkce_verifier", { path: "/" });
    return c.text("OAuth state validation failed.", 400);
  }

  const tokenResponse = await fetch(process.env.OAUTH_TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: process.env.OAUTH_REDIRECT_URI,
      client_id: process.env.OAUTH_CLIENT_ID || "",
      client_secret: process.env.OAUTH_CLIENT_SECRET || "",
      code_verifier: verifier,
    }),
  });

  if (!tokenResponse.ok) return c.text("OAuth token exchange failed.", 502);

  let tokenData;
  try {
    tokenData = await tokenResponse.json();
  } catch {
    return c.text("OAuth token endpoint returned invalid JSON.", 502);
  }
  if (!tokenData.access_token) return c.text("OAuth token response missing access_token.", 502);
  const userInfoResponse = await fetch(process.env.OAUTH_USERINFO_URL, {
    headers: { authorization: `Bearer ${tokenData.access_token}` },
  });

  if (!userInfoResponse.ok) return c.text("OAuth userinfo request failed.", 502);

  let profile;
  try {
    profile = await userInfoResponse.json();
  } catch {
    return c.text("OAuth userinfo endpoint returned invalid JSON.", 502);
  }
  if (!profile.sub || !profile.name) return c.text("OAuth profile must include sub and name.", 400);
  if (!/^\d{5,12}$/.test(profile.name)) return c.text("OAuth profile name must be a valid QQ number (5-12 digits).", 400);

  const store = readStore();
  const existingUser = store.users.find((user) => user.oauth_sub === profile.sub);
  const userData = {
    id: existingUser?.id || nextId(store.users),
    oauth_sub: profile.sub,
    qq: profile.name,
    display_name: profile.preferred_username || profile.name,
    tenant_id: profile.tenant_id || null,
    tenant_name: profile.tenant_name || null,
    tenant_slug: profile.tenant_slug || null,
    created_at: existingUser?.created_at || now(),
    updated_at: now(),
  };

  if (existingUser) {
    store.users = store.users.map((user) => (user.id === existingUser.id ? userData : user));
  } else {
    store.users.push(userData);
  }
  writeStore(store);

  setSignedCookie(c, "mb_session", String(userData.id));
  deleteCookie(c, "mb_oauth_state", { path: "/" });
  deleteCookie(c, "mb_pkce_verifier", { path: "/" });
  return c.redirect("/");
});

app.post("/auth/logout", (c) => {
  deleteCookie(c, "mb_session", { path: "/" });
  return c.json({ ok: true });
});

app.get("/api/me", (c) => c.json({ user: getCurrentUser(c) }));

app.get("/api/me/activity", (c) => {
  const user = requireUser(c);
  if (user instanceof Response) return user;

  const store = readStore();
  const myMessages = store.messages
    .filter((message) => message.user_id === user.id)
    .map((message) => ({
      id: message.id,
      content: message.content,
      isAnonymous: Boolean(message.is_anonymous),
      status: message.status || "approved",
      statusText: statusLabel(message.status || "approved"),
      createdAt: message.created_at,
      likeCount: likeCount(store, "message", message.id),
      commentCount: store.comments.filter((comment) => comment.message_id === message.id).length,
    }))
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));

  const myComments = store.comments
    .filter((comment) => comment.user_id === user.id)
    .map((comment) => {
      const message = store.messages.find((item) => item.id === comment.message_id);
      return {
        id: comment.id,
        messageId: comment.message_id,
        content: comment.content,
        messagePreview: message?.content || "原留言已删除",
        status: comment.status || "approved",
        statusText: statusLabel(comment.status || "approved"),
        createdAt: comment.created_at,
        likeCount: likeCount(store, "comment", comment.id),
      };
    })
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));

  const messageLikes = myMessages.reduce((total, message) => total + message.likeCount, 0);
  const commentLikes = myComments.reduce((total, comment) => total + comment.likeCount, 0);
  const recentActivity = [...myMessages, ...myComments].sort((left, right) => right.createdAt.localeCompare(left.createdAt))[0]?.createdAt || "";
  return c.json({
    avatarUrl: avatarUrl(user.qq),
    stats: {
      messageCount: myMessages.length,
      commentCount: myComments.length,
      receivedLikes: messageLikes + commentLikes,
      messageLikes,
      commentLikes,
      givenLikes: store.likes.filter((like) => like.user_id === user.id).length,
      pendingCount: countByStatus([...myMessages, ...myComments], "pending"),
      approvedCount: countByStatus([...myMessages, ...myComments], "approved"),
      rejectedCount: countByStatus([...myMessages, ...myComments], "rejected"),
      anonymousCount: myMessages.filter((message) => message.isAnonymous).length,
      recentActivity,
    },
    messages: myMessages,
    comments: myComments,
  });
});

app.delete("/api/admin/messages/:id", (c) => {
  const user = requireAdmin(c);
  if (user instanceof Response) return user;

  const messageId = Number(c.req.param("id"));
  const store = readStore();
  const message = store.messages.find((item) => item.id === messageId);
  if (!message) return c.json({ error: "留言不存在" }, 404);
  removeMessage(store, messageId);
  writeStore(store);
  return c.json({ ok: true });
});

app.get("/api/messages", (c) => {
  const user = getCurrentUser(c);

  const store = readStore();
  const messages = [...store.messages]
    .map((message) => ({ ...message, status: message.status || "approved" }))
    .filter((message) => canSeeItem(message, user))
    .sort((left, right) => right.created_at.localeCompare(left.created_at));

  return c.json({
    messages: messages.map((message) => {
      const author = store.users.find((item) => item.id === message.user_id);
      const comments = store.comments
        .map((comment) => ({ ...comment, status: comment.status || "approved" }))
        .filter((comment) => comment.message_id === message.id && canSeeItem(comment, user))
        .sort((left, right) => left.created_at.localeCompare(right.created_at))
        .map((comment) => {
          const commentAuthor = store.users.find((item) => item.id === comment.user_id);
          return {
            id: comment.id,
            content: comment.content,
            author: commentAuthor?.display_name || "同学",
            avatarUrl: avatarUrl(commentAuthor?.qq),
            isMine: user ? comment.user_id === user.id : false,
            createdAt: comment.created_at,
            status: comment.status,
            statusText: pendingNotice(comment.status),
            likeCount: likeCount(store, "comment", comment.id),
            likedByMe: user ? likedBy(store, user.id, "comment", comment.id) : false,
          };
        });

      return {
        id: message.id,
        content: message.content,
        author: user ? displayAuthor(message, author, user.id) : (author?.display_name || "同学"),
        avatarUrl: user ? displayAvatar(message, author, user.id) : avatarUrl(author?.qq),
        isMine: user ? message.user_id === user.id : false,
        isAnonymous: Boolean(message.is_anonymous),
        createdAt: message.created_at,
        status: message.status,
        statusText: pendingNotice(message.status),
        likeCount: likeCount(store, "message", message.id),
        likedByMe: user ? likedBy(store, user.id, "message", message.id) : false,
        commentCount: comments.length,
        comments,
      };
    }),
  });
});

app.get("/api/stats", (c) => {
  const store = readStore();
  const messages = store.messages.map((message) => ({ ...message, status: message.status || "approved" }));
  const comments = store.comments.map((comment) => ({ ...comment, status: comment.status || "approved" }));
  const approvedMessages = messages.filter((m) => m.status === "approved");
  const approvedComments = comments.filter((c) => c.status === "approved");
  const messageLikeLeaders = approvedMessages
    .map((message) => ({
      id: message.id,
      content: message.content,
      author: store.users.find((user) => user.id === message.user_id)?.display_name || "同学",
      likeCount: likeCount(store, "message", message.id),
      commentCount: comments.filter((comment) => comment.message_id === message.id).length,
    }))
    .sort((left, right) => right.likeCount - left.likeCount)
    .slice(0, 5);

  return c.json({
    stats: {
      userCount: store.users.length,
      messageCount: approvedMessages.length,
      commentCount: approvedComments.length,
      likeCount: store.likes.length,
      anonymousCount: approvedMessages.filter((m) => m.is_anonymous).length,
      todayMessages: approvedMessages.filter((m) => isToday(m.created_at)).length,
      todayComments: approvedComments.filter((c) => isToday(c.created_at)).length,
      todayLikes: store.likes.filter((l) => isToday(l.created_at)).length,
    },
    leaders: messageLikeLeaders,
  });
});

app.delete("/api/messages/:id", (c) => {
  const user = requireUser(c);
  if (user instanceof Response) return user;

  const messageId = Number(c.req.param("id"));
  const store = readStore();
  const message = store.messages.find((item) => item.id === messageId);
  if (!message || message.user_id !== user.id) return c.json({ error: "留言不存在" }, 404);
  removeMessage(store, messageId);
  writeStore(store);
  return c.json({ ok: true });
});

app.post("/api/messages", async (c) => {
  const user = requireUser(c);
  if (user instanceof Response) return user;

  const body = await c.req.json().catch(() => ({}));
  const validation = await validateContent(body.content, 500);
  if (!validation.ok) return c.json({ error: validation.error }, 400);

  const store = readStore();
  store.messages.push({
    id: nextId(store.messages),
    user_id: user.id,
    content: validation.content,
    is_anonymous: Boolean(body.isAnonymous),
    status: "approved",
    created_at: now(),
    updated_at: now(),
  });
  writeStore(store);
  return c.json({ ok: true, status: "approved" }, 201);
});

app.post("/api/messages/:id/comments", async (c) => {
  const user = requireUser(c);
  if (user instanceof Response) return user;

  const messageId = Number(c.req.param("id"));
  const store = readStore();
  const message = store.messages.find((item) => item.id === messageId);
  if (!message || !canSeeItem({ ...message, status: message.status || "approved" }, user)) return c.json({ error: "留言不存在" }, 404);

  const body = await c.req.json().catch(() => ({}));
  const validation = await validateContent(body.content, 280);
  if (!validation.ok) return c.json({ error: validation.error }, 400);

  store.comments.push({ id: nextId(store.comments), message_id: messageId, user_id: user.id, content: validation.content, status: "approved", created_at: now(), updated_at: now() });
  writeStore(store);
  return c.json({ ok: true, status: "approved" }, 201);
});

app.delete("/api/comments/:id", (c) => {
  const user = requireUser(c);
  if (user instanceof Response) return user;

  const commentId = Number(c.req.param("id"));
  const store = readStore();
  const comment = store.comments.find((item) => item.id === commentId);
  if (!comment || comment.user_id !== user.id) return c.json({ error: "评论不存在" }, 404);
  removeComment(store, commentId);
  writeStore(store);
  return c.json({ ok: true });
});

app.post("/api/likes/:type/:id", (c) => {
  const user = requireUser(c);
  if (user instanceof Response) return user;

  const type = c.req.param("type");
  const targetId = Number(c.req.param("id"));
  if (!["message", "comment"].includes(type) || !Number.isInteger(targetId)) return c.json({ error: "无效的点赞目标" }, 400);

  const store = readStore();
  const targets = type === "message" ? store.messages : store.comments;
  const target = targets.find((item) => item.id === targetId);
  if (!target || !canSeeItem({ ...target, status: target.status || "approved" }, user) || (target.status || "approved") !== "approved") {
    return c.json({ error: "点赞目标不存在" }, 404);
  }

  const existingLike = store.likes.find((like) => like.user_id === user.id && like.target_type === type && like.target_id === targetId);
  if (existingLike) {
    store.likes = store.likes.filter((like) => like !== existingLike);
    writeStore(store);
    return c.json({ liked: false });
  }

  store.likes.push({ user_id: user.id, target_type: type, target_id: targetId, created_at: now() });
  writeStore(store);
  return c.json({ liked: true });
});

serve({ fetch: app.fetch, port }, () => {
  console.log(`Message board is running at ${publicBaseUrl}`);
});