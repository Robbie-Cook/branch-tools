#!/usr/bin/env node

import BranchTools from "../BranchTools";
import Enquirer from "enquirer";

const Direction = {
  cleanBranches: "clean branches",
};

type valueof<T> = T[keyof T];

/**
 * Main CLI entry function
 */
async function run() {
  const response: {
    option: valueof<typeof Direction>;
  } = await Enquirer.prompt({
    type: "select",
    name: "option",
    message: "What would you like to do?",
    choices: [Direction.cleanBranches],
  });

  if (response.option === Direction.cleanBranches) {
    BranchTools.cleanBranches();
  }
}

run();
