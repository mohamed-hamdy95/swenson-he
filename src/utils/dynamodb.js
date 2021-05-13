const AWS = require("aws-sdk");

AWS.config.update({
  region: process.env.SERVICE_REGION,
});

const docClient = new AWS.DynamoDB.DocumentClient();

async function query(tableInfo) {
  let queryResults = [];
  let items;
  do {
    items = await docClient.query(tableInfo).promise();
    queryResults = queryResults.concat(items.Items);
    tableInfo.ExclusiveStartKey = items.LastEvaluatedKey;
  } while (typeof items.LastEvaluatedKey != "undefined");
  return queryResults;
}

async function put(tableInfo) {
  return await docClient.put(tableInfo).promise();
}

module.exports.query = query;
module.exports.put = put;
