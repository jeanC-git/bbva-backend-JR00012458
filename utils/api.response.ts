import {errorInterface, successInterface} from "../interfaces/api.responses.interfaces";
import {Response} from 'express'

export const success = (res: Response, data: successInterface) => {
    res.status(data.httpCode ?? 200).json(data.bodyData);
}

export const error = (res: Response, data: errorInterface) => {
    res.status(data.httpCode ?? 500).json(data.bodyData);
}
