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

for (const key of requiredEnv) {
  if (!process.env[key]) {
    console.warn(`[message-board] Missing ${key}; copy .env.example to .env and fill it before login works.`);
  }
}

const app = new Hono();
const port = Number(process.env.PORT || 6666);
const publicBaseUrl = process.env.PUBLIC_BASE_URL || `http://localhost:${port}`;
const cookieSecure = process.env.COOKIE_SECURE === "true";
const sessionSecret = process.env.SESSION_SECRET || "dev-only-session-secret";
const adminQqs = new Set((process.env.ADMIN_QQS || "").split(",").map((qq) => qq.trim()).filter(Boolean));
const bannedWords = (process.env.BANNED_WORDS || "赌博,诈骗,代考,外挂,色情,辱骂,暴力").split(",").map((word) => word.trim()).filter(Boolean);
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
const normalizeContent = (content, maxLength) => String(content || "").replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, maxLength);
const findViolation = (content) => bannedWords.find((word) => word && content.toLowerCase().includes(word.toLowerCase()));
const validateContent = (content, maxLength) => {
  const normalized = normalizeContent(content, maxLength);
  if (!normalized) return { ok: false, error: "内容不能为空" };
  const matchedWord = findViolation(normalized);
  if (matchedWord) return { ok: false, error: "内容包含不适合发布的词语，请修改后再提交。", matchedWord };
  return { ok: true, content: normalized };
};
const likeCount = (store, targetType, targetId) => store.likes.filter((like) => like.target_type === targetType && like.target_id === targetId).length;
const likedBy = (store, userId, targetType, targetId) => store.likes.some((like) => like.user_id === userId && like.target_type === targetType && like.target_id === targetId);
const isAdmin = (user) => Boolean(user && adminQqs.has(String(user.qq)));
const canSeeItem = (item, user) => item.status === "approved" || item.user_id === user.id || isAdmin(user);
const pendingNotice = (status) => status === "pending" ? "待审核" : "";
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

const requireAdmin = (c) => {
  const user = requireUser(c);
  if (user instanceof Response) return user;
  if (!isAdmin(user)) return c.json({ error: "FORBIDDEN" }, 403);
  return user;
};

app.use("*", async (c, next) => {
  c.header("Content-Security-Policy", "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'");
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
    redirect_uri: process.env.OAUTH_REDIRECT_URI || `${publicBaseUrl}/auth/callback`,
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
    return c.text("OAuth state validation failed.", 400);
  }

  const tokenResponse = await fetch(process.env.OAUTH_TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: process.env.OAUTH_REDIRECT_URI || `${publicBaseUrl}/auth/callback`,
      client_id: process.env.OAUTH_CLIENT_ID || "",
      client_secret: process.env.OAUTH_CLIENT_SECRET || "",
      code_verifier: verifier,
    }),
  });

  if (!tokenResponse.ok) return c.text("OAuth token exchange failed.", 502);

  const tokenData = await tokenResponse.json();
  const userInfoResponse = await fetch(process.env.OAUTH_USERINFO_URL, {
    headers: { authorization: `Bearer ${tokenData.access_token}` },
  });

  if (!userInfoResponse.ok) return c.text("OAuth userinfo request failed.", 502);

  const profile = await userInfoResponse.json();
  if (!profile.sub || !profile.name) return c.text("OAuth profile must include sub and name.", 400);

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

app.get("/api/admin/moderation", (c) => {
  const user = requireAdmin(c);
  if (user instanceof Response) return user;

  const store = readStore();
  const messages = store.messages.map((message) => ({ ...message, status: message.status || "approved" }));
  const comments = store.comments.map((comment) => ({ ...comment, status: comment.status || "approved" }));
  return c.json({
    items: [
      ...messages.map((message) => auditItem(store, "message", message)),
      ...comments.map((comment) => auditItem(store, "comment", comment)),
    ].sort((left, right) => right.createdAt.localeCompare(left.createdAt)),
  });
});

