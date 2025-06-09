/*
 * @Author: 可以清心
 * @Description:
 * @Date: 2023-01-21 22:46:11
 * @LastEditTime: 2024-11-08 15:54:03
 */
const https = require("https");
const cheerio = require("cheerio");
const dayjs = require("dayjs");

let html = "";

https.get(`https://github.com/milkdue`, function (resp) {
	resp.on("data", function (chunk) {
		html += chunk;
	});

	resp.on("end", function () {
		let map = new Map();
		let result = [];
		let total = 0;
		console.info(1111)

		const $ = cheerio.load(html);

		console.info($, "$")

		$(
			".js-calendar-graph-table tbody tr",
		).each((trIndex, tr) => {
			console.info(tr, "tr")
			// map.set(trIndex, []);
			// console.log(tr, "trNode");
			// $(tr).find("td").each((tdIndex, td) => {
			// 	if (tdIndex !== 0) {
			// 		const $r = $(td);
			// 		const date = $r.attr("data-date");
			// 		const text = $r.text();

			// 		console.info(date, "date");
			// 		console.info(text, "text")
			// 		const id = $r.attr("id");
			// 	}
			// })
		})
		
	});

	resp.on("error", (error) => {
		console.error(error);
	});
});
