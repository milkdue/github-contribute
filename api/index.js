/*
 * @Author: 可以清心
 * @Description: 
 * @Date: 2023-01-21 21:43:31
 * @LastEditTime: 2023-01-21 23:16:57
 * @FilePath: \github-contribute\api\index.js
 */
const https = require("https");
const cheerio = require("cheerio");

module.exports = (req, res) => {  
    const NAME = req.query.name;
    // *.keyiqingxin.cn
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin","*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers","content-type");
    //跨域允许的请求方式 
    res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");

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