app.post("/api/admin/moderation/:type/:id", async (c) => {
  const user = requireAdmin(c);
  if (user instanceof Response) return user;

  const type = c.req.param("type");
  const id = Number(c.req.param("id"));
  if (!["message", "comment"].includes(type) || !Number.isInteger(id)) return c.json({ error: "无效的审核目标" }, 400);

  const body = await c.req.json().catch(() => ({}));
  const action = String(body.action || "");
  if (!["approve", "reject", "delete"].includes(action)) return c.json({ error: "无效的审核操作" }, 400);

  const store = readStore();
  const collectionName = type === "message" ? "messages" : "comments";
  const item = store[collectionName].find((entry) => entry.id === id);
  if (!item) return c.json({ error: "审核目标不存在" }, 404);

  if (action === "delete") {
    if (type === "message") {
      const commentIds = store.comments.filter((comment) => comment.message_id === id).map((comment) => comment.id);
      store.comments = store.comments.filter((comment) => comment.message_id !== id);
      store.likes = store.likes.filter((like) => !(like.target_type === "message" && like.target_id === id) && !(like.target_type === "comment" && commentIds.includes(like.target_id)));
    } else {
      store.likes = store.likes.filter((like) => !(like.target_type === "comment" && like.target_id === id));
    }
    store[collectionName] = store[collectionName].filter((entry) => entry.id !== id);
  } else {
    item.status = action === "approve" ? "approved" : "rejected";
    item.moderated_by = user.id;
    item.moderated_at = now();
    item.updated_at = now();
  }

  store.moderationLogs.push({ id: nextId(store.moderationLogs), admin_user_id: user.id, target_type: type, target_id: id, action, created_at: now() });
  writeStore(store);
  return c.json({ ok: true });
});

app.get("/api/messages", (c) => {
  const user = requireUser(c);
  if (user instanceof Response) return user;

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
            createdAt: comment.created_at,
            status: comment.status,
            statusText: pendingNotice(comment.status),
            likeCount: likeCount(store, "comment", comment.id),
            likedByMe: likedBy(store, user.id, "comment", comment.id),
          };
        });

      return {
        id: message.id,
        content: message.content,
        author: displayAuthor(message, author, user.id),
        isMine: message.user_id === user.id,
        isAnonymous: Boolean(message.is_anonymous),
        createdAt: message.created_at,
        status: message.status,
        statusText: pendingNotice(message.status),
        likeCount: likeCount(store, "message", message.id),
        likedByMe: likedBy(store, user.id, "message", message.id),
        commentCount: comments.length,
        comments,
      };
    }),
  });
});

app.post("/api/messages", async (c) => {
  const user = requireUser(c);
  if (user instanceof Response) return user;

  const body = await c.req.json().catch(() => ({}));
  const validation = validateContent(body.content, 500);
  if (!validation.ok) return c.json({ error: validation.error }, 400);

  const store = readStore();
  store.messages.push({
    id: nextId(store.messages),
    user_id: user.id,
    content: validation.content,
    is_anonymous: Boolean(body.isAnonymous),
    status: "pending",
    created_at: now(),
    updated_at: now(),
  });
  writeStore(store);
  return c.json({ ok: true, status: "pending" }, 201);
});

app.post("/api/messages/:id/comments", async (c) => {
  const user = requireUser(c);
  if (user instanceof Response) return user;

  const messageId = Number(c.req.param("id"));
  const store = readStore();
  const message = store.messages.find((item) => item.id === messageId);
  if (!message || !canSeeItem({ ...message, status: message.status || "approved" }, user)) return c.json({ error: "留言不存在" }, 404);

  const body = await c.req.json().catch(() => ({}));
  const validation = validateContent(body.content, 280);
  if (!validation.ok) return c.json({ error: validation.error }, 400);

  store.comments.push({ id: nextId(store.comments), message_id: messageId, user_id: user.id, content: validation.content, status: "pending", created_at: now(), updated_at: now() });
  writeStore(store);
  return c.json({ ok: true, status: "pending" }, 201);
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