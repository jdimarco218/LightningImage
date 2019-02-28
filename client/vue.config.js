const path = require('path');
const port = process.env.VUE_APP_SERVER_PORT || 8082;
const host = process.env.VUE_APP_SERVER_HOST || "69.141.47.76";

module.exports = {
    outputDir: path.resolve(__dirname, '../server/public'),
    devServer: {
        proxy: {
            '/api': {
                target: `http://${host}:${port}`
            }
        }
    }
}