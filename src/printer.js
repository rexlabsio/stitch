const fs = require("fs-extra");

module.exports = {
  /**
   * Escape values to be compatible with insomnia
   */
  insomnia: false,

  /**
   * Get definition as string
   *
   * @param {Object} definition
   * @returns {string}
   */
  getText: function(definition) {
    let text = JSON.stringify(definition, null, 2);
    if (this.insomnia) {
      text = text.replace(/({{\s*\$?(?:\.\w+)+\s*}})/g, (_, match) => {
        return `{% raw %}${match}{% endraw %}`;
      });
    }
    return text;
  },

  /**
   * Output to stdout
   *
   * @param {Object} definition
   */
  output: function(definition) {
    console.log(this.getText(definition));
  },

  /**
   * Write to file
   *
   * @param {String} dir
   * @param {Object} definition
   * @returns {Promise<void>}
   */
  write: async function(dir, definition) {
    // Ensure dir (ok if already exists)
    try {
      await fs.mkdirp(`${process.cwd()}/gen/${dir}`);
    } catch (err) {
    }

    try {
      await fs.writeFile(`${process.cwd()}/gen/${dir}/definition.json`, this.getText(definition), {
        flag: "w"
      });
    } catch (err) {
      console.error(err);
    }
  },
};