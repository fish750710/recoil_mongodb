import { Router, Request, Response } from "express";
import mongoose, { Schema, Document } from "mongoose";

const router = Router();

const mongoURI =
  "mongodb+srv://fish750710:750710@cluster0.karnl.mongodb.net/mydb?retryWrites=true&w=majority&appName=Cluster0";
mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("MongoDB 连接成功");
    // console.log("当前数据库：", mongoose.connection.db.databaseName);
  })
  .catch((err: Error) => console.error("MongoDB 连接错误:", err));

// 创建用户接口
interface IUser extends Document {
  name: string;
  age: number;
}

// 创建用户模型
const userSchema = new Schema<IUser>({
  name: String,
  age: Number,
});

const User = mongoose.model<IUser>("User", userSchema);

// 获取所有用户
router.get("/*", async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "发生未知错误" });
    }
  }
});

// 创建新用户
router.post("/*", async (req: Request, res: Response) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();

    // 立即查询并打印所有用户
    // const allUsers = await User.find();
    // console.log("所有用户：", allUsers);

    res.status(201).json(newUser);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "创建用户时发生未知错误" });
    }
  }
});

export default router;
