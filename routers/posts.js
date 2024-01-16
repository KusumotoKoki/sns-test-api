const router = require('express').Router();


// Prismaクライアントとbcryptをインポートします
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const isAuthenticated = require('../middlewares/isAuthenticated');
const prisma = new PrismaClient();



// つぶやき投稿用API
router.post("/post", isAuthenticated, async (req, res) => {
  const { content } = req.body;

   if (!content) {
    return res.status(400).json({ messages: "投稿内容がありません" })
   }
  
  try {
    const newPost = await prisma.post.create({
      data: {
        content: content,
        authorId: req.userId,
      },
      include: {
        author: true,
      }
    });

    res.status(201).json(newPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "サーバーエラーです。"})
  }
});



// 最新つぶやき取得用API
router.get("/get_latest_post", async (req, res) => {
  try {
    const latestPosts = await prisma.post.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        author: true,
      }
    });
    return res.json(latestPosts);

  } catch (error) {
    res.status(500).json({ message: "サーバーエラーです" });
  }
});


module.exports = router;
