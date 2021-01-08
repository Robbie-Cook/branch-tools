#!/usr/bin/env node

import BranchTools from "../BranchTools";
import Enquirer from "enquirer";
import { Command } from 'commander';
const program = new Command();

import updateNotifier from "update-notifier";
import pkg from "../../package.json";
import meow from "meow";

updateNotifier({ pkg }).notify();


const Commands = {
  cleanBranches: {
    command: 'clean',
    short_description: "clean branches",
  },
  syncRepos: {
    command: 'sync',
    short_description: "sync repos",
    flags: {
      "switch-branch": {
        type: "string",
        alias: "s",
      },
    },
  },
  help: {
    command: 'help',
  }
} as Record<string, any>;

for (const [key, value] of Object.entries(Commands)) {
  program.option(value.command, (value as any).short_description ?? "");

  if (value.flags) {
    for (const [k, data] of Object.entries((value as Record<string, any>).flags)) {
      if ((data as any).command) {
        program.option((data as any).command, (value as any).short_description ?? "");
      }
    }
  }
}
program.parse(process.argv);

type valueof<T> = T[keyof T];

/**
 * Main CLI entry function
 */
async function run() {
  // If action specified on the command line, run it
    if (program.sync) {
      await BranchTools.syncRepos(program.sync);
    } else if (program.clean) {
      await BranchTools.cleanBranches();
    } else {
    // Prompt user for action
    const response: {
      option: valueof<typeof Commands>;
    } = await Enquirer.prompt({
      type: "select",
      name: "option",
      message: "What would you like to do?",
      choices: [Commands.cleanBranches.short_description, Commands.syncRepos.short_description],
    });

    if (response.option === Commands.cleanBranches.short_description) {
      await BranchTools.cleanBranches();
    } else if (response.option === Commands.syncRepos.short_description) {
      await BranchTools.syncRepos(program.switchBranch);
    }
  }
}

run();
