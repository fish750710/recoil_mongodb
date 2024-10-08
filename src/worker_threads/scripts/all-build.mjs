/**
 * 多线程全盘打包及压缩: nx run aifa:all-build
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Worker } from "worker_threads";
import os from "os";
import pLimit from "p-limit";
import compressing from "compressing";
import chalk from "chalk";
import { rimraf } from "rimraf";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envDirPath = path.resolve(__dirname, "../env");
const errors = [];

const adjustThreadCount = () => {
  const numCpus = os.cpus().length;
  let threadCount = Math.floor(numCpus * 0.8);

  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const usedMemoryPercentage = ((totalMemory - freeMemory) / totalMemory) * 100;
  console.log(
    chalk.yellow(`已使用内存百分比: ${usedMemoryPercentage.toFixed(2)}%`)
  );
  const dynamicScale = 1 - (totalMemory - freeMemory) / totalMemory;
  return Math.floor(threadCount * dynamicScale) - 1; // 当前内存动态计算线程数
};
const threadCount = adjustThreadCount();
const limit = pLimit(threadCount);

const startTime = Date.now();
const getEnvFiles = () => {
  try {
    const files = fs.readdirSync(envDirPath);
    // 使用正则表达式筛选以 .env. 开头，且不以 .local 结尾的文件
    const envFiles = files.filter((file) =>
      /\.env\..*(?<!\.local)$/.test(file)
    );
    return envFiles;
  } catch (err) {
    console.error("Error reading env directory:", err);
    return [];
  }
};

const fileExists = async (filePath) => {
  try {
    await fs.promises.access(filePath);
    return true;
  } catch {
    return false;
  }
};

const workerHandler = (companyData, index, length) => {
  const match = companyData.match(/\.env\.(.+)/);
  const envFileName = match ? match[1] : null; // env.xxx
  const envFilePath = path.join(envDirPath, `.env.${envFileName}`);

  console.log(
    chalk.blue(
      `<-----数量:${index + 1}/${length}，开始打包:${envFileName}----->`
    )
  );
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.resolve(__dirname, "./worker.js"), {
      workerData: { envFileName, envFilePath },
    });
    worker.on("message", (message) => {
      errors.push({
        companyName: message.companyName,
        msg: `err-message: ${message.message}`,
      });
      resolve();
    });
    worker.on("error", (error) => {
      errors.push({
        companyName: "worker-error",
        msg: `Worker error: ${error}`,
      });
      reject(error);
    });
    worker.on("exit", async (code) => {
      if (code === 0) {
        return resolve();
      } else {
        errors.push({
          companyName: envFileName,
          msg: `<----- ${envFileName} error. ----->`,
        });
        return reject();
      }
    });
  });
};

// 压缩
const compressAll = async () => {
  const distDirPath = path.resolve(__dirname, "../dist");
  const files = fs.readdirSync(distDirPath);
  const nonZipFiles = files.filter((file) => !file.endsWith(".zip"));
  await Promise.all(
    nonZipFiles.map(async (dir) => {
      try {
        const outputDir = path.resolve(distDirPath, dir);
        if (fileExists(outputDir)) {
          await compressing.zip.compressDir(outputDir, `${outputDir}.zip`);
        }
      } catch (err) {
        errors.push({ msg: `Compression failed for ${dir}: ${err.message}` });
      }
    })
  );
};

const buildHandler = async () => {
  try {
    rimraf.sync(path.resolve(__dirname, "../dist"));
    console.log(chalk.yellow(`<-----使用${threadCount}个线程打包----->`));
    const allEnvFiles = getEnvFiles();
    const dotenvFilesLength = allEnvFiles.length;
    await Promise.all(
      allEnvFiles.map((envFile, index) =>
        limit(() => workerHandler(envFile, index, dotenvFilesLength))
      )
    );
    compressAll();
  } catch (error) {
    errors.push({ msg: `<----- build error: ${error} ----->` });
  } finally {
    const minutes = (Date.now() - startTime) / 1000 / 60;
    console.log(
      chalk.green(
        `\n<---------------所有项目打包完成，总耗时${minutes}分钟--------------->`
      )
    );
    if (errors.length > 0) {
      console.log(
        chalk.yellow("\n-----------------ERROR---------------------")
      );
      console.table(
        errors.map((data) => {
          return { companyName: data.companyName };
        })
      );
      errors.forEach((err, index) =>
        console.log(chalk.red(`\n${index}: ${err.msg}`))
      );
      console.log(
        chalk.yellow("\n-----------------ERROR END-----------------")
      );
    }
  }
};

buildHandler();
