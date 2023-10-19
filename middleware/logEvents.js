// console.log('Here we go. I am hungry');

const {format} = require('date-fns')  // for data npm
const {v4:uuid} = require('uuid');

const fs = require('fs');
const fsPromises  = require('fs').promises;
const path = require('path');

const logEvents = async(message, logName) => {
    // console.log(logName);
    const dateTime = `${format(new Date(), 'yyyy-MM-dd\tHH:mm:ss')}`;
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
    // console.log(logItem);

    try{
        if(!fs.existsSync(path.join(__dirname, '..', 'logs'))){
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'));
        }
        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logName), logItem)

        // testing
    }catch(error){
        // console.log(error)
    }

}

const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt')
    console.log(`${req.method} ${req.path}`);
    next()
}

module.exports = {logger, logEvents};


// console.log(format(new Date(), "'Today is' eeee"));           //Today is a Wednesday
// console.log(format(new Date(), "yyyy-MM-dd\tHH:mm:ss"));        //2023-10-04      14:54:54
// console.log(uuid());


