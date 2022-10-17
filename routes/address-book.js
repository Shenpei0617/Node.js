//1014引入address-book資料
const express = require('express');
const router = express.Router();
const db = require(__dirname + '/../modules/db_connect2');

router.use((req, res, next) => {
    next();
})
async function getListData(req){
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
            \`address\` LIKE ${db.escape('%'+search+'%')}
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
    return { totalRows, totalPages, perPage, page, rows,search,query: req.query };
}
//CRUD
router.get(['/','/list'],async(req,res)=>{
    const data = await getListData(req);
    res.render('address-book/list',data);
});
router.get(['/api','/api/list'],async(req,res)=>{
     res.json(await getListData(req));    
});
module.exports = router;