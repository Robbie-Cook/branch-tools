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

  private static async pull(file: string, branch?: string): Promise<string | undefined> {
    if (branch) {
      console.log(`Switching branch to '${branch}'`)
      return NodeExtended.execute(`(cd ${file} && git checkout ${branch})`);
    }
    if (isGitRepo(file)) {
      return NodeExtended.execute(`(cd ${file} && git pull)`);
    }
  }

  /**
   * Sync all repos
   */
  static syncRepos = async (branch?: string) => {
    const files = fs.readdirSync(".");

    const tasks = files
      .filter((file) => isGitRepo(file))
      .map((file) => ({
        title: `Fetching ${file}...`,
        task: async () => {

          await BranchTools.pull(file, branch);
        },
      }));

    const listrTasks = new Listr(tasks, { concurrent: 10, renderer: "verbose" });
    await listrTasks.run();
  };

  /**
   *
   * Main script
   */
  static async cleanBranches() {
    // TODO: remove 'then'
    NodeExtended.execute("git branch --merged master").then(async (value) => {
      // Split the branches into a list
      const unprocessedBranchList = value.replace(/[\n]/g, "").split(" ");
      // Careful with this! Do not include production in the output!
      const processedBranchList = unprocessedBranchList.filter(
        (val) =>
          val &&
          !val.match(/master/g) &&
          !val.match(/production/g) &&
          val !== "*"
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
    });
  }
}
