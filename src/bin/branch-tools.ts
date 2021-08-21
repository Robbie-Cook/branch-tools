#!/usr/bin/env node

import BranchTools from "../BranchTools";
import Enquirer from "enquirer";

import updateNotifier from "update-notifier";
import pkg from "../../package.json";
import meow from "meow";

updateNotifier({ pkg }).notify();

const Option = {
  cleanBranches: "clean branches",
  syncRepos: "sync repos",
};

type valueof<T> = T[keyof T];

/**
 * Main CLI entry function
 */
async function run() {
  const cli = meow(
    `
  Usage
  $ npx branch-tools <sync|clean>

  Options
    --switch-branch, -s  Switch branch on sync

  Examples
    $ npx branch-tools sync
  `,
    {
      flags: {
        "switch-branch": {
          type: "string",
          alias: "s",
        },
      },
    }
  );
  // If action specified on the command line, run it
  if (cli.input?.length > 0) {
    if (cli.input.includes("sync")) {
      // See https://github.com/sindresorhus/meow/issues/138 and slap them.
      // @ts-ignore
      await BranchTools.syncRepos(cli.flags.switchBranch);
    } else if (cli.input.includes("clean")) {
      await BranchTools.cleanBranches();
    }
  } else {
    // Prompt user for action
    const response: {
      option: valueof<typeof Option>;
    } = await Enquirer.prompt({
      type: "select",
      name: "option",
      message: "What would you like to do?",
      choices: [Option.cleanBranches, Option.syncRepos],
    });

    if (response.option === Option.cleanBranches) {
      await BranchTools.cleanBranches();
    } else if (response.option === Option.syncRepos) {
      await BranchTools.syncRepos(cli.flags["switch-branch"]);
    }
  }
}

run();
