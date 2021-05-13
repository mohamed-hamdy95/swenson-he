"use strict";
const { v4: uuidv4 } = require("uuid");
const data = require("../data.json");
const { getMachines } = require("../models/machine");
const { getPods } = require("../models/pod");
const { generateCreatedAt } = require("../utils/date-fns");
const { put } = require("../utils/dynamodb");

module.exports.handler = async (event, context, callback) => {
  // const {producType} = event.queryStringParameters;

  const { machines, pods } = data;

  const checkPodsEmptyState = (await getPods()).length === 0;
  const checkMachinesEmptyState = (await getMachines()).length === 0;

  if (checkPodsEmptyState) {
    await Promise.all(
      pods.map(async (pod) => {
        const { productType } = pod;
        const sk = `${productType}#${uuidv4()}`;
        const tableInfo = {
          TableName: process.env.PRODUCTS_TABLE,
          Item: { ...pod, SK: sk, createdAt: generateCreatedAt() },
        };
        await put(tableInfo);
      })
    );
  }

  if (checkMachinesEmptyState) {
    await Promise.all(
      machines.map(async (machine) => {
        const { productType } = machine;
        const sk = `${productType}#${uuidv4()}`;
        const tableInfo = {
          TableName: process.env.PRODUCTS_TABLE,
          Item: { ...machine, SK: sk, createdAt: generateCreatedAt() },
        };
        await put(tableInfo);
      })
    );
  }

  callback(null, {
    statusCode: 200,
    body: JSON.stringify({
      message: checkMachinesEmptyState || checkPodsEmptyState ? "Data Seeded Successfully" : "Data Already Seeded Before",
    }),
  });
};
