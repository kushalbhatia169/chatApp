const uuid = require("uuid"),

getUniqueId = () => {
    const uniqueId = uuid.v4();
    return uniqueId;
  };
  
module.exports = getUniqueId;