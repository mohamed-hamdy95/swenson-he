const { query } = require("../utils/dynamodb");

async function getPods(prefix = undefined, coffeeFlavor = undefined, packSize = undefined) {
  let filterExpression = "",
    keyConditionExpression = "#pkey = :pVal",
    expressionAttributeNames = {
      "#pkey": "PK",
    },
    expressionAttributeValues = {
      ":pVal": "PODS",
    };
  let tableInfo = {
    TableName: process.env.PRODUCTS_TABLE,
  };

  if (coffeeFlavor !== undefined) {
    expressionAttributeNames["#f1key"] = "coffeeFlavor";
    expressionAttributeValues[":f1Val"] = coffeeFlavor;
    filterExpression = "#f1key = :f1Val";
    tableInfo["FilterExpression"] = filterExpression;
  }

  if (packSize !== undefined) {
    expressionAttributeNames["#f2key"] = "packSize";
    expressionAttributeValues[":f2Val"] = packSize;
    if (!filterExpression) {
      filterExpression = "#f2key = :f2Val";
    } else {
      filterExpression += " AND #f2key = :f2Val";
    }
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

module.exports.getPods = getPods;
