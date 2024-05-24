const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let database;

async function connect() {
    const client = await MongoClient.connect('mongodb://localhost:27017');
    database = client.db('community');
}

function getDb() {
    if (!database) {
        throw { message: "데이터베이스가 연결되지 않았습니다." };
    }

    return database;
}

module.exports = {
    connect: connect,
    getDb: getDb
};