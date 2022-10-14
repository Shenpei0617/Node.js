//路由模組化
const express = require('express');
const router = express.Router();
console.log('admin2',express.pei);

router.use((req,res,next)=>{
    res.locals.my = 123;

    next();
}
)

router.get('/:action?/:id?',(req,res)=>{
    const {params, url, baseUrl, originalUrl} = req;
    res.json({params, url, baseUrl, originalUrl} )
});
module.exports = router;