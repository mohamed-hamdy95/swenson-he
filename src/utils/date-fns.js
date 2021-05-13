const { format } = require("date-fns");

function generateCreatedAt() {
  return format(new Date(), "yyyy-MM-dd HH:mm:ss");
}

module.exports.generateCreatedAt = generateCreatedAt;
