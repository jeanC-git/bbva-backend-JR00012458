"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const bbva_business_logic_controller_1 = require("../controllers/bbva.business.logic.controller");
const validateJWT_1 = require("../middleware/validateJWT");
const router = (0, express_1.Router)();
exports.router = router;
router
    .post('/validate-transaction', validateJWT_1.validateJWT, bbva_business_logic_controller_1.validateTransaction)
    .post('/update-balance', bbva_business_logic_controller_1.updateBalance);
//# sourceMappingURL=bbva-services.js.map