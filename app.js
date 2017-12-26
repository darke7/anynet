const http = require('http');
const chalk = require('chalk');
const conf = require('./config/defautConfig');

const server = http.createServer((req,res)=>{
    res.statusCode = 200;
    res.setHeader('Conent-Type','text/html');
    res.write('<h1>');
    res.end('hello http! </h1>');
});
server.listen(conf.port,conf.hostname,()=>{
    const addr = `http://${conf.hostname}:${conf.port}`;
    console.info(`Server started at ${chalk.green(addr)}`);
});
