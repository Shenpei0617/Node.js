const http = require('http');
//讀入檔案.promises寫法
const fs = require('fs').promises;

const server = http.createServer((req, res) => {
    fs.writeFile(__dirname + '/headers.text', JSON.stringify(req.headers))
        .then(data => {
            console.log({ data });
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            res.end(`<h2>${req.url}</h2>`);
        })

});
server.listen(3000);
