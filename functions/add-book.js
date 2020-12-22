const bodyParser = require('body-parser');
const express = require('express');
const AWS = require('aws-sdk');
const serverless = require('serverless-http');
const moment = require('moment');

const TABLE_NAME = process.env.TABLE_NAME;
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const app = express();

app.use(bodyParser.json({ strict: false }));


app.post('/books', async function (req, res) {

    const { bookId, bookName, author } = req.body;
    const params = {
        TableName: TABLE_NAME,
        Item: {
            bookId: bookId,
            bookName: bookName,
            author: author
        }
    };

    try {
        await dynamoDb.put(params).promise();
        res.json(`Book was added. Time: ${moment().format()}`).status(201);
    } catch (e) {
        console.log(e);
        res.status(400).json({ error: `Can't add a book`});
    }
});

module.exports.handler = serverless(app);