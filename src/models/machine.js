const { query } = require("../utils/dynamodb");

async function getMachines(prefix = undefined, lineWaterCompatible = undefined) {
  let filterExpression = "",
    keyConditionExpression = "#pkey = :pVal",
    expressionAttributeNames = {
      "#pkey": "PK",
    },
    expressionAttributeValues = {
      ":pVal": "MACHINES",
    };
  let tableInfo = {
    TableName: process.env.PRODUCTS_TABLE,
  };

  if (lineWaterCompatible !== undefined) {
    expressionAttributeNames["#f1key"] = "lineWaterCompatible";
    expressionAttributeValues[":f1Val"] = lineWaterCompatible;
    filterExpression = "#f1key = :f1Val";
    tableInfo["FilterExpression"] = filterExpression;
  }

  if (prefix !== undefined) {
    expressionAttributeNames["#skey"] = "SK";
    expressionAttributeValues[":sVal"] = prefix;
    keyConditionExpression += " AND begins_with(#skey, :sVal)";
  }

  return await query({
    ...tableInfo,
    KeyConditionExpression: keyConditionExpression,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
  });
}

module.exports.getMachines = getMachines;
