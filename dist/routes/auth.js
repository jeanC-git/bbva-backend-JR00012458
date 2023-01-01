"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const bbva_auth_controller_1 = require("../controllers/bbva.auth.controller");
const router = (0, express_1.Router)();
exports.router = router;
router
    .post(`/generate-2fa-code`, bbva_auth_controller_1.generate2FACode)
    .post(`/validate-2fa`, bbva_auth_controller_1.validate2FA)
    .post('/refresh-token', bbva_auth_controller_1.getRefreshToken)
    .post('/token', bbva_auth_controller_1.getToken);
//# sourceMappingURL=auth.js.map