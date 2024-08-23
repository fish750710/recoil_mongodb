const express = require("express");
const cors = require("cors");
// const dotenv = require("dotenv");
const compression = require("compression"); // 壓縮傳輸
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser"); // 解析請求體
const helmet = require("helmet"); // 安全 預防XSS攻擊

// console.log(dotenv.config(), dotenv);

const app = express();
const port = 3000;

import api from "./api-mediators";

app.use(cors()).use(compression()).use(express.json()).use(cookieParser()).use(bodyParser.json()).use(helmet()).use('/api', api);


// app.get("/", (req, res) => {
//   res.send("Hello World", req, res);
// });
// app.get('/user', (req: any, res: any) => {
//   res.send('user');
//   // console.log('user', req, res);
//   // res.json({ name: 'fish', age: 20 });
// });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
