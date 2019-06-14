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
   * @param {String} fileName
   * @param {Object} output
   * @returns {Promise<void>}
   */
  write: async function(dir, fileName, output) {
    // Ensure dir (ok if already exists)
    try {
      await fs.mkdirp(dir);
    } catch (err) {
    }

    try {
      await fs.writeFile(`${dir}/${fileName}`, output, {
        flag: "w"
      });
    } catch (err) {
      console.error(err);
    }
  },
};