import { resolve } from 'path';

const config = {
    mongodb: 'mongodb://127.0.0.1:27020/newsCms',
    jwt: {
        secret: 'shsh'
    }
}

// Config for log4js.
const logConfig = {
    appenders: [{
        "type": "dateFile",
        "filename": resolve(__dirname, "../../logs/server.log"),
        "pattern": "-yyyy-MM-dd.log",
        "category": "server"
    }, {
        "type": "dateFile",
        "filename": resolve(__dirname, "../../logs/mongodb.log"),
        "pattern": "-yyyy-MM-dd.log",
        "category": "mongodb"
    }]
}

export {config, logConfig}