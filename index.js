/*
 * @Author: 可以清心
 * @Description: 
 * @Date: 2023-01-21 21:21:37
 * @LastEditTime: 2023-01-21 21:26:36
 * @FilePath: \github-contribute\index.js
 */
const https = require("https");
const fs = require("fs");
const cheerio = require("cheerio");

const name = "milkdue";
let html = "";


https.get("https://github.com/milkdue", function(res){
    res.on("data", function(chunk){
        html += chunk;
    })

    res.on("end", function(){
        console.log(html)
    })
})