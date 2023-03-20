'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * Set a value by a dot path.
 * @param obj The object to evaluate.
 * @param prop The path to be set.
 * @param value The value to set.
 */

function set(obj, prop, value) {
	prop = typeof prop === 'number' ? propToArray(prop.toString()) : typeof prop === 'string' ? propToArray(prop) : prop;

	const setPropImmutableRec = (obj, prop, value, i) => {
		let clone, head = prop[i];

		if (prop.length > i) {
			if (Array.isArray(obj)) {
				head = getArrayIndex(head, obj);
				clone = obj.slice();
			} else {
				clone = Object.assign({}, obj);
			}
			clone[head] = setPropImmutableRec(obj[head] !== undefined ? obj[head] : {}, prop, value, i + 1);
			return clone;
		}

		return typeof value === 'function' ? value(obj) : value;
	};

	return setPropImmutableRec(obj, prop, value, 0);
}

/**
 * Get a value by a dot path.
 * @param obj The object to evaluate.
 * @param prop The path to value that should be returned.
 * @param [value] The default value that should be returned when the target doesn't exist.
 */
function get(obj, prop, value) {
	prop = typeof prop === 'number' ? propToArray(prop.toString()) : typeof prop === 'string' ? propToArray(prop) : prop;

	for (var i = 0; i < prop.length; i++) {
		if (obj === null || typeof obj !== 'object') {
			return value;
		}
		let head = prop[i];
		if (Array.isArray(obj) && head === '$end') {
			head = obj.length - 1;
		}
		obj = obj[head];
	}

	if (typeof obj === 'undefined') {
		return value;
	}

	return obj;
}

/**
 * Delete a property by a dot path.
 * If target container is an object, the property is deleted.
 * If target container is an array, the index is deleted.
 * If target container is undefined, nothing is deleted.
 * @param obj The object to evaluate.
 * @param prop The path to the property or index that should be deleted.
 */
function _delete(obj, prop) {
	prop = typeof prop === 'number' ? propToArray(prop.toString()) : typeof prop === 'string' ? propToArray(prop) : prop;

	const deletePropImmutableRec = (obj, prop, i) => {
		let clone, head = prop[i];

		if (obj === null || typeof obj !== 'object' ||
			!Array.isArray(obj) && obj[head] === undefined) {

			return obj;
		}

		if (prop.length - 1 > i) {
			if (Array.isArray(obj)) {
				head = getArrayIndex(head, obj);
				clone = obj.slice();
			} else {
				clone = Object.assign({}, obj);
			}

			clone[head] = deletePropImmutableRec(obj[head], prop, i + 1);
			return clone;
		}

		if (Array.isArray(obj)) {
			head = getArrayIndex(head, obj);
			clone = [].concat(obj.slice(0, head), obj.slice(head + 1));
		} else {
			clone = Object.assign({}, obj);
			delete clone[head];
		}

		return clone;
	};

	return deletePropImmutableRec(obj, prop, 0);
}

/**
 * Toggles a value.  The target value is evaluated using Boolean(currentValue).  The result will always be a JSON boolean.
 * Be careful with strings as target value, as "true" and "false" will toggle to false, but "0" will toggle to true.
 * Here is what Javascript considers false:  0, -0, null, false, NaN, undefined, and the empty string ("")
 * @param obj The object to evaluate.
 * @param prop The path to the value.
 */
function toggle(obj, prop) {
	const curVal = get(obj, prop);
	return set(obj, prop, !Boolean(curVal));
}

/**
 * Merges a value.  The target value must be an object, array, null, or undefined.
 * If target is an object, Object.assign({}, target, param) is used.
 * If target an array, target.concat(param) is used.
 * If target is null or undefined, the value is simply set.
 * @param obj The object to evaluate.
 * @param prop The path to the value.
 * @param val The value to merge into the target value.
 */
