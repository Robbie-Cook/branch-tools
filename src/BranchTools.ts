/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import NodeExtended from "node-extended";
import { prompt } from "enquirer";

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
