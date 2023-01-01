"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.error = exports.success = void 0;
const success = (res, data) => {
    var _a;
    res.status((_a = data.httpCode) !== null && _a !== void 0 ? _a : 200).json(data.bodyData);
};
exports.success = success;
const error = (res, data) => {
    var _a;
    res.status((_a = data.httpCode) !== null && _a !== void 0 ? _a : 500).json(data.bodyData);
};
exports.error = error;
//# sourceMappingURL=api.response.js.map