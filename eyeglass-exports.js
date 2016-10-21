var doggystyle = require("./index");

module.exports = function(eyeglass, sass) {
  return {
    sassDir: doggystyle.includePaths[0]
  };
};
