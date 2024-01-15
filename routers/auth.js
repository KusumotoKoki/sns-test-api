const router = require('express').Router();


// Prismaクライアントとbcryptをインポートします
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();



// 新規ユーザー登録API
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  
  // bcryptを使用してパスワードをハッシュ化します
  const hashedPassword = await bcrypt.hash(password, 10);
  
  // Prismaクライアントを使用して新しいユーザーを作成します
  // prisma.user.create <- このuserは、schema.prismaにUserってあるのから来てる
  const newUser = await prisma.user.create({
    data: {
      username: username,
      email: email,
      password: hashedPassword, // ハッシュ化したパスワードを保存します
    },
  });
  
  return res.json({ newUser });
});


// jsonwebtokenモジュールをインポートします
const jwt = require('jsonwebtoken');
// 環境変数を読み込むためにdotenvモジュールをインポートします
require("dotenv").config();

// ユーザーログインAPI
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // メールアドレスでユーザーを検索します
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  // ユーザーが存在しない場合、エラーメッセージを返します
  if (!user) {
    return res.status(401).json({ error: "User not found" });
  }

  // パスワードが一致するか確認します
  const valid = await bcrypt.compare(password, user.password);

  // パスワードが一致しない場合、エラーメッセージを返します
  if (!valid) {
    return res.status(401).json({ error: "Incorrect password" });
  }

  // JWTトークンを生成します
  const secretKey = process.env.SECRET_KEY;
  const token = jwt.sign({ id: user.id }, secretKey, {
    expiresIn: "1d",
  });

  // トークンを返します
  return res.json({ token });
});


module.exports = router;
