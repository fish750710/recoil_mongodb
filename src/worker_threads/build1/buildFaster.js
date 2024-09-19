const fs = require("fs");
const { spawn } = require("child_process");
const compressing = require("compressing");
const pLimit = require("p-limit"); // 引入 p-limit 库
const limit = pLimit(5); // 设置并发限制为 5

// 项目列表
const projectList = fs
  .readdirSync("./src/")
  .filter((item) => item.includes("pc-"))
  .slice(0, 1);
// 开始时间
let startTime = new Date();

// 打包并压缩单个项目
async function buildSingleProject(projectName) {
  try {
    console.log(`-----------------开始打包${projectName}-----------------`);
    // 执行系统命令打包
    await new Promise((resolve, reject) => {
      const buildProcess = spawn("npm", ["run", "buildAll", projectName], {
        stdio: "inherit",
      });
      buildProcess.on("close", (code) => {
        if (code !== 0) {
          reject(new Error(`打包失败: ${projectName}`));
        } else {
          resolve();
        }
      });
    });
    // 开始压缩
    await compressing.zip.compressDir(
      `./build/${projectName}`,
      `./build/${projectName}.zip`
    );
  } catch (error) {
    console.log(`打包失败: ${projectName}`, error);
  }
}

// 打包所有项目
async function buildAllProjects() {
  try {
    // 使用 Promise.all 并行打包多个项目，限制并发数量
    await Promise.all(
      projectList.map((projectName) =>
        limit(() => buildSingleProject(projectName))
      )
    );
  } finally {
    const minutes = (new Date() - startTime) / 1000 / 60;
    console.log(
      `-----------------------所有项目打包完成，总耗时${minutes}分钟------------------------`
    );
    // 打包完成，还原原先配置
  }
}

buildAllProjects();
