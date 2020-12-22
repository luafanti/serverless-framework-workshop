const bodyParser = require('body-parser');
const express = require('express');
const AWS = require('aws-sdk');
const serverless = require('serverless-http');
const moment = require('moment');

const TABLE_NAME = process.env.TABLE_NAME;
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const app = express();

app.use(bodyParser.json({ strict: false }));

app.delete('/books/:bookId', async function (req, res) {

    const params = {
        TableName: TABLE_NAME,
        Key: {
            bookId: req.params.bookId
        }
    };

    try {
        await dynamoDb.delete(params).promise();
        res.json(`Book was deleted. Time ${moment().format()}`).status(200);
    } catch (e) {
        console.log(e);
        res.status(400).json({ error: `Can't delete book`});
    }
});

module.exports.handler = serverless(app);