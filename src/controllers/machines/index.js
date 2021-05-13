"use strict";
const { getMachines } = require("../../models/machine");

module.exports.handler = async (event, context, callback) => {
  const { queryStringParameters } = event;
  const { productType, lineWaterCompatible } = queryStringParameters ? queryStringParameters : {};
  const machines = await getMachines(productType, lineWaterCompatible ? lineWaterCompatible === "true" : lineWaterCompatible);

  callback(null, {
    statusCode: 200,
    body: JSON.stringify({
      machines,
    }),
  });
};
