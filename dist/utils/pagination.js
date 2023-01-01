"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPagination = exports.getPagingData = void 0;
const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
    return { totalItems, rows, totalPages, currentPage };
};
exports.getPagingData = getPagingData;
const getPagination = (page, size) => {
    const limit = size ? +size : 3;
    const offset = page ? page * limit : 0;
    return { limit, offset };
};
exports.getPagination = getPagination;
//# sourceMappingURL=pagination.js.map