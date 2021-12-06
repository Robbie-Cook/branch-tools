/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import NodeExtended from "node-extended";
import { prompt } from "enquirer";
import fs from "fs";
import asyncPool from "tiny-async-pool";
import Listr from "listr";

/**
 * Filter non-git repos
 */

function isGitRepo(path: string): boolean {
  if (fs.lstatSync(path).isDirectory() && path !== "node_modules") {
    const subfiles = fs.readdirSync(path);
    if (subfiles.includes(".git")) {
      return true;
    }
  }
  return false;
}

export default class BranchTools {
  /**
   * Remove git branches
   */
  static removeBranches = async (branches: Array<string>) => {
    // Remove local branches
    for (const branch of branches) {
      console.log(`Removing ${branch}...`);
      try {
        await NodeExtended.execute(`git branch -d ${branch}`);
      } catch (err) {
        console.error(err);
      }
      console.log(`${branch} deleted`);
    }

    console.log("Done!\n");
  };

  /**
   * Git pull a directory
   */

  private static async pull(
    file: string,
    branch?: string
  ): Promise<string | undefined> {
    if (branch) {
      const branchExists = await (
        await NodeExtended.execute(
          `(cd ${file} && git branch --list ${branch})`
        )
      )
        .toString()
        .includes(branch);

      if (!branchExists) {
        console.log(`${branch} does not exist on ${file}. Continuing.`);
        return;
      }

      console.log(`Switching branch to '${branch}'`);
      await NodeExtended.execute(`(cd ${file} && git checkout ${branch})`);
    }

    if (isGitRepo(file)) {
      console.log(`Pulling ${file}@${branch}`);
      return NodeExtended.execute(`(cd ${file} && git pull)`);
    }
  }

  /**
   * Sync all repos
   */
  static syncRepos = async (branch?: string, runSynchronously = true) => {
    const files = fs.readdirSync(".");

    const filteredSubrepos = files.filter((file) => isGitRepo(file));
    if (filteredSubrepos?.length > 0) {
      const tasks = filteredSubrepos.map((file) => ({
        title: `Fetching ${file}...`,
        task: async () => {
          try {
            await BranchTools.pull(file, branch);
            console.log(`Fetching '${branch}' completed`);
          } catch (e) {
            console.error(`There was a problem pulling '${file}:'`);
            console.error(e);
          }
        },
      }));

      if (runSynchronously) {
        for (const task of tasks) {
          console.log(task.title);
          await task.task();
          console.log("\n");
        }
      }
      // else {
      //   const listrTasks = new Listr(tasks, {
      //     concurrent: 10,
      //     renderer: "default",
      //   });
      //   await listrTasks.run();
      // }
    } else {
      console.log(
        "No direct subrepos found. Are you sure you are running this command from the right directory?"
      );
    }
  };

  /**
   *
   * Main script
   */
  static async cleanBranches(allBranches = false) {
    const value = allBranches
      ? await NodeExtended.execute("git branch")
      : await NodeExtended.execute("git branch --merged master");

    // Split the branches into a list
    const unprocessedBranchList = value.replace(/[\n]/g, "").split(" ");
    // Careful with this! Do not include production in the output!
    const processedBranchList = unprocessedBranchList.filter(
      (val) =>
        val && !val.match(/master/g) && !val.match(/production/g) && val !== "*"
    );

    if (processedBranchList.length === 0) {
      console.log("Nothing to do! Your branches are clean\n");
      return;
    }
    console.log("\nMerged branches:\n");

    // processedBranchList.forEach((branch) => console.log(branch));

    const branches = await prompt<{ value: Array<string> }>({
      name: "value",
      message: "Pick branches to delete",
      type: "multiselect",
      choices: processedBranchList.map((item) => ({
        name: item,
        value: item,
      })),
    });

    const remove = await NodeExtended.input("\nAre you sure? [y/N]:");
    if (!NodeExtended.isAnswerYes(remove)) {
      return;
    }

    await this.removeBranches(branches.value);
  }
}
