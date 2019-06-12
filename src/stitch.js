const fs = require("fs-extra");
const _ = require("lodash");

module.exports = {
  /**
   *
   * @param {String} dir
   * @returns {Promise<Object>}
   */
  createStitchedDefinition: async function(dir) {
    const path = `${process.cwd()}/${dir}`;

    let definition = await this.readDefinition(path);

    await this.stitchDefinitions(path, definition);

    return definition;
  },

  stitchDefinitions: async function(path, definition) {
    let dirs;
    try {
      dirs = await fs.readdir(path);
    } catch (err) {
      return;
    }

    await Promise.all(
      _(dirs)
        .map(async file => {
          try {
            definition.steps.push(
              ...(await this.readDefinition(`${path}/${file}`)).steps
            );
          } catch (err) {
            // nada
          }
        })
        .value()
    );
  },

  /**
   * @param {string} path
   * @returns {Promise<Object>}
   */
  readDefinition: async function(path) {
    let definition = JSON.parse(
      await fs.readFile(`${path}/definition.json`, "utf8")
    );
    await this.inlineDefinitionResources(definition, path);

    return definition;
  },

  /**
   *
   * @param {Object} definition
   * @param {Object} definition.preflight
   * @param {Object} definition.required_input
   * @param {Object[]} definition.steps
   * @param {string} definition.steps[].name
   * @param {Object} definition.steps[].function
   * @param {string} path
   * @returns {Promise<void>}
   */
  inlineDefinitionResources: async function(definition, path) {
    if (definition.preflight) {
      await this.inlineNodeResources(definition.preflight, path);
    }
    if (definition.required_input) {
      await this.inlineNodeResources(definition, path);
    }

    await Promise.all(
      definition.steps.map(async step => {
        return await this.inlineNodeResources(step, path, step.name);
      })
    );
  },

  inlineNodeResources: async function(node, path, name) {
    if (node) {
      try {
        const code = await fs.readFile(
          `${path}/code/${name || "preflight"}.js`,
          "utf8"
        );
        node.function.code = Buffer.from(code).toString("base64");
      } catch (err) {
        // nada
      }
    }

    const formDefinitionPath = "required_input.form.definition";
    if (_.has(node, formDefinitionPath)) {
      const formDefinition = _.get(node, formDefinitionPath);
      if (_.isEmpty(formDefinition)) {
        try {
          const externalForm = await fs.readFile(
            `${path}/form/${name || "initial"}.json`,
            "utf8"
          );
          _.set(node, formDefinitionPath, JSON.parse(externalForm));
        } catch (err) {
          // nada
        }
      }
    }
  }
};
