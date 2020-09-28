/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import NodeHelper from "@robbie-cook/node-helper";

export default class BranchTools {
  /**
   * Remove git branches
   */
  static removeBranches = async (branches: Array<string>) => {
    // Remove local branches
    for (const branch of branches) {
      console.log(`Removing ${branch}...`);
      try {
        await NodeHelper.execute(`git branch -d ${branch}`);
      } catch (err) {
        console.error(err);
      }
      console.log(`${branch} deleted`);
    }

    console.log("Done!\n");
  };

  /**
   * Main script
   */
  static cleanBranches() {
    NodeHelper.execute("git branch --merged master").then(async (value) => {
      // Split the branches into a list
      const unprocessedBranchList = value.replace(/[\n]/g, "").split(" ");
      // Careful with this! Do not include production in the output!
      const processedBranchList = unprocessedBranchList.filter(
        (val) => val && val !== "master" && val !== "production"
      );

      console.log("\nMerged branches:\n");
      if (processedBranchList.length === 0) {
        console.log("None! Your branches are clean\n");
        return;
      }
      processedBranchList.forEach((branch) => console.log(branch));

      const remove = await NodeHelper.input(
        "\nWould you like to remove these branches? [y/N]:"
      );
      if (!NodeHelper.isAnswerYes(remove)) {
        return;
      }

      await this.removeBranches(processedBranchList);
    });
  }
}
