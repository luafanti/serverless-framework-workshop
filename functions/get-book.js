const bodyParser = require('body-parser');
const express = require('express');
const AWS = require('aws-sdk');
const serverless = require('serverless-http');

const TABLE_NAME = process.env.TABLE_NAME;

const app = express();
const dynamoDb = new AWS.DynamoDB.DocumentClient();

app.get('/books', async function (req, res) {

    const params = {
        TableName: TABLE_NAME
    };

    try {
        const result = await dynamoDb.scan(params).promise();
        res.json(result.Items).status(200);
    } catch (e) {
        console.log(e);
        res.status(400).json({ error: `Can't get books`});
    }
});

module.exports.handler = serverless(app);