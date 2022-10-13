require('dotenv').config();
//1011新增
//dotenv呼叫.env

//npm i express 安裝express
//引入express
const express = require('express');
//建立web sever物件
const app = express();
app.set('view engine', 'ejs');
//設定EJS

//Multer檔案上傳
// const multer =require('multer');
// const upload = multer({dest:'tmp_uploads/'});
const fs = require('fs').promises;

//uploads-img引入
const uploads = require(__dirname + '/modules/upload-img');

app.use(express.static(__dirname + '/public'));
app.use(express.static('node_modules/bootstrap/dist'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//路徑模組化
app.use('/abc',require(__dirname+'/routes/admin2'));
// /abc先給相對路徑，網址列上就要打http://localhost:3001/abc/bb/aaa/50
//若沒給相對路徑，就是在根目錄


//設定路由
//注意路由寫的順序，express的路由不會檢查有沒有重複，所以設在前面的會先讀取執行
app.get('/', function (req, res) {
    // res.send('Hi Hi');

    //連main檔案
    res.render('main', { name: 'pei' });
});

app.get('/abc', function (req, res) {
    res.send('abc');
});
app.get('/json-test', (req, res) => {
    res.json({ name: 'Amy', age: 30 });
    //Headers>Content-Type: application/json; charset=utf-8

    //res.send({name:'Amy',age:30});
    // res.json和res.send不要重複設定

})
app.get('/send-test', (req, res) => {
    const data = require(__dirname + '/data/sales');
    res.json(data);
})
app.get('/sales-json', (req, res) => {
    const sales = require(__dirname + '/data/sales');
    res.render('sales-json', { sales });

})

//使用變數設定路由
app.get('/my-params1/:action?/:id?', async (req, res) => {
    res.json(req.params);
});

//使用regular expression設定路由
app.get(/^\/m\/09\d{2}-?\d{3}-?\d{3}$/i, (req, res) => {
    let u = req.url.slice(3);
    u = u.split('?')[0]; // 用?去掉 query string
    u = u.split('-').join(''); //加入空字串
    res.json({ mobile: u });
});
//  \/跳脫字元

// const urlencodedParser = express.urlencoded({extended:false});
//放到前面設成middleware， 把urlencodedParser,


app.post('/try-post', (req, res) => {
    res.json(req.body);
})
app.get('/try-post-form', (req, res) => {
    res.render('try-post-form');
})
app.post('/try-post-form', (req, res) => {
    res.render('try-post-form', req.body);
})

//Multer
app.post('/try-uploads', uploads.single('avatar'), async (req, res) => {
    //uuidv4上傳
    res.json(req.file);


    /*Multer上傳
    if (req.file && req.file.originalname){
        await fs.rename(req.file.path,`public/img/${ req.file.originalname}`);
        res.json(req.file);
    }else{
        res.json({msg: '上傳失敗'})
    }
    */
})
app.post('/try-uploads2', uploads.array('photos'), async (req, res) => {
    res.json(req.files);
    //上傳多個檔案

})




app.use((req, res) => {
    // res.type('text/plain');
    //靜態內容通常放在public或state資料夾  
    res.status(404);
    //res.send('<h2>找不到網頁</h2>');
    //('text/plain');為純文字，所以res.send()裡面不能包含HTML標籤，若要有HTML標籤就不要寫type，預設就有含HTML
    //靜態內容不要設太多，會影響讀取速度

    //引入404圖片
    res.render('404');
});

const port = process.env.SERVER_PORT || 3002

//res.send('Hi Hi');通常設定為字串
//server偵聽
app.listen(
    port, function () {
        console.log(`啟動server偵聽户號${port}`);
    }
)