#!/usr/bin/env node

const commander = require("commander");
const packageJson = require("./package.json");
const stitch = require("./src/stitch");
const printer = require("./src/printer");

commander.version(packageJson.version);

commander.command('import').
    description('Import an already exported definition to be expanded').
    action(run.bind({}, commandImport)).
    arguments('<definition>').
    arguments('<path>');

commander.command('export').
    description('Export a definition to be weaved together').
    action(run.bind({}, commandExport)).
    option('-i, --insomnia', 'Escape for use in insomnia').
    arguments('<dir>');

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
 * @param {string} definition
 * @param {string} path
 * @returns {Promise<void>}
 */
async function commandImport(definition, path) {
  await stitch.createExpandedDefinition(JSON.parse(definition), path);
}

/**
 * @param {string} path
 * @param {Object} cmd
 * @param {undefined|Boolean} cmd.insomnia
 * @returns {Promise<void>}
 */
async function commandExport(path, cmd) {
  printer.insomnia = cmd.insomnia || false;

  printer.output(
      await stitch.createStitchedDefinition(path),
  );
}
