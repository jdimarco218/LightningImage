const path = require('path');
const port = process.env.SERVER_PORT || 8082;

module.exports = {
    outputDir: path.resolve(__dirname, '../server/public'),
    devServer: {
        proxy: {
            '/api': {
                target: `http://localhost:${port}`
            }
        }
    }
}