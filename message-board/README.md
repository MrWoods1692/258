# 班级留言板

这是和主站分离部署的留言板系统，放在 `message-board/` 目录内。主站仍然可以静态托管，留言板单独在服务器上运行。

## 功能

- OAuth + PKCE 登录，回调后读取 `sub`、`name`、`preferred_username`、租户信息。
- 只用 OAuth 返回的 `name` 作为 QQ 号入库。
- 登录后才能查看、发布留言。
- 留言记录内容、发布时间、留言人、点赞数、匿名显示状态。
- 支持留言点赞、评论、评论点赞，评论默认手动展开。
- 前端用便签卡片展示，便签颜色每次渲染随机。

## 本地运行

```bash
cd message-board
pnpm install
cp .env.example .env
pnpm dev
```

OAuth 回调地址配置为：

```text
http://localhost:6666/auth/callback
```

如果 OAuth 平台只允许填写 `localhost:6666`，请确认平台实际回调路径规则，并把 `.env` 里的 `OAUTH_REDIRECT_URI` 调整成平台认可的完整地址。

## 环境变量

`.env.example` 里已经包含测试用的 `Client ID`。`OAUTH_CLIENT_SECRET`、`SESSION_SECRET` 和 OAuth 端点需要在本地 `.env` 手动填写，不要提交真实密钥。

上线后需要改：

- `PUBLIC_BASE_URL`：留言板服务器域名。
- `OAUTH_REDIRECT_URI`：留言板域名下的 `/auth/callback`。
- `COOKIE_SECURE=true`：HTTPS 部署时启用安全 Cookie。

数据默认存储在 `message-board/data/message-board.json`。生产环境留言较多时，可以把 `server.js` 里的存储层替换成 SQLite、PostgreSQL 或 MySQL，接口不用改。