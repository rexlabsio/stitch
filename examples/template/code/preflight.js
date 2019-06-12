const _ = require("lodash");

module.exports = async function(context) {
  const { initial } = context;

  const something = _.get(initial, "post.something", null);

  return !!something;
};
