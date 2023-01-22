/*
 * @Author: 可以清心
 * @Description: 
 * @Date: 2023-01-21 21:43:31
 * @LastEditTime: 2023-01-22 09:28:21
 * @FilePath: \github-contribute\api\index.js
 */
const https = require("https");
const cheerio = require("cheerio");

module.exports = (req, res) => {  
    const NAME = req.query.name;
    let html = "";

    https.get(`https://github.com/${NAME}`, function(resp){
        resp.on("data", function(chunk){
            html += chunk;
        });

        resp.on("end", function(){
            let result = [];
            let total = 0;

            const $ = cheerio.load(html);

            
            $(".js-yearly-contributions > .position-relative .js-calendar-graph > .js-calendar-graph-svg > g > g").each((index, g) => {
                let item = [];
                $(g).find("rect").each((index, rect) => {
                    const $r = $(rect);

                    const date = $r.attr("data-date");
                    const count = Number($r.attr("data-level"));
                    // const count = $r.attr("data-level");

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

            res.status(200).json({
                total,
                contributions: result
            })
        });

        resp.on("error", error => {
            res.status(500).json({
                code: 500,
                message: "请求超时"
            })
        })
    })
}