const dayjs = require('dayjs')

const logger = (req, res, next) => {
    console.log(`${dayjs()}: ${req.protocol}://${req.get('host')}${req.originalUrl}`);
    next();
}

module.exports = logger