const bodyParser = require('body-parser');
const express = require('express');
const AWS = require('aws-sdk');
const serverless = require('serverless-http');

const TABLE_NAME = process.env.TABLE_NAME;
const app = express();
const dynamoDb = new AWS.DynamoDB.DocumentClient();

app.use(bodyParser.json({ strict: false }));

app.put('/books/:bookId', async function (req, res) {

    const { bookName, author } = req.body;
    var params = {
        TableName : TABLE_NAME,
        Key: {
            bookId: req.params.bookId
        },
        UpdateExpression : 'set #bName = :bookName, #a = :author',
        ExpressionAttributeNames: { '#bName' : 'bookName', '#a' : 'author' },
        ExpressionAttributeValues : { ':bookName' : bookName, ':author' : author},
        ReturnValues: "ALL_NEW"
    };

    try {
        await dynamoDb.update(params).promise();
        res.json('Book was updated').status(200);
    } catch (e) {
        console.log(e);
        res.status(400).json({ error: `Can't update book` });
    }
});

module.exports.handler = serverless(app);