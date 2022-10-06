const http = require('http');
//http闈內建物建，不用加./
//在node官網查看http語法們
const server = http.createServer((request, response) => {
    response.writeHead(200, {
        'Content-Type': 'text/html'
    });
    //writeHead定義response.end的類型
    response.end(`<h2>${request.url}</h2>`);
    //輸出網址名稱 http://localhost:3000/123456
    //  response.end('<h2>ABC</h2>');
});
server.listen(3000);
//往輸入localhost:3000可查看response的內容
//不要用1024以下port，通常用3000/5000
//安裝nodemon監測程式碼，只要有修改就會自動偵測重啟sever，不用再到終端機手動啟動