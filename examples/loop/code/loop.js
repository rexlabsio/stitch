const _ = require("lodash");

/**
 * @param {Object} context
 * @returns {Object}
 */
module.exports = function(context) {
  return {
    should_loop: _.get(context, "state.meta.steps.loop.loop_index", 0) < 3
  };
};
