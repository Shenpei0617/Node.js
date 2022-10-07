//npm i express 安裝express
//引入express
const express = require('express');
//建立web sever物件
const app = express();

//設定路由
app.get('/', function (req, res) {
    res.send('Hi Hi');
});
//res.send('Hi Hi');通常設定為字串
//server偵聽
app.listen(
    3000, function () {
        console.log('啟動server偵聽户號3000');
    }
)