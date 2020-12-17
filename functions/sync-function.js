'use strict';

const VAR = process.env.MY_VAR_1;

module.exports.handler = async event => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: `Hello my sync function. Variable: ${VAR}. Actual date: ${new Date()}`
      }
    )
  };
};
