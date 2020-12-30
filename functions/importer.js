const util = require('util');
const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME;
const s3 = new AWS.S3();

exports.handler = async (event, context, callback) => {
    console.log("Recived books dump");
    console.log("Event content:\n", util.inspect(event, {depth: 5}));
    const srcBucket = event.Records[0].s3.bucket.name;
    const srcKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));
    const extension = srcKey.substr(srcKey.lastIndexOf('.'));

    if (extension == ".json") {
        console.log(`Extension of file is valid`)
        try {
            const s3Params = {
                Bucket: srcBucket,
                Key: srcKey
            };
            const s3Resp = await s3.getObject(s3Params).promise();
            const booksDump = s3Resp.Body.toString();
            const books = JSON.parse(booksDump);

            books.forEach(function(book) {
                console.log(`Import contain book to save: ${JSON.stringify(book)}`);
                saveBook(book.bookId, book.bookName, book.author)
            });
            console.log(`Book imports finish with success`);
        } catch (exc) {
            console.log(`Book imports fail. Exception: ${exc}`);
            return;
        }  
    } else {
        throw new Error('Extension of file is invalid');
    }
};

async function saveBook(id, bookName, author) {

    var params = {
        TableName : TABLE_NAME,
        Key: {
            bookId: id
        },
        UpdateExpression : 'set #bName = :bookName, #a = :author',
        ExpressionAttributeNames: { '#bName' : 'bookName', '#a' : 'author' },
        ExpressionAttributeValues : { ':bookName' : bookName, ':author' : author},
        ReturnValues: "ALL_NEW"
    };

    try {
        await dynamoDb.update(params).promise();
    } catch (exc) {
        console.log(`Error while saving book with id ${id}. Exception: ${exc}`);
    }
}