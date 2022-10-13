//路由模組化
const express = require('express');
const router = express.Router();
router.get('/bb/:action?/:id?',(req,res)=>{
    const {params, url, baseUrl, originalUrl} = req;
    res.json({params, url, baseUrl, originalUrl} )
});
module.exports = router;