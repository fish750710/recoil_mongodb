const { Worker } = require("worker_threads");
const fs = require("fs");
const pLimit = require("p-limit");
const os = require("os");
const numCPUs = os.cpus().length;

// 项目列表
const projectList = fs
  .readdirSync("./src/")
  .filter((item) => item.includes("pc-"))
  .slice(0, 48);

// 开始时间
const startTime = new Date();
const limit = pLimit(numCPUs);

// 创建工作线程并运行
function runWorker(project) {
  return new Promise((resolve, reject) => {
    const worker = new Worker("./buildWorker.js", { workerData: { project } });

    worker.on("message", (message) => {
      console.log(message);
    });

    worker.on("exit", (code) => {
      if (code === 0) {
        resolve(`Project ${project} built successfully.`);
      } else {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });

    // 处理工作线程中的错误
    worker.on("error", (error) => {
      reject(error);
    });
  });
}

async function main() {
  try {
    const buildPromises = projectList.map((project) =>
      limit(() => runWorker(project))
    );
    await Promise.all(buildPromises);

    const minutes = (new Date() - startTime) / 1000 / 60;
    console.log(
      `-----------------------所有项目打包完成，总耗时${minutes}分钟------------------------`
    );
  } catch (error) {
    console.error(error);
  }
}

main();
