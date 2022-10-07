const http = require('http');
//讀入檔案async await
const fs = require('fs').promises;

const server = http.createServer(async(req, res) => {
    await fs.writeFile(__dirname + '/headers.text', JSON.stringify(req.headers))
        .then(data => {
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            res.end(`<h2>${req.url}</h2>`);
        })

});
server.listen(3000);
