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
https://258.board.mrcwoods.com/auth/callback
```

> ⚠️ 此地址已硬编码为线上地址。本地开发时需在 `.env` 中覆盖 `OAUTH_REDIRECT_URI=http://localhost:6666/auth/callback`。

## 环境变量

`.env.example` 已预填线上配置（`Client ID` 为测试值）。`OAUTH_CLIENT_SECRET`、`SESSION_SECRET` 和 OAuth 端点在本地 `.env` 手动填写，不要提交真实密钥。

> ⚠️ `.env.example` 默认指向线上域名，**本地开发**必须覆盖：
> - `PUBLIC_BASE_URL=http://localhost:6666`
> - `OAUTH_REDIRECT_URI=http://localhost:6666/auth/callback`
> - `COOKIE_SECURE=false`

数据默认存储在 `message-board/data/message-board.json`。生产环境留言较多时，可以把 `server.js` 里的存储层替换成 SQLite、PostgreSQL 或 MySQL，接口不用改。