import { Router } from "express";
const mongoose = require("mongoose");

const router = Router();

const mongoURI =
  "mongodb+srv://fish750710:750710@cluster0.karnl.mongodb.net/mydb?retryWrites=true&w=majority&appName=Cluster0";
mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("MongoDB 连接成功");
    // console.log("当前数据库：", mongoose.connection.db.databaseName);
  })
  .catch((err: any) => console.error("MongoDB 连接错误:", err));

// 创建用户模型
const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
});

const User = mongoose.model("User", userSchema);

// 获取所有用户
router.get("/*", async (req:any, res:any) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error:any) {
    res.status(500).json({ message: error.message });
  }
});
// // 创建新用户
router.post("/*", async (req:any, res:any) => {
  try {
    // console.log(req.body, "***");
    const newUser = new User(req.body);
    await newUser.save();

    // 立即查询并打印所有用户
    // const allUsers = await User.find();
    // console.log("所有用户：", allUsers);

    res.status(201).json(newUser);
  } catch (error:any) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
