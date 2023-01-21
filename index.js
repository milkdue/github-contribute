/*
 * @Author: 可以清心
 * @Description: 
 * @Date: 2023-01-21 21:21:37
 * @LastEditTime: 2023-01-21 22:25:43
 * @FilePath: \github-contribute\index.js
 */
const https = require("http");
const fs = require("fs");
const cheerio = require("cheerio");

const name = "milkdue";
let html = "";


https.get("http://127.0.0.1:5500/milkdue.html", function(res){
    res.on("data", function(chunk){
        html += chunk;
    })
    let result = [];
    let total = 0;

    const $ = cheerio.load(html);

    res.on("end", function(){
        $(".js-yearly-contributions > .position-relative .js-calendar-graph > .js-calendar-graph-svg > g > g").each(g => {
            let item = [];
            $(g).find("rect").each(rect => {
                const $r = $(rect);

                const date = $r.attr("data-date");
                const count = Number($r.attr("data-level"));

                if(!isNaN(count)){
                    total += count;
                }

                item.push({
                    date,
                    count
                })
            })

            result.push(item);
        })

        console.log(result);
    })
})