"use strict";
const { getPods } = require("../../models/pod");

module.exports.handler = async (event, context, callback) => {
  const { queryStringParameters = {} } = event;
  const { productType, coffeeFlavor, packSize } = queryStringParameters ? queryStringParameters : {};
  const pods = await getPods(productType, coffeeFlavor, parseInt(packSize));

  callback(null, {
    statusCode: 200,
    body: JSON.stringify({
      pods,
    }),
  });
};
