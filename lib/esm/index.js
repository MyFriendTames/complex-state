var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { useState } from 'react';
export var useComplexState = function (defaultValue) {
    var _a = useState(defaultValue), state = _a[0], setState = _a[1];
    var _setState = function (value, path) {
        if (path === void 0) { path = ''; }
        return isValidPath(path) && setState(function (prev) { return buildState(prev, path, value); });
    };
    var unset = function (path) { return isValidPath(path) && setState(function (prev) { return buildState(prev, path, undefined, undefined, true); }); };
    return [state, _setState, unset];
};
var buildState = function (prev, path, value, tail, unset) {
    var _a;
    if (tail === void 0) { tail = ''; }
    if (unset === void 0) { unset = false; }
    if (typeof path === 'string')
        path = (path || '').split('.');
    if (!path.length) {
        return typeof value === 'function' ? value(prev) : value;
    }
    else {
        var isNull = prev == null;
        var key_1 = path[0];
        var _unset = unset && path.length === 1;
        if (!isNull && typeof prev === 'object') {
            if (!_unset) {
                var result_1 = buildState(prev[key_1], path.slice(1), value, !tail.length ? key_1 : tail + "." + key_1, unset);
                if (Array.isArray(prev)) {
                    return prev.map(function (_prev, index) { return index == key_1 ? result_1 : _prev; });
                }
                return __assign(__assign({}, prev), (_a = {}, _a[key_1] = result_1, _a));
            }
            if (Array.isArray(prev)) {
                return prev.filter(function (_, index) { return index != key_1; });
            }
            var _b = prev, _c = key_1, _ = _b[_c], rest = __rest(_b, [typeof _c === "symbol" ? _c : _c + ""]);
            return rest;
        }
        if (!_unset)
            throw new Error("useComplexState: cannot read property '" + key_1 + "' of '" + (isNull ? prev : typeof prev) + "' in '" + tail + "'");
        throw new Error("useComplexState: cannot unset property '" + key_1 + "' of '" + (isNull ? prev : typeof prev) + "' in '" + tail + "'");
    }
};
var isValidPath = function (path) {
    if (typeof path === 'string') {
        return true;
    }
    throw new Error("useComplexState: 'path' parameter must be a 'string' value");
};
