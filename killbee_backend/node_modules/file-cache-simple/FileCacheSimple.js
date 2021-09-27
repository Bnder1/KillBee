"use strict";

const jetpack = require('fs-jetpack');

const path = require('path');
const util = require('util');

const DEFAULT_OPTIONS = {
	'cacheDir': process.cwd() + '/cache',
	'cacheExpire': 3600 * 1000, // 1hr
	'prefix': 'cs',
	'fixCacheExpire': false,
	'rejectOnNull': false
};

let FileCacheSimple = function(options) {
	this._options = Object.assign({}, DEFAULT_OPTIONS, options);
	this._fs = jetpack.cwd(this._options.cacheDir);
};

FileCacheSimple.prototype.set = function(key, value, fixCacheExpire) {
	let cacheFile = util.format('%s.%s.json', this._options.prefix, key);
	let cacheObj = {
		'cachedOn': (new Date()).toISOString(),
		'content': value
	};
	if(this._options.fixCacheExpire || fixCacheExpire)
		cacheObj.cacheExpire = (fixCacheExpire) ? fixCacheExpire : this._options.cacheExpire;
	return this._fs.writeAsync(cacheFile, cacheObj);
};

FileCacheSimple.prototype.get = function(key) {
	let self = this;
	return new Promise(function(resolve, reject) {
		let cacheFile = util.format('%s.%s.json', self._options.prefix, key);
		self._fs.readAsync(cacheFile, 'jsonWithDates')
			.then(function(cache) {
				if(!cache || cache === null) {
					if(self._options.rejectOnNull)
						return reject();
					return resolve(null);
				}

				let currentTime = (new Date()).getTime();
				let cacheExpire = (cache.cacheExpire) ? cache.cacheExpire : self._options.cacheExpire;
				if(currentTime - cache.cachedOn >= cacheExpire) {
					if(self._options.rejectOnNull)
						return reject();
					return resolve(null);
				}
				return resolve(cache.content);
			})
			.catch(reject);
	});
};

FileCacheSimple.prototype.remove = function(key) {
	let cacheFile = util.format('%s.%s.json', this._options.prefix, key);
	return this._fs.removeAsync(cacheFile);
};

exports = module.exports = FileCacheSimple;
