const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const promisify = require('util').promisify;
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const config = require('../config/defautConfig');
const mime = require('../helper/mime');
const compress = require('../helper/compress');

/* 文件页模板*/ 
const tplPath = path.join(__dirname,'../template/dir.tpl');
const source = fs.readFileSync(tplPath);
const template = handlebars.compile(source.toString());



module.exports = async function(req,res,filePath){
    try{
        const stats = await stat(filePath);
        if(stats.isFile()){
            const contentType = mime(filePath);
            res.statusCode = 200;
            res.setHeader('Content-Type',contentType);
            let rs = fs.createReadStream(filePath);
            if(filePath.match(config.compress)){
                compress(rs,req,res);
            }
        }else if(stats.isDirectory()){
            const files = await readdir(filePath);
            res.statusCode = 200;
            res.setHeader('Content-Type','text/html');
            const dir = path.relative(config.root, filePath);
            const data = {
                files:files.map(file=>{
                    return {
                        file,
                        icon:mime(file)
                    };
                }),
                path:path.basename(filePath),
                dir:dir?`/${dir}`:''
            };
            // res.end(files.join(','));
            res.end(template(data));
        }
    }catch(err){
        console.error(err);
        res.statusCode = 404;
        res.setHeader('Content-Type','text/plain');
        res.write(filePath+'\n');
        res.end(`${filePath} is not a directory or file`);
    }
};

