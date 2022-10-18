require('dotenv').config();
//1011新增
//dotenv呼叫.env
// ----1014session
const session = require('express-session');
const moment = require('moment-timezone');
const MysqlStore = require('express-mysql-session')(session);
const db = require(__dirname + '/modules/db_connect2');
const sessionStore = new MysqlStore({}, db);
const cors = require('cors');
const axios = require('axios');

//npm i express 安裝express
//引入express
const express = require('express');
const db_connect2 = require('./modules/db_connect2');
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


// 1018使用cors
const corsOptions = {
    credentials: true,
    origin: function (origin, callback) {
        console.log({ origin });
        callback(null, true);
    }
}

app.use(cors(corsOptions));
// ---------

app.use(express.static(__dirname + '/public'));
app.use(express.static('node_modules/bootstrap/dist'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.use(session({
    saveUninitialized: false,
    //在初始化時要不要儲存
    resave: false,
    secret: "aaaBBBccc12345",
    //隨便的亂數
    store: sessionStore,
    cookie: {
        maxAge: 1_100_000,
    }
    // "expires": "2022-10-14T03:01:01.955Z",(結尾Z，格林標準時間)
}))
// /------------
// 1017CRUD功課
app.use((req, res, next) => {
    //自己定義template helper functions
    res.locals.toDateString = (d) => moment(d).format('YYYY-MM-DD');
    res.locals.toDatetimeString = (d) => moment(d).format('YYYY-MM-DD HH:mm:ss');
    res.locals.title = '1018自己定義網站名'
    res.locals.session = req.session;
    next();
})


//--------------------
//1013路徑模組化
app.use('/abc', require(__dirname + '/routes/admin2'));
// /abc先給相對路徑，網址列上就要打http://localhost:3001/abc/bb/aaa/50
//若沒給相對路徑，就是在根目錄



//1014
const myMiddle = (req, res, next) => {
    res.locals = { ...res.locals, pei: '早安' };
    res.locals.derrr = 1014;
    // res.myPersonal = {...res.locals, shinder:'哈囉'}; // 不建議這樣設定
    next();
};
app.get('/try-middle', [myMiddle], (req, res) => {
    res.json(res.locals);
})

// -----1014session
app.get('/try-session', (req, res) => {
    req.session.aaa ||= 0; //預設
    req.session.aaa++;
    res.json(req.session);
});

//時間格式
app.get('/try-date', (req, res) => {
    const now = new Date;
    const m = moment();

    res.send({
        t1: now,
        t2: now.toString(),
        t3: now.toDateString(),
        t4: now.toLocaleString(),
        m: m.format('YYYY-MM-DD HH:mm:ss'),
    })
});

app.get('/try-moment', (req, res) => {
    const fm = 'YYYY-MM-DD HH:mm:ss';
    const m = moment('06/10/22', 'DD/MM/YY');
    res.json({
        m,
        m1: m.format(fm),
        m2: m.tz('Asia/Tokyo').format(fm)
    })
})
//讀取資料庫
app.get('/try-db', async (req, res) => {
    const [rows] = await db.query("SELECT * FROM address_book LIMIT 5");
    res.json(rows);
})
//新增資料
app.get('/try-db-add', async (req, res) => {
    const name = '愛美';
    const email = 'Amy@gmail.com';
    const mobile = '0912000000';
    const birthday = '2022-10-14';
    const address = '新北市';
    const sql = "INSERT INTO `address_book`(`name`,  `email`,`mobile`, `birthday`, `address`, `created_at`) VALUES (?,?,?,?,?,NOW())"
    const [result] = await db.query(sql, [name, email, mobile, birthday, address]);
    res.json(result);
})
//用SET設定，但是新增的欄位必須一對一
app.get('/try-db-add2', async (req, res) => {
    const name = '恰恰';
    const email = 'chacha@gmail.com';
    const mobile = '0977777777';
    const birthday = '2022-07-07';
    const address = '台北市';
    const sql = "INSERT INTO `address_book` SET ?"
    const [result] = await db.query(sql, [{ name, email, mobile, birthday, address, created_at: new Date() }]);
    res.json(result);
})
app.use('/ab', require(__dirname + '/routes/address-book'));

// -------------
//1018假登入登出
app.get('/fake-login', (req, res) => {
    req.session.admin = {
        id: 07,
        account: 'chacha',
        nickname: '恰恰'
    };
    res.redirect('/');
});
app.get('/logout', (req, res) => {
    delete req.session.admin;
    //delete為JS的語法
    res.redirect('/');
});

//axios連到外部網站
app.get('/yahoo',async(req,res)=>{
    const response = await axios.get('https://tw.yahoo.com/');
    res.send(response.data);
})
//----------------------------

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