import { Router } from 'express'
import { getRefreshToken, getToken, validate2FA, generate2FACode } from "../controllers/bbva.auth.controller";
const router = Router()


router

    .post(`/generate-2fa-code`, generate2FACode)

    .post(`/validate-2fa`, validate2FA)

    .post('/refresh-token', getRefreshToken)

    .post('/token', getToken);


export { router };
