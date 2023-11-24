/*
 * @Author: 可以清心
 * @Description: 
 * @Date: 2023-01-21 22:46:11
 * @LastEditTime: 2023-11-24 14:20:12
 */
const http = require("http");
const cheerio = require("cheerio");
const dayjs = require('dayjs');

let html = "";

http.get(`http://127.0.0.1:61416/milkdue.html`, function(resp){
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
                console.log(tr, 'trNode')
                $(tr).find("td").each((tdIndex, td) => {
                    if (tdIndex !== 0) {
                        const $r = $(td);
                        const date = $r.attr("data-date");
                        // text 修正为 tool-tip
                        // const text = $r.text();
                        // const id = $r.attr("id");;
                        // console.info($(`tool-tip[for="${id}"]`));
                        // const text = $(`tool-tip[for="${$r.attr('id')}"]`).text();
                        const textNode = $(`tool-tip[for="${$r.attr('id')}"]`).children()[0];
                        let text = "";

                        if (textNode) {
                          if (textNode.next) {
                            text = textNode.next.data;
                          }
                        }
                        // console.log($(`tool-tip[for="${$r.attr('id')}"]`).children()[0].next.data, 'text');
                        // const text = $(`tool-tip[for="${$r.attr('id')}"]"`).text();
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

            console.log(total);
            console.log(result);
        });

        resp.on("error", error => {
            console.error(error);
        })
    })