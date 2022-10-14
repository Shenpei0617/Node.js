//1014引入address-book資料
const express = require('express');
const router = express.Router();
const db = require(__dirname + '/../modules/db_connect2');

router.use((req,res,next)=>{
    next();
})
router.get('/', async (req,res)=>{
    const perPage = 20;
    let page = +req.query.page ||1;
    if(page<1){
        return res.redirect(req.baseUrl);
        //當頁數小於1，跳轉到http://
    }

    const t_sql= "SELECT COUNT(1) totalRows FROM address_book";
    const[[{totalRows}]] = await db.query(t_sql);
    //找陣列中的陣列的物件[[{}]]
    
    let totalPages = 0;
    let rows = [];
    if(totalRows>0){
        totalPages = Math.ceil(totalRows/perPage);
        //Math.ceil讓數字無條件進位
        if(page>totalPages){
            return res.redirect(`?page=${totalPages}`)
        }
        //跳轉的頁數大於總頁數，就回到最後一頁

        const sql =`SELECT * FROM address_book ORDER BY sid DESC LIMIT ${(page-1)*perPage}, ${perPage}`;
        [rows]=await db.query(sql);
    }
    
    res.json({totalRows,totalPages,perPage,page,rows});
    //查總筆數
})
module.exports = router;