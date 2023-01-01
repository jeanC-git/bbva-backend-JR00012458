import { Router } from 'express'
import { validateTransaction, updateBalance } from "../controllers/bbva.business.logic.controller";
import { validateJWT } from '../middleware/validateJWT';
const router = Router()


router
    .post('/validate-transaction', validateJWT, validateTransaction)

    .post('/update-balance', updateBalance);


export { router };
