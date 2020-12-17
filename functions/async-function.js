'use strict';

const VAR1 = process.env.MY_VAR_1;
const VAR2 = process.env.MY_VAR_2;

module.exports.handler = async event => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: `Hello my async function. Variable: ${VAR1} & ${VAR2}. Actual date: ${new Date()}`
      }
    )
  };
};
