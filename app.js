#!/usr/bin/env node

const commander = require("commander");
const packageJson = require("./package.json");
const stitch = require("./src/stitch");
const printer = require("./src/printer");

commander.version(packageJson.version);

commander
  .description("Stitch em")
  .action(run.bind({}, commandStitch))
  .option("-i, --insomnia", "Escape for use in insomnia")
  .option("-f, --file", "Write to file instead of printing to stdout")
  .arguments("<dir>");

commander.parse(process.argv);

if (!process.argv.slice(2).length) {
  commander.outputHelp();
}

/**
 * Top level promise wrapper
 *
 * @param action function to run
 * @param args
 */
function run(action, ...args) {
  Promise.resolve(action(...args)).catch(console.log);
}

/**
 * @param {string} path
 * @param {Object} cmd
 * @param {undefined|Boolean} cmd.insomnia
 * @param {undefined|Boolean} cmd.file
 * @returns {Promise<void>}
 */
async function commandStitch(path, cmd) {
  const dirs = path
    ? [path]
    : await stitch.findDirsToStitch();

  if (cmd.insomnia) {
    printer.insomnia = true;
  }

  await Promise.all(
    dirs.map(async dir => {
      const definition = await stitch.createStitchedDefinition(dir);

      printer.output(definition);
    })
  );
}
