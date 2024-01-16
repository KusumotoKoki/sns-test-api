const express = require('express');
const app = express();
const cors = require('cors');

require("dotenv").config();

// corsミドルウェアを使用します
app.use(cors());

// express.jsonミドルウェアを使用します
app.use(express.json());

const authRoute = require("./routers/auth");
const postsRoute = require("./routers/posts");
const usersRoute = require("./routers/users");
app.use("/api/auth", authRoute);
app.use("/api/posts", postsRoute);
app.use("/api/users", usersRoute);

// サーバーのポート番号を設定します
const PORT = 5000;

// 指定したポートでサーバーを起動します
app.listen(PORT, () => {
  // サーバーが起動したことをコンソールにログ出力します
  console.log(`Server is running on port ${PORT}`);
});