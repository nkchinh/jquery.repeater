/* eslint-disable no-param-reassign */
import $ from 'jquery';

export function identity(x) {
	return x;
}

export function isArray(value) {
	return $.isArray(value);
}

export function isObject(value) {
	return !isArray(value) && (value instanceof Object);
}

export function isNumber(value) {
	return value instanceof Number;
}

export function isFunction(value) {
	return value instanceof Function;
}

export function indexOf(object, value) {
	return $.inArray(value, object);
}

export function inArray(array, value) {
	return indexOf(array, value) !== -1;
}

export function foreach(collection, callback) {
	if (collection) {
		Object.keys(collection)
			.forEach(i => callback(collection[i], i, collection));
	}
}


export function last(array) {
	return array[array.length - 1];
}

export function argumentsToArray(args) {
	return Array.prototype.slice.call(args);
}

export function extend(...args) {
	const extended = {};
	foreach(args, (o) => {
		foreach(o, (val, key) => {
			extended[key] = val;
		});
	});
	return extended;
}

export function mapToArray(collection, callback) {
	const mapped = [];
	foreach(collection, (value, key, coll) => {
		mapped.push(callback(value, key, coll));
	});
	return mapped;
}

export function mapToObject(collection, callback, keyCallback) {
	const mapped = {};
	foreach(collection, (value, key, coll) => {
		// eslint-disable-next-line no-param-reassign
		key = keyCallback ? keyCallback(key, value) : key;
		mapped[key] = callback(value, key, coll);
	});
	return mapped;
}

export function map(collection, callback, keyCallback) {
	return isArray(collection)
		? mapToArray(collection, callback)
		: mapToObject(collection, callback, keyCallback);
}

export function pluck(arrayOfObjects, key) {
	return map(arrayOfObjects, val => val[key]);
}

export function filter(collection, callback) {
	let filtered;

	if (isArray(collection)) {
		filtered = [];
		foreach(collection, (val, key, coll) => {
			if (callback(val, key, coll)) {
				filtered.push(val);
			}
		});
	} else {
		filtered = {};
		foreach(collection, (val, key, coll) => {
			if (callback(val, key, coll)) {
				filtered[key] = val;
			}
		});
	}

	return filtered;
}

export function call(collection, funcName, args) {
	return map(collection, (object, _) => object[funcName](...(args || [])));
}

// execute callback immediately and at most one time on the minimumInterval,
// ignore block attempts
export function throttle(minimumInterval, callback) {
	let timeout = null;
	return function (...args) {
		const that = this;
		if (timeout === null) {
			timeout = setTimeout(() => {
				timeout = null;
			}, minimumInterval);
			callback.apply(that, args);
		}
	};
}


export function mixinPubSub(object) {
	object = object || {};
	const topics = {};

	object.publish = function (topic, data) {
		foreach(topics[topic], (callback) => {
			callback(data);
		});
	};

	object.subscribe = function (topic, callback) {
		topics[topic] = topics[topic] || [];
		topics[topic].push(callback);
	};

	object.unsubscribe = function (callback) {
		foreach(topics, (subscribers) => {
			const index = indexOf(subscribers, callback);
			if (index !== -1) {
				subscribers.splice(index, 1);
			}
		});
	};

	return object;
}