function merge(obj, prop, val) {
	const curVal = get(obj, prop);
	if (typeof curVal === 'object') {
		if (Array.isArray(curVal)) {
			return set(obj, prop, curVal.concat(val));
		} else if (curVal === null) {
			return set(obj, prop, val);
		}
		else {
			let merged = Object.assign({}, curVal, val);
			return set(obj, prop, merged);
		}
	} else if (typeof curVal === 'undefined') {
		return set(obj, prop, val);
	}
	else {
		return obj;
	}
}

function getArrayIndex(head, obj) {
	if (head === '$end') {
		head = Math.max(obj.length - 1, 0);
	}
	if (!/^\+?\d+$/.test(head)) {
		throw new Error(`Array index '${head}' has to be an integer`);
	}
	return parseInt(head);
}

function propToArray(prop) {
	return prop.split('.').reduce((ret, el, index, list) => {
		const last = index > 0 && list[index - 1];
		if (last && /(?:^|[^\\])\\$/.test(last)) {
			const prev = ret.pop();
			ret.push(prev.slice(0, -1) + '.' + el);
		} else {
			ret.push(el);
		}
		return ret;
	}, []);
}

var lib = {
	set,
	get,
	delete: _delete,
	toggle,
	merge
};

var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
const visibleGroup = ({ map, groupId, type, options }) => {
  const { groupKey, onlyGroup, returnStyle } = options;
  const key = groupKey ? groupKey : "vallaris:group";
  const styles = map.getStyle();
  const { layers } = styles;
  let newLayers = [];
  for (let i = 0; i < layers.length; i++) {
    const layer = layers[i];
    if (layer.metadata && layer.metadata[key] && layer.metadata[key] === groupId) {
      let input = __spreadValues({}, layer);
      const newInput = lib.set(input, "layout.visibility", type);
      newLayers.push(newInput);
      map.setLayoutProperty(layer.id, "visibility", type);
    } else {
      newLayers.push(layer);
      if (onlyGroup && type === "visible")
        map.setLayoutProperty(layer.id, "visibility", "none");
    }
  }
  if (returnStyle) {
    let newStyle = __spreadValues({}, styles);
    newStyle.layers = newLayers;
    return newStyle;
  }
};
const renderGroup = ({ styles, groupIds, options }) => {
  const { groupKey } = options;
  const key = groupKey ? groupKey : "vallaris:group";
  let groups = [];
  const { layers } = styles;
  const filterLayers = layers.filter(
    (l) => l.metadata && l.metadata[key] && groupIds.includes(l.metadata[key])
  );
  filterLayers.map((l) => {
    const layers2 = renderLayers({ styles, metadataKey: l.metadata[key] });
    let input = { groupId: l.metadata[key], layers: layers2 };
    groups.push(input);
  });
  return groups;
};
const selectLayers = ({ styles, args }) => {
  const { layers } = styles;
  let newRender = [];
  layers.map((l) => {
    if (args.includes(l.id)) {
      newRender.push(l);
    }
  });
  return newRender;
};
const renderLayers = ({ styles, metadataKey }) => {
  const { layers } = styles;
  let newRender = [];
  layers.map((l) => {
    const newMetadata = lib.get(l, "metadata") ? Object.keys(lib.get(l, "metadata")).filter((mt) => mt === metadataKey) : [];
    if (newMetadata.length) {
      newRender.push(l);
    }
  });
  return newRender;
};

const defaultHOST = "https://cloud.vallarismaps.com";
var config;
const initial = ({ host, apiKey }) => {
  config.host = host ? host : defaultHOST;
  if (config.apiKey) ; else {
    throw new Error("API Key is require please check in management > API Key");
  }
};

exports.initial = initial;
exports.renderGroup = renderGroup;
exports.renderLayers = renderLayers;
exports.selectLayers = selectLayers;
exports.visibleGroup = visibleGroup;
//# sourceMappingURL=vallaris-js.cjs.map