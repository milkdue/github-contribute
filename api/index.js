/*
 * @Author: 可以清心
 * @Description: 
 * @Date: 2023-01-21 21:43:31
 * @LastEditTime: 2023-01-21 21:50:31
 * @FilePath: \github-contribute\api\index.js
 */
const https = require("https");
module.exports = (req, res) => {  
    const NAME = req.query.name;

    let html = "";

    https.get(`https://github.com/${NAME}`, function(resp){
        resp.on("data", function(chunk){
            html += chunk;
        });

        resp.on("end", function(){
            res.status(200).json({
                code: 200,
                html
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