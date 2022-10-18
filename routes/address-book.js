//1014引入address-book資料
const express = require('express');
const router = express.Router();
const db = require(__dirname + '/../modules/db_connect2');
const upload = require(__dirname + '/../modules/upload-img');

router.use((req, res, next) => {
    if (req.session.admin && req.session.admin.account) {
        next();
    } else {
        res.status(403).send('沒有權限掰掰')
        //沒有權限通常用403
    }

})
async function getListData(req) {
    const perPage = 30;
    let page = +req.query.page || 1;
    if (page < 1) {
        return res.redirect(req.baseUrl);
        //當頁數小於1，跳轉到http://
    }
    //1017增加搜尋功能
    let search = req.query.search ? req.query.search.trim() : '';
    let where = ` WHERE 1 `;
    if (search) {
        where += ` AND(
             \`name\` LIKE ${db.escape('%' + search + '%')} 
             OR
            \`address\` LIKE ${db.escape('%' + search + '%')}
        )`;
    }


    //把斯尋條件where帶入
    const t_sql = `SELECT COUNT(1) totalRows FROM address_book ${where}`;
    const [[{ totalRows }]] = await db.query(t_sql);
    //找陣列中的陣列的物件[[{}]]

    let totalPages = 0;
    let rows = [];
    if (totalRows > 0) {
        totalPages = Math.ceil(totalRows / perPage);
        //Math.ceil讓數字無條件進位
        if (page > totalPages) {
            return res.redirect(`?page=${totalPages}`)
        }
        //跳轉的頁數大於總頁數，就回到最後一頁
        //把斯尋條件where帶入
        const sql = `SELECT * FROM address_book ${where} ORDER BY sid DESC LIMIT ${(page - 1) * perPage}, ${perPage}`;
        [rows] = await db.query(sql);
    }
    return { totalRows, totalPages, perPage, page, rows, search, query: req.query };
}
//CRUD

// 1018新增資料
router.get('/add', async (req, res) => {
    //給網站名稱
    res.locals.title = '新增資料 | ' + res.locals.title;
    res.render('address-book/add');
});
router.post('/add', upload.none(), async (req, res) => {
    //res.json(req.body);
    const output = {
        success: false,
        code: 0,
        erroe: {},
        postData: req.body,
    };
    //查欄位的格式, 可以用 joi套件
    const sql = "INSERT INTO `address_book`( `name`, `email`, `mobile`, `birthday`, `address`, `created_at`) VALUES (?,?,?,?,?, NOW())";
    const [result] = await db.query(sql, [
        req.body.name,
        req.body.email,
        req.body.mobile,
        req.body.birthday || null,
        req.body.address,
    ]);
    if (result.affectedRows) output.success = true;
    res.json(output);
});

//1018修改資料
router.get('/edit/:sid', async (req, res) => {
    const sql = " SELECT * FROM address_book WHERE sid=?";
    const [rows] = await db.query(sql, [req.params.sid]);
    if (!rows || !rows.length) {
        return res.redirect(req.baseUrl); // 跳轉到列表頁
    }
    //res.json(rows[0]);
    res.render('address-book/edit', rows[0]);
});
router.put('/edit/:sid', async (req, res) => {
    //res.json(req.body);
    // res.render('address-book/edit')
    const output = {
        success: false,
        code: 0,
        error: {},
        postData: req.body,//除錯
    }
    const sql = "UPDATE `address_book` SET `name`=?,`email`=?,`mobile`=?,`birthday`=?,`address`=? WHERE `sid`=?";
    const [result] = await db.query(sql, [
        req.body.name,
        req.body.email,
        req.body.mobile,
        req.body.birthday || null,
        req.body.address,
        req.params.sid
    ]);
    // console.log(result);
    // if(result.affectedRows) output.success = true;
    if (result.changedRows) output.success = true;
    res.json(output);

});
//刪除資料
router.delete('/del/:sid', async (req, res) => {
    const sql = " DELETE FROM address_book WHERE sid=?";
    const [result] = await db.query(sql, [req.params.sid]);

    res.json({ success: !!result.affectedRows, result });
});

// --------------
router.get('/item/:id', async (req, res) => {
    // 讀取單筆資料
});
// 
router.get(['/', '/list'], async (req, res) => {
    const data = await getListData(req);
    res.render('address-book/list', data);
});
router.get(['/api', '/api/list'], async (req, res) => {
    res.json(await getListData(req));
});

module.exports = router;