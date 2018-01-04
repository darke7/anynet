const {createGzip,createDeflate} = require('zlib');

module.exports = (rs,req,res)=>{
    const acceptEngcoding = req.headers['accept-engcoding'];
    if(!acceptEngcoding||!acceptEngcoding.match(/\b(gzip|deflate)\b/)){
        return rs;
    }else if(acceptEngcoding.match(/\bgzip\b/)){
        res.setHeader('Content-Encoding','gzip');
        return rs.pipe(createGzip());
    }else if(acceptEngcoding.match(/\bdeflate\b/)){
        res.setHeader('Content-Encoding','deflate');
        return rs.pipe(createDeflate());
    }

};