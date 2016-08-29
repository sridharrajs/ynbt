/**
 * Created by sridharrajs on 6/30/16.
 */

'use strict';

let pageUtil = require('../utils/page-utils');
let networkUtils = require('../utils/network-utils');

class PageController {

	static fetchPage(rawURL) {
		return networkUtils.makeGET(rawURL).then((body)=> {
			return pageUtil.parse(body);
		}).then((article)=> {
			return Promise.resolve(article);
		}).catch((err) => {
			return Promise.reject(err);
		});
	}

}

module.exports = PageController;