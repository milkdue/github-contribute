/*
 * @Author: 可以清心
 * @Description: 
 * @Date: 2023-01-21 21:43:31
 * @LastEditTime: 2023-07-17 19:26:02
 * @FilePath: \github-contribute\api\index.js
 */
const https = require("https");
const cheerio = require("cheerio");
const dayjs = require('dayjs');

// module.exports = (req, res) => {  
//     const NAME = req.query.name;
//     let html = "";

//     https.get(`https://github.com/${NAME}`, function(resp){
//         resp.on("data", function(chunk){
//             html += chunk;
//         });

//         resp.on("end", function(){
//             let result = [];
//             let total = 0;

//             const $ = cheerio.load(html);

            
//             $(".js-yearly-contributions > .position-relative .js-calendar-graph > .js-calendar-graph-svg > g > g").each((index, g) => {
//                 let item = [];
//                 $(g).find("rect").each((index, rect) => {
//                     const $r = $(rect);

//                     const date = $r.attr("data-date");
                    
//                     const text = $r.text();
//                     let count = parseInt(text);

//                     if(!isNaN(count)){
//                         total += count;
//                     }else{
//                         count = 0;
//                     }

//                     item.push({
//                         date,
//                         count
//                     })
//                 })

//                 result.push(item);
//             })

//             res.status(200).json({
//                 total,
//                 contributions: result
//             })
//         });

//         resp.on("error", error => {
//             res.status(500).json({
//                 code: 500,
//                 message: "请求超时"
//             })
//         })
//     })
// }

// github改变了图形的渲染dom

module.exports = (req, res) => {  
    const NAME = req.query.name;
    let html = "";

    https.get(`https://github.com/${NAME}`, function(resp){
        resp.on("data", function(chunk){
            html += chunk;
        });

        resp.on("end", function(){
            let map = new Map();
            let result = [];
            let total = 0;

            const $ = cheerio.load(html);

            $(".js-yearly-contributions > .position-relative .js-calendar-graph table tbody tr").each((trIndex, tr) => {
                map.set(trIndex, []);
                $(tr).find("td").each((tdIndex, td) => {
                    if (tdIndex !== 0) {
                        const $r = $(td);
                        const date = $r.attr("data-date");
                        const text = $r.text();
                        let count = parseInt(text);

                        if(!isNaN(count)){
                            total += count;
                        }else{
                            count = 0;
                        }

                        map.get(trIndex).push({
                            date,
                            count
                        })
                    }
                })
            })

            let indexList = [0, 1, 2, 3, 4, 5, 6];
            let length = map.get(0).length;
            let all = new Array(length).fill(0);

            all.forEach((item, index) => {
                let contribute = [];
                indexList.forEach(item => {
                    const contriution = map.get(item)[index];
                    // if (!contriution.date) {
                    //     const length = contribute.length;
                    //     contriution.date = dayjs(contribute[length - 1]).subtract(-1, 'day').format('YYYY-MM-DD')
                    // }

                    // contribute.push(contriution);

                    contriution.date && contribute.push(contriution);
                })
            
                result.push(contribute);
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