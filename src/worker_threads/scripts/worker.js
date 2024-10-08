import { workerData, parentPort } from "worker_threads";
import { exec } from "child_process";
import dotenv from "dotenv";

const nxBuild = async (data) => {
  const envFileName = data.envFileName;
  dotenv.config({ path: data.envFilePath });
  exec(
    `npx nx build aifa --mode ${envFileName} --skip-nx-cache`,
    (error, stdout, stderr) => {
      if (error) {
        parentPort.postMessage({
          companyName: envFileName,
          message: `Build failed for mode ${envFileName}`,
          error: error.message,
          code: error.code,
          stderr: stderr ? stderr.toString() : "No stderr output",
        });
      }
    }
  );
};
nxBuild(workerData);
