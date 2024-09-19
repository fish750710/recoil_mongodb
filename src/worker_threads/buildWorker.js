// buildWorker.js
const { parentPort, workerData } = require("worker_threads");
const childProcess = require("child_process");
const compressing = require("compressing");

async function build(project) {
  try {
    console.log(`-----------------开始打包${project}-----------------`);
    process.env.PROJECT_CONFIG_PATH = project;

    childProcess.execSync("npm run build");

    await compressing.zip.compressDir(
      `./build/${project}`,
      `./build/${project}.zip`
    );
  } catch (error) {
    console.error(error);
  } finally {
    parentPort.postMessage(`Finished ${project}`);
  }
}

build(workerData.project);